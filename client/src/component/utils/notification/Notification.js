import React from 'react';
import './Notification.css'

export const ShowErrorMsg = (msg) => {
    return <div className="errMsg">{msg}</div>
}

export const ShowSuccessMsg = (msg) => {
    return <div className="successMsg">{msg}</div>
}