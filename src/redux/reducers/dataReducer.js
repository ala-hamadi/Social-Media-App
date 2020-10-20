import * as actionTypes from '../types'

const initialState={
    screams:[],
    scream:{},
    loading:false
}

export default function(state=initialState,action){
    switch(action.type){
        case actionTypes.LOADING_DATA:
            return{
                ...state,
                loading:true
            }
        case actionTypes.SET_SCREAMS:
            return{
                ...state,
                loading:false,
                screams:action.payload
            }
        case actionTypes.LIKE_SCREAM:
            case actionTypes.UNLIKE_SCREAM:
                let index=state.screams.findIndex((scream)=>scream.screamId===action.payload.screamId);
                state.screams[index]=action.payload;
                if(state.scream.screamId===action.payload.screamId){
                    state.scream = { ...state.scream, ...action.payload };
                }
                return{
                    ...state,
                }
        case actionTypes.DELETE_SCREAM:
            let index2=state.screams.findIndex(scream=>scream.screamId===action.payload);
            let mutatedScreams = state.screams.slice();
            mutatedScreams.splice(index2, 1);
            return{
                ...state,
                screams: [...mutatedScreams]
            }
        case actionTypes.POST_SCREAM:
            return{
                ...state,
                screams:[
                    action.payload,
                    ...state.screams
                ]
            }
        case actionTypes.SET_SCREAM:
            return{
                ...state,
                scream:action.payload
            }
        case actionTypes.SEND_COMMENT:
            let commentedOnIndex = state.screams.findIndex(
                scream => scream.screamId === action.payload.screamId
            );
            return{

                    ...state,
                    scream: {
                      ...state.scream,
                      comments: [action.payload, ...state.scream.comments],
                      commentCount: state.scream.commentCount + 1
                    },
                    screams: state.screams.map((scream, screamsArrIndex) =>
                      screamsArrIndex === commentedOnIndex
                        ? { ...scream, commentCount: scream.commentCount + 1 }
                        : scream
                    )
                }
            
        default:
            return state;
    }
}