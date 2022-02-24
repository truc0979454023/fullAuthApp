import React, { useState } from 'react'
import axios from 'axios'
import { useParams } from 'react-router-dom'
import { ShowErrorMsg, ShowSuccessMsg } from '../../utils/notification/Notification'
import { isLength, isMatch } from '../../utils/validation/Validation'

const initialState = {
    password: '',
    cf_password: '',
    error: '',
    success: '',
}

export default function ResetPassword() {
    const [data, setData] = useState(initialState)
    const { password, cf_password, error, success } = data
    const { token } = useParams()

    const handleChangeInput = e => {
        const { name, value } = e.target;
        setData({ ...data, [name]: value, error: '', success: '' })
    }

    const resetPassword = async () => {
        if (isLength(password))
            return setData({ ...data, error: 'Password must be at least 6 characters.', success: '' })
        if (!isMatch(password, cf_password))
            return setData({ ...data, error: 'Password did not match.', success: '' })
        try {
            const res = await axios.post('/user/reset_password', { password }, {
                headers: { Authorization: token }
            })
            return setData({ ...data, password: '', cf_password: '', error: '', success: res.data.msg })
        } catch (err) {
            err.response.data.msg && setData({ ...data, error: err.response.data.msg, success: '' })
        }
    }
    return (
        <div className="forgot_pass">
            <h2>Reset Your Password</h2>
            <div className="row">
                {error && ShowErrorMsg(error)}
                {success && ShowSuccessMsg(success)}

                <label htmlFor="password">Enter your password</label>
                <input type="password" name="password" id="password" value={password}
                    onChange={handleChangeInput} />
                <label htmlFor="cf_password">Confirm password</label>
                <input type="password" name="cf_password" id="cf_password" value={cf_password}
                    onChange={handleChangeInput} />
                <button onClick={resetPassword}>Submit</button>

            </div>
        </div>
    )
}
