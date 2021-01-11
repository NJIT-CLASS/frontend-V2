import {combineReducers, createStore} from "redux";
import userReducer from "./userReducer";
import notificationReducer from './notificationReducer';

const rootReducer = combineReducers({
    user: userReducer,
    notification: notificationReducer
});

const store = createStore(
    rootReducer,
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

export default store;
