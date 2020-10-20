import * as actionTypes from '../types'
import axios from 'axios'

export const getScreams=()=>{
    return dispatch =>{
        dispatch({type:actionTypes.LOADING_DATA})
        axios.get('/screams')
            .then(res=>{
                dispatch({type:actionTypes.SET_SCREAMS,
                        payload:res.data
                })
            })
            .catch(err=>{
                dispatch({type:actionTypes.SET_SCREAMS,
                        payload:[]
                })
            })
    }
}

export const likeScream =(screamId)=>{
    return dispatch =>{
        axios.get(`/scream/${screamId}/like`)
            .then(res=>{
                dispatch({type:actionTypes.LIKE_SCREAM,
                        payload:res.data})
            })
            .catch(err=>console.log(err))
    }
}

export const unLikeScream =(screamId)=>{
    return dispatch =>{
        axios.get(`/scream/${screamId}/unlike`)
            .then(res=>{
                dispatch({type:actionTypes.UNLIKE_SCREAM,
                        payload:res.data})
            })
            .catch(err=>console.log(err))
    }
}

export const deleteScream =(screamId)=>{
    return dispatch=>{
        axios.delete(`/scream/${screamId}`)
            .then(()=>{
                dispatch({type:actionTypes.DELETE_SCREAM,payload:screamId})
            })
            .catch(err=>console.log(err))
    }
}


export const postScream=(newScream)=>{
    return dispatch=>{
        dispatch({type:actionTypes.LOADING_UI})
        axios.post('/scream',newScream)
            .then(res=>{
                dispatch({
                    type:actionTypes.POST_SCREAM,
                    payload:res.data
                });
                dispatch({type:actionTypes.CLEAR_ERRORS})
            })
            .catch(err=>{
                dispatch({
                    type:actionTypes.SET_ERRORS,
                    payload:err.response.data
                })
            })
    }
}

export const clearError=()=>{
    return dispatch=>{
        dispatch({type:actionTypes.CLEAR_ERRORS})
    }
}

export const getScream=(screamId)=>{
    return dispatch=>{
        dispatch({type:actionTypes.LOADING_UI})
        axios.get(`/scream/${screamId}`)
            .then(res=>{
                dispatch({
                    type:actionTypes.SET_SCREAM,
                    payload:res.data
                })
                dispatch({type:actionTypes.STOP_LOADING_UI})
            })
            .catch(err=>console.log(err))
    }
}

export const sendComment=(screamId,commentData)=>{
    return dispatch=>{
        axios.post(`/scream/${screamId}/comment`,commentData)
            .then(res=>{
                dispatch({
                    type:actionTypes.SEND_COMMENT,
                    payload:res.data
                })
                dispatch({
                    type:actionTypes.CLEAR_ERRORS
                })
            })
            .catch(err=>{
                dispatch({
                    type:actionTypes.SET_ERRORS,
                    payload:err.response.data
                })
            })
    }
}

export const getUserData=(userHandler)=>{
    return dispatch=>{
        dispatch({type:actionTypes.LOADING_DATA})
        axios.get(`/user/${userHandler}`)
            .then(res=>{
                dispatch({
                    type:actionTypes.SET_SCREAMS,
                    payload:res.data.screams
                })
            })
            .catch(err=>{
                dispatch({
                    type:actionTypes.SET_SCREAMS,
                    payload:null
                })
            })
    }
}