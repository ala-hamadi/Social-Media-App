import * as actionTypes from '../types'
const initalState={
    loading:false,
    errors:null
}

export default function (state=initalState,action){
    switch(action.type){
        case actionTypes.SET_ERRORS:
            return{
                ...state,
                loading:false,
                errors:action.payload
            };
        case actionTypes.CLEAR_ERRORS:
            return{
                ...state,
                loading:false,
                errors:null
            };
        case actionTypes.LOADING_UI:
            return{
                ...state,
                loading:true
            };
        case actionTypes.STOP_LOADING_UI:
            return {
                ...state,
                loading:false
            }
        default:
            return state;
    }
}