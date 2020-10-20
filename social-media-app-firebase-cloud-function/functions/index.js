const functions = require('firebase-functions');
const express =require('express')
const app=express()


const FBAuth=require('./util/FBAuth')

const {db}=require('./util/admin')

const cors=require('cors');
app.use(cors())

//Scream routes
const {getAllScreams,postOneScream,getScream,commentOnScream,likeOnScream,unlikeOnScream,deleteScream}=require('./handlers/screams')


app.get('/screams',getAllScreams);//get all screams [used in containers/Home.js]
app.post('/scream',FBAuth,postOneScream);//post one scream [used in component/layout/PostScream.js]
app.get('/scream/:screamId',getScream);//get one scream [used in component/scream/ScreamDialog.js]
app.post('/scream/:screamId/comment',FBAuth,commentOnScream);//comment on scream [used in component/scream/CommentForm.js]
app.get('/scream/:screamId/like',FBAuth,likeOnScream);//like on scream [used in component/scream/LikeButton.js]
app.get('/scream/:screamId/unlike',FBAuth,unlikeOnScream);//unlike on scream [used in component/scream/LikeButton.js]
app.delete('/scream/:screamId',FBAuth,deleteScream);//delete the scream [used in component/scream/DeleteScream.js]



//Users routes
const {signup,login,uploadImage,addUserDetails,getAuthenticatedUser,getUserDetails,markNotificationsRead}=require('./handlers/users')

app.post('/signup',signup);//Signup route [used in containers/Signup.js]
app.post('/login',login);//Signin route [used in containers/Login.js]
app.post('/user/image',FBAuth,uploadImage);//uploadImage route [used in components/profile/Profile.js]
app.post('/user',FBAuth,addUserDetails);//Post User details route [used in components/profile/EditDetails.js]
app.get('/user',FBAuth,getAuthenticatedUser);//Get user details [used in App.js]
app.get('/user/:handle',getUserDetails)//get any user details (public) [used in containers/User.js]
app.post('/notifications',FBAuth,markNotificationsRead)//make the notification read [used in components/layout/Notifications.js]

exports.api=functions.https.onRequest(app)

exports.createNotificationOnLike=functions.firestore.document('likes/{id}')
    .onCreate((snapshot)=>{
        return db.doc(`/screams/${snapshot.data().screamId}`).get()
            .then(doc=>{
                if(doc.exists && doc.data().userHandler!==snapshot.data().userHandler)
                    return db.doc(`/notifications/${snapshot.id}`).set({
                        createdAt:new Date().toISOString(),
                        recipient:doc.data().userHandler,
                        sender:snapshot.data().userHandler,
                        type:'like',
                        read:false,
                        screamId:doc.id
                    });
            })
            .catch(err=>{
                console.error(err);
            })
})

exports.deleteNotificationOnUnlike=functions.firestore.document('likes/{id}')
    .onDelete((snapshot)=>{
        return db.doc(`/screams/${snapshot.data().screamId}`)
            .delete()
            .catch(err=>{
                console.error(err);
                return;
            })
})
exports.createNotificationOnComment=functions.firestore.document('comments/{id}')
    .onCreate((snapshot)=>{
        return db.doc(`/screams/${snapshot.data().screamId}`).get()
            .then(doc=>{
                if(doc.exists && doc.data().userHandler!==snapshot.data().userHandler)
                    return db.doc(`/notifications/${snapshot.id}`).set({
                        createdAt:new Date().toISOString(),
                        recipient:doc.data().userHandler,
                        sender:snapshot.data().userHandler,
                        type:'comment',
                        read:false,
                        screamId:doc.id
                    });
            })
            .catch(err=>{
                console.error(err);
                return;
            })
})


exports.onUserImageChange= functions.firestore.document('/users/{userId}')
    .onUpdate((change)=>{
        console.log(change.before.data());
        console.log(change.after.data());
        let batch=db.batch();
        if(change.before.data().imageUrl!==change.after.data().imageUrl){
            console.log("image has changed");
            return db.collection('screams').where('userHandler','==',change.before.data().handle).get()
                .then(data=>{
                    data.forEach(doc=>{
                        const scream=db.doc(`/screams/${doc.id}`);
                        batch.update(scream,{userImage:change.after.data().imageUrl})
                    })
                    return batch.commit();
                })
        }
        else
            return true
        
    })

exports.onUserImageChangeComm= functions.firestore.document('/users/{userId}')
    .onUpdate((change)=>{
        console.log(change.before.data());
        console.log(change.after.data());
        let batch=db.batch();
        if(change.before.data().imageUrl!==change.after.data().imageUrl){
            console.log("image has changed");
            return db.collection('comments').where('userHandler','==',change.before.data().handle).get()
                .then(data=>{
                    data.forEach(doc=>{
                        const comment=db.doc(`/comments/${doc.id}`);
                        batch.update(comment,{userImage:change.after.data().imageUrl})
                    })
                    return batch.commit();
                })
        }
        else
            return true
        
})
exports.onScreamDeleted= functions.firestore.document('/screams/{screamId}')
    .onDelete((snapshot,context)=>{
        const screamId=context.params.screamId ;
        const batch=db.batch()
        return db.collection('comments').where('screamId','==',screamId).get()
            .then(data=>{
                data.forEach(doc=>{
                    batch.delete(db.doc(`/comments/${doc.id}`))
                })
                return db.collection('likes').where('screamId','==',screamId).get()
            })
            .then(data=>{
                data.forEach(doc=>{
                    batch.delete(db.doc(`/likes/${doc.id}`))
                })
                return db.collection('notifications').where('screamId','==',screamId).get()
            })
            .then(data=>{
                data.forEach(doc=>{
                    batch.delete(db.doc(`/notifications/${doc.id}`))
                })
                return batch.commit()
            })
            .catch(err=>{
                console.error(err)
            })
    })