import * as actionTypes from '../types';
import axios from 'axios';


export const loginUser=(userData,history)=>{
    return dispatch =>{
        dispatch({type:actionTypes.LOADING_UI})
        axios.post('/login',userData)
                .then(res=>{
                    const FBIdToken=`Bearer ${res.data.token}`;
                    localStorage.setItem('FBIdToken',FBIdToken);
                    axios.defaults.headers.common['Authorization']=FBIdToken;
                    dispatch(getUserData())
                    dispatch({type:actionTypes.CLEAR_ERRORS});
                    history.push('/');
                })
                .catch(err=>{
                    dispatch({
                        type:actionTypes.SET_ERRORS,
                        payload:err.response.data
                    })
                })
    }
}


export const signupUser=(newUserData,history)=>{
    return dispatch =>{
        dispatch({type:actionTypes.LOADING_UI})
        axios.post('/signup',newUserData)
                .then(res=>{
                    const FBIdToken=`Bearer ${res.data.token}`;
                    localStorage.setItem('FBIdToken',FBIdToken);
                    axios.defaults.headers.common['Authorization']=FBIdToken;
                    dispatch(getUserData())
                    dispatch({type:actionTypes.CLEAR_ERRORS});
                    history.push('/');
                })
                .catch(err=>{
                    dispatch({
                        type:actionTypes.SET_ERRORS,
                        payload:err.response.data
                    })
                })
    }
}

export const getUserData=()=>{
    return dispatch=>{
        dispatch({type:actionTypes.LOADING_USER})
         axios.get('/user')
            .then(res=>{
                dispatch({
                    type:actionTypes.SET_USER,
                    payload:res.data
                })
            })
            .catch(err=>{
                console.log(err);   
                dispatch(logoutUser())
                
            })
    }
}


export const logoutUser=()=>{
    return dispatch =>{
        localStorage.removeItem('FBIdToken');
        delete axios.defaults.headers.common['Authorization']
        dispatch({type:actionTypes.SET_UNAUTHENTICATED})
    }
}
 

export const uploadImage=formData=>{
    return dispatch=>{
        dispatch({type:actionTypes.LOADING_USER})
        axios.post('/user/image',formData)
            .then(()=>{
                dispatch(getUserData())
            })
            .catch(err=>console.log(err));
    }
}

export const editUserDetails=userDetails=>{
    return dispatch=>{
        dispatch({type:actionTypes.LOADING_USER})
        axios.post('/user',userDetails)
            .then(()=>{
                dispatch(getUserData())
            })
            .catch(err=>console.log(err))
    }
    
}

export const markNotificationsRead=notificationIds=>{
    return dispatch=>{
        axios.post('/notifications',notificationIds)
            .then(res=>{
                dispatch({
                    type:actionTypes.MARK_NOTIFICATIONS_READ
                })
            })
            .catch(err=>console.log(err))
    }
}