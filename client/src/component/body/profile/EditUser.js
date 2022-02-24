import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import axios from 'axios'
import { ShowErrorMsg, ShowSuccessMsg } from '../../utils/notification/Notification'

function EditUser() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [editUser, setEditUser] = useState([])

    const users = useSelector(state => state.users)
    const token = useSelector(state => state.token)

    const [checkAdmin, setCheckAdmin] = useState(false)
    const [error, setError] = useState(false)
    const [success, setSuccess] = useState(false)
    const [number, setNumber] = useState(0)

    useEffect(() => {
        if (users.length > 0) {
            users.forEach(user => {
                if (user._id === id) {
                    setEditUser(user)
                    setCheckAdmin(user.role === 1 ? true : false)
                }
            })
        } else {
            navigate('/profile')
        }
    }, [users, id, navigate])

    const handleUpdate = async () => {
        try {
            if (number % 2 !== 0) {
                const res = await axios.patch(`/user/update_role/${editUser._id}`, {
                    role: checkAdmin ? 1 : 0
                }, { headers: { Authorization: token } })
                setSuccess(res.data.msg)
                setNumber(0)
            }
        } catch (err) {
            err.response.data.msg && setError(err.response.data.msg)
        }
    }
    const handleChange = () => {
        setSuccess('')
        setError('')
        setCheckAdmin(!checkAdmin)
        setNumber(number + 1)
    }
    return (
        <div className="profile_page edit_user">
            <div className="row">
                <button onClick={() => navigate(-1)} className="go-back">
                    <i className="fas fa-long-arrow-alt-left"></i> Go Back
                </button>
            </div>

            <div className="col-left">
                <h2>Edit User</h2>

                <div className="form-group">
                    <label htmlFor="name">Name</label>
                    <input type="text" name="name" id="name"
                        defaultValue={editUser.name} disabled />
                </div>

                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input type="email" name="email" id="email"
                        defaultValue={editUser.email} disabled />
                </div>

                <form >
                    <input type="checkbox" id='isAdmin' checked={checkAdmin}
                        onChange={handleChange} />
                    <label htmlFor="isAdmin">isAdmin</label>
                </form>

                <button type='submit' onClick={handleUpdate}>Update</button>

                {error && ShowErrorMsg(error)}
                {success && ShowSuccessMsg(success)}
            </div>
        </div>
    )
}

export default EditUser
