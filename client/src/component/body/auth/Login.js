import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { ShowErrorMsg, ShowSuccessMsg } from '../../utils/notification/Notification'
import { dispatchLogin } from '../../../redux/actions/authAction'
import { useDispatch } from 'react-redux'

import { GoogleLogin } from 'react-google-login';
import FacebookLogin from 'react-facebook-login';

const initialState = {
    email: '',
    password: '',
    error: '',
    success: '',
}

export default function Login() {
    const [user, setUser] = useState(initialState)
    const dispatch = useDispatch()

    const navigator = useNavigate()

    const { email, password, error, success } = user

    const handleChangeInput = e => {
        e.preventDefault();
        const { name, value } = e.target;
        setUser({ ...user, [name]: value, error: '', success: '' })
    }

    const handleSubmit = async e => {
        e.preventDefault();
        try {
            const res = await axios.post('/user/login', { email, password })
            setUser({ ...user, error: '', success: res.data.msg })
            localStorage.setItem('firstLogin', true)

            dispatch(dispatchLogin())
            navigator('/')

        } catch (err) {
            err.response.data.msg &&
                setUser({ ...user, error: err.response.data.msg, success: '' })

        }
    }

    const responseGoogle = async (response) => {

        try {
            const res = await axios.post('user/google_login', { tokenId: response.tokenId })

            setUser({ ...user, error: '', success: res.data.msg })
            localStorage.setItem('firstLogin', true)

            dispatch(dispatchLogin())
            navigator('/')
        } catch (err) {
            err.response.data.msg &&
                setUser({ ...user, error: err.response.data.msg, success: '' })
        }
    }

    const responseFacebook = async (response) => {

        try {
            const { accessToken, userID } = response
            const res = await axios.post('user/facebook_login', { accessToken, userID })

            setUser({ ...user, error: '', success: res.data.msg })
            localStorage.setItem('firstLogin', true)

            dispatch(dispatchLogin())
            navigator('/')
        } catch (err) {
            err.response.data.msg &&
                setUser({ ...user, error: err.response.data.msg, success: '' })
        }
    }

    return (
        <div className="login_page">
            <h2>Login</h2>
            {error && ShowErrorMsg(error)}
            {success && ShowSuccessMsg(success)}

            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="email">Email Address</label>
                    <input type="text" placeholder="Enter your email"
                        id="email" value={email} name="email" onChange={handleChangeInput} />
                </div>

                <div>
                    <label htmlFor="password">Password </label>
                    <input type="password" placeholder="Enter your password"
                        id="password" value={password} name="password" onChange={handleChangeInput} />
                </div>

                <div className="row">
                    <button type="submit">Login</button>
                    <Link to="/login/forgot_password">Forgot your password?</Link>
                </div>
            </form>
            <div className="hr">Or Login With</div>
            <div className="social">
                <GoogleLogin
                    clientId="48241468632-i962m4hsvhjssjvqd4255d1u922kv77c.apps.googleusercontent.com"
                    buttonText="Login with Google"
                    onSuccess={responseGoogle}
                    cookiePolicy={'single_host_origin'}
                />

                <FacebookLogin
                    appId="1010941486125978"
                    autoLoad={false}
                    fields="name,email,picture"
                    callback={responseFacebook}
                />
        
            </div>
            <p>New custumer?<Link to="/register">Register</Link></p>

        </div>
    )
}
