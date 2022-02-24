import ACTIONS from "./index";
import axios from "axios";



export const fetchAllUser = async (token) => {
    const res = await axios.get('user/all_infor', {
        headers: { Authorization: token }
    })
    return res
}


export const dispatchGetAllUserAcion = (res) => {
    return {
        type: ACTIONS.GET_ALL_USER,
        payload: res.data
    }
}