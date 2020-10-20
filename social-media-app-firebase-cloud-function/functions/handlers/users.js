const {db,admin}=require('../util/admin')
const config=require('../util/config')
const firebase=require('firebase')
firebase.initializeApp(config)

const {validateSignupData,validateLoginData,reduceUserDetails}=require('../util/validators')


// Signup
exports.signup=(req,res)=>{
    const newUser={
        email:req.body.email,
        password:req.body.password,
        confirmePassword:req.body.confirmePassword,
        handle:req.body.handle,
    };

    const {valid,errors}=validateSignupData(newUser)
    
    if(!valid)
        return res.status(400).json(errors)

    const noImg='no-img.png'
    // validate data
    let token,userId;
    db.doc(`/users/${newUser.handle}`)
        .get()
        .then(doc=>{
            if (doc.exists){
                return res.status(400).json({handle:'this handle is already taken'})
            }
            else{
                return firebase.
                auth().
                createUserWithEmailAndPassword(newUser.email,newUser.password)
            }
        })
        .then(data=>{
            userId=data.user.uid;
            return data.user.getIdToken();        
        })
        .then(tokenId=>{
            token=tokenId;
            const userCredenttials={
                handle:newUser.handle,
                email:newUser.email,
                createdAt:new Date().toISOString(),
                userId:userId,
                imageUrl:`https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${noImg}?alt=media`
            }
            return db.doc(`/users/${newUser.handle}`).set(userCredenttials);
        })
        .then(()=>{
            return res.status(201).json({token});
        })
        .catch(err=>{
            console.error(err);
            if (err.code==='auth/email-already-in-use'){
                return res.status(400).json({email:'Email is already in use'})
            }
            else{
                return res.status(500).json({general:'Something went wrong, please try again'});
            }
        })
}

// Login
exports.login=(req,res)=>{
    const user={
        email:req.body.email,
        password:req.body.password
    }


    const {valid,errors}=validateLoginData(user)
    
    if(!valid)
        return res.status(400).json(errors)
    
    
    firebase.auth().signInWithEmailAndPassword(user.email,user.password)
        .then(data=>{
            return data.user.getIdToken();
        })
        .then(token=>{
            return res.json({token});
        })
        .catch(err=>{
            console.error(err);
                return res.status(403).json({general:"wrong credentials, please try again"})

        })
}


// Upload a profile image for user
exports.uploadImage=(req,res)=>{
    //I used : npm install --save busboy
    const BusBoy=require('busboy');
    const path=require('path');
    const os=require('os');
    const fs=require('fs');

    const busboy=new BusBoy({headers:req.headers});

    let imageFileName;
    let imageToBeUploaded={}

    busboy.on('file',(fieldname,file,filename,encoding,mimetype)=>{
        if (mimetype!=='image/jpeg' && mimetype!=='image/png')
            return res.status(400).json({error:"Wrong file type submitted"});
        const imageExtension=filename.split('.')[filename.split('.').length-1];
        imageFileName=`${Math.round(Math.random() * 1000000000000)}.${imageExtension}`;
        const filepath = path.join(os.tmpdir(), imageFileName);
        imageToBeUploaded={filepath,mimetype};
        file.pipe(fs.createWriteStream(filepath))
    });
    busboy.on('finish', ()=>{
        admin.storage().bucket(`${config.storageBucket}`).upload(imageToBeUploaded.filepath,{
            resumable:false,
            metadata:{
                contentType:imageToBeUploaded.mimetype
            }
        })
        .then(()=>{
            const imageUrl=`https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${imageFileName}?alt=media`
            return db.doc(`/users/${req.user.handle}`).update({imageUrl});
        })
        .then(()=>{
            return res.json({message:'Image uploaded successfully'});
        })
        .catch(err=>{
            console.error(err);
            return res.status(500).json({error: err.code})
        })
    })
    busboy.end(req.rawBody);
}


// Add user details
exports.addUserDetails=(req,res)=>{
    let userDetails=reduceUserDetails(req.body)
    
    db.doc(`/users/${req.user.handle}`).update(userDetails)
        .then(()=>{
            return res.json({message:'Details added successuflly'})
        })
        .catch(err=>{
            console.error(err);
            return res.status(500).json({error:err.code})
        })
}


//get own user details
exports.getAuthenticatedUser=(req,res)=>{
    let userData = {};
  db.doc(`/users/${req.user.handle}`)
    .get()
    .then((doc) => {
      if (doc.exists) {
        userData.credentials = doc.data();
        return db
          .collection("likes")
          .where("userHandler", "==", req.user.handle)
          .get();
      }
    })
    .then((data) => {
      userData.likes = [];
      data.forEach((doc) => {
        userData.likes.push(doc.data());
      });
      return db
        .collection("notifications")
        .where("recipient", "==", req.user.handle)
        .get();
    })
    .then((data) => {
      userData.notifications = [];
      data.forEach((doc) => {
        userData.notifications.push({
          recipient: doc.data().recipient,
          sender: doc.data().sender,
          createdAt: doc.data().createdAt,
          screamId: doc.data().screamId,
          type: doc.data().type,
          read: doc.data().read,
          notificationId: doc.id,
        });
      });
      return res.json(userData);
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).json({ error: err.code });
    });
};

exports.getUserDetails = (req, res) => {
    let userData = {};
    db.doc(`/users/${req.params.handle}`)
      .get()
      .then((doc) => {
        if (doc.exists) {
          userData.user = doc.data();
          return db
            .collection("screams")
            .where("userHandler", "==", req.params.handle)
            .orderBy("createdAt", "desc")
            .get();
        } else 
          return res.status(404).json({ errror: "User not found" });
      })
      .then((data) => {
        userData.screams = [];
        data.forEach((doc) => {
          userData.screams.push({
            body: doc.data().body,
            createdAt: doc.data().createdAt,
            userHandler: doc.data().userHandler,
            userImage: doc.data().userImage,
            likeCount: doc.data().likeCount,
            commentCount: doc.data().commentCount,
            screamId: doc.id,
          });
        });
        return res.json(userData);
      })
      .catch((err) => {
        console.error(err);
        return res.status(500).json({ error: err.code });
      });
  };

exports.markNotificationsRead=(req,res)=>{
    let batch=db.batch();
    req.body.forEach(notificationId=>{
        const notification=db.doc(`/notifications/${notificationId}`);
        batch.update(notification,{read:true})
    });
    batch.commit()
        .then(()=>{
            return res.json({message:'Notifications marked read'})
        })
        .catch(err=>{
            console.error(err);
            return res.status(500).json({error:err.code})
        })
}

