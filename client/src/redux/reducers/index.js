import { combineReducers } from 'redux'
import auth from './authReducer'
import token from './tokenReducer'
import users from './usersReduers'

export default combineReducers({
    auth,
    token,
    users
})