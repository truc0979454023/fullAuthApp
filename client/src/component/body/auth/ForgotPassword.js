import React, { useState } from 'react'
import axios from 'axios'
import { isEmail } from '../../utils/validation/Validation'
import { ShowErrorMsg, ShowSuccessMsg } from '../../utils/notification/Notification'

const initialState = {
    email: '',
    error: '',
    success: '',
}

export default function ForgotPassword() {

    const [data, setData] = useState(initialState)

    const { email, error, success } = data


    const handleChangeInput = e => {
        const { name, value } = e.target;
        setData({ ...data, [name]: value, error: '', success: '' })
    }

    const forgotPassword = async () => {
        if (!isEmail(email))
            return setData({ ...data, error: 'Invalid emails.', success: '' })
        try {
            const res = await axios.post('/user/forgot_password', { email })
            return setData({ ...data, error: '', success: res.data.msg })

        } catch (err) {
            err.response.data.msg && setData({ ...data, error: err.response.data.msg, success: '' })
        }
    }

    return (
        <div className="forgot_pass">
            <h2>Forgot Your Password</h2>
            <div className="row">
                {error && ShowErrorMsg(error)}
                {success && ShowSuccessMsg(success)}

                <label htmlFor="email">Enter your email address</label>
                <input type="email" name="email" id="email" value={email}
                    onChange={handleChangeInput} />
                <button onClick={forgotPassword}>Verify your email</button>

            </div>
        </div>
    )
}
