import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Login from './auth/Login'
import Register from './auth/Register'
import ActivationEmail from './auth/ActivationEmail'
import NotFound from '../utils/notFound/NotFound'
import ForgotPassword from './auth/ForgotPassword'
import ResetPassword from './auth/ResetPassword'
import Profile from './profile/Profile'
import EditUser from './profile/EditUser'

import { useSelector } from 'react-redux'

export default function Body() {
    const auth = useSelector(state => state.auth);
    const { isLogged } = auth

    return (
        <Routes>
            <Route path="/login" element={isLogged ? <NotFound /> : <Login />} exact />
            <Route path="/register" element={isLogged ? <NotFound /> : <Register />} exact />

            <Route path="/login/forgot_password" element={isLogged ? <NotFound /> : <ForgotPassword />} exact />
            <Route path="/user/reset_password/:token" element={isLogged ? <NotFound /> : <ResetPassword />} exact />

            <Route path="/user/activate/:activation_token" element={<ActivationEmail />} exact />

            <Route path="/profile" element={isLogged ? <Profile /> : <NotFound />} exact />
            <Route path="/edit_user/:id" element={isLogged ? <EditUser /> : <NotFound />} exact />
        </Routes>
    )
}
