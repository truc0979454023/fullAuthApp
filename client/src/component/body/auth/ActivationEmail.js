import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import { ShowErrorMsg, ShowSuccessMsg } from '../../utils/notification/Notification'


export default function ActivationEmail() {

    //Nhan tu params ben Route
    const { activation_token } = useParams()
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')

    useEffect(() => {
        if (activation_token) {
            const activationEmail = async () => {
                try {
                    const res = await axios.post('/user/activation', { activation_token })
                    setSuccess(res.data.msg)
                } catch (err) {
                    err.response.data.msg && setError(err.response.data.msg)
                }
            }
            activationEmail()
        }

    }, [activation_token])

    return (
        <div className="active_page">
            {error && ShowErrorMsg(error)}
            {success && ShowSuccessMsg(success)}
        </div>
    )
}
