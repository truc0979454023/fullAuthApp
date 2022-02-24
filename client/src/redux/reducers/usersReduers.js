import ACTIONS from "../actions";

const users = []

const getAllUserReducer = (state = users, action) => {
    switch (action.type) {
        case ACTIONS.GET_ALL_USER:
            return  action.payload
            
        default:
            return state;
    }
}

export default getAllUserReducer