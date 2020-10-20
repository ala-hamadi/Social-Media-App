import {createStore,combineReducers,applyMiddleware,compose} from 'redux'
import thunk from 'redux-thunk'

import userReducer from './reducers/userReducer';
import dataReducer from './reducers/dataReducer';
import UIReducer from './reducers/UIReducer';

const initialState={};
const compseEnhancers=window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
const reducers=combineReducers({
    user:userReducer,
    data:dataReducer,
    UI:UIReducer
});

const store=createStore(reducers,
                        initialState,
                        compseEnhancers(applyMiddleware(thunk)                      
))

export default store