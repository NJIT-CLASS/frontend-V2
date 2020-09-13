import * as actionTypes from "./actions"

const initialState = {
    user: {}
};

const reducer = (state=initialState, action) => {
    switch(action.type){
        case actionTypes.ADD_USER:
            return{
                ...state,
                user: action.user
            };
        default:
            return state
    }
};

export default reducer