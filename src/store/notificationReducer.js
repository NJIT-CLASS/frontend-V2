import * as actionTypes from "./actions"

const initialState = {
    notification: undefined
};

const reducer = (state=initialState, action) => {
    switch(action.type){
        case actionTypes.ADD_NOTIFICATION:
            return{
                ...state,
                notification: action.notification
            };
        case actionTypes.CLEAR_NOTIFICATION:
            return{
                ...state,
                notification: undefined
            };
        default:
            return state
    }
};

export default reducer