import ACTIONS from "./index";


export const dispatchToken = (token) => {
    return {
        type: ACTIONS.GET_TOKEN,
        payload: token
    }
}