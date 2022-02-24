import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { ShowErrorMsg, ShowSuccessMsg } from '../../utils/notification/Notification'
import { isEmail, isMatch, isEmpty, isLength } from '../../utils/validation/Validation'

const initialState = {
    name: '',
    email: '',
    password: '',
    cf_password: '',
    error: '',
    success: '',
}

export default function Register() {
    const [user, setUser] = useState(initialState)



    const { name, email, password, cf_password, error, success } = user

    const handleChangeInput = e => {
        e.preventDefault();
        const { name, value } = e.target;
        setUser({ ...user, [name]: value, error: '', success: '' })
    }

    const handleSubmit = async e => {
        e.preventDefault();
        if (isEmpty(name) || isEmpty(password))
            return setUser({ ...user, error: 'Please fill in all fields.', success: '' })

        if (!isEmail(email))
            return setUser({ ...user, error: 'Invalid email.', success: '' })

        if (isLength(password))
            return setUser({ ...user, error: 'Password must be ai least 6 characters.', success: '' })

        if (!isMatch(password, cf_password))
            return setUser({ ...user, error: 'Password did not match.', success: '' })

        try {
            const res = await axios.post('/user/register', {
                name, email, password
            })
            setUser({ ...user, error: '', success: res.data.msg })
        } catch (err) {
            err.response.data.msg &&
                setUser({ ...user, error: err.response.data.msg, success: '' })

        }
    }

    return (
        <div className="login_page">
            <h2>Register</h2>
            {error && ShowErrorMsg(error)}
            {success && ShowSuccessMsg(success)}

            <form onSubmit={handleSubmit}>

                <div>
                    <label htmlFor="name">Name</label>
                    <input type="text" placeholder="Enter your name"
                        id="name" value={name} name="name" onChange={handleChangeInput} />
                </div>

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

                <div>
                    <label htmlFor="cf_password">Confirm Password </label>
                    <input type="password" placeholder="Enter confirm password"
                        id="cf_password" value={cf_password} name="cf_password" onChange={handleChangeInput} />
                </div>

                <div className="row">
                    <button type="submit">Register</button>
                </div>
            </form>
            <p>Already an account?<Link to="/login">Login</Link></p>
        </div>
    )
}
