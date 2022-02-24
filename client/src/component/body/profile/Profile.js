import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { fetchAllUser, dispatchGetAllUserAcion } from '../../../redux/actions/usersAction'
import { ShowErrorMsg, ShowSuccessMsg } from '../../utils/notification/Notification'
import { isLength, isMatch } from '../../utils/validation/Validation'

const initialState = {
    name: '',
    password: '',
    cf_password: '',
    error: '',
    success: ''
}
export default function Profile() {
    const [data, setData] = useState(initialState)
    const auth = useSelector(state => state.auth)
    const token = useSelector(state => state.token)
    const users = useSelector(state => state.users)

    const dispatch = useDispatch()

    const { name, password, cf_password, error, success } = data

    const { user, isAdmin } = auth

    const [avatar, setAvatar] = useState(false)
    const [loading, setLoading] = useState(false)
    const [callback, setCallback] = useState(false)

    useEffect(() => {
        if (token) {
            const getAllUser = () => {
                return fetchAllUser(token).then(res => {
                    dispatch(dispatchGetAllUserAcion(res))
                })
            }
            getAllUser()
        }
    }, [token, dispatch, callback])


    const handleChangeInput = e => {
        const { name, value } = e.target;
        setData({ ...data, [name]: value })
    }

    const handleUpdateInfor = async () => {

        try {
            const res = await axios.patch('user/update', {
                name: name ? name : user.name,
                avatar: avatar ? avatar : user.avatar
            }, {
                headers: { Authorization: token }
            })
            setData({ ...data, error: '', success: res.data.msg })
        } catch (err) {
            err.response.data.msg && setData({ ...data, err: err.response.data.msg, success: '' })
        }
    }

    const handleChangeAvatar = async (e) => {
        e.preventDefault();
        try {
            const file = e.target.files[0]
            if (!file)
                return setData({ ...data, err: "No file were uploaded.", success: '' })

            if (file.size > 1024 * 1024)
                return setData({ ...data, err: "Size too large.", success: '' })

            if (file.type !== 'image/jpeg' && file.type !== 'image/png')
                return setData({ ...data, err: "File format is incorrect..", success: '' })

            let formData = new FormData();
            formData.append('file', file)

            setLoading(true)

            const res = await axios.post('/api/upload_avatar', formData,
                { headers: { 'content-Type': 'multipart/form-data', Authorization: token } })

            setLoading(false)
            setAvatar(res.data.url)

        } catch (err) {
            err.response.data.msg && setData({ ...data, err: err.response.data.msg, success: '' })

        }
    }

    const handleUpdatePassword = async () => {

        if (isLength(password))
            return setData({ ...data, error: 'Password must be least 6 characters.', success: "" })
        if (!isMatch(password, cf_password))
            return setData({ ...data, error: 'Password did not match.', success: '' })
        try {
            const res = await axios.post('user/reset_password', { password },
                {
                    headers: { Authorization: token }
                })
            setData({ ...data, password: '', cf_password: '', error: '', success: res.data.msg })
        } catch (err) {
            err.response.data.msg && setData({ ...data, err: err.response.data.msg, success: '' })
        }
    }

    const handleUpdate = () => {
        if (name || avatar) handleUpdateInfor()
        if (password) handleUpdatePassword()
    }

    const handleDeleteUser = async (id) => {
        try {
            if (user._id !== id) {
                if (window.confirm('Are you sure you want to delete this account?')) {
                    setLoading(true)
                    await axios.delete(`/user/delete/${id}`, {
                        headers: { Authorization: token }
                    })
                    setLoading(false)
                    setCallback(!callback)
                }
            }
            else{
                 setData({ ...data, error: "Can't delete your account.", success: '' })
            }
        } catch (err) {
            err.response.data.msg && setData({ ...data, error: err.response.data.msg, success: '' })
        }
    }

    return (
        <>
            <div>
                {error && ShowErrorMsg(error)}
                {success && ShowSuccessMsg(success)}
                {loading && <h3>Loading...</h3>}
            </div>
            <div className="profile_page">
                <div className="col-left">
                    <h2>{isAdmin ? "Admin Profile" : "User Profile"}</h2>

                    <div className="avatar">
                        <img src={avatar ? avatar : user.avatar} alt="" />
                        <span>
                            <i className="fas fa-camera"></i>
                            <p>Change</p>
                            <input type="file" name='file' id="file_up" onChange={handleChangeAvatar} />
                        </span>
                    </div>

                    <div className="form-group">
                        <label htmlFor="name">Name</label>
                        <input type="text" name="name" id="name" placeholder="Your name"
                            defaultValue={user.name} onChange={handleChangeInput} />
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input type="email" name="email" id="email" placeholder="Your email"
                            defaultValue={user.email} disabled />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input type="password" name="password" id="password" placeholder="Your password"
                            value={password} onChange={handleChangeInput} />
                    </div>

                    <div className="form-group">
                        <label htmlFor="cf_password">Confirm password</label>
                        <input type="password" name="cf_password" id="cf_password" placeholder="Confirm password"
                            value={cf_password} onChange={handleChangeInput} />
                    </div>
                    <div>
                        <i style={{ color: 'crimson', fontSize: '14px' }}>* if you update your password here, you will not ne able login quickly using google and facebook.</i>
                    </div>

                    <button type='submit' onClick={handleUpdate} disabled={loading}>Update</button>
                </div>
                <div className="col-right">
                    <h2>{isAdmin ? "Users" : 'My Orders'}</h2>

                    <div style={{ overflowX: 'auto' }}>
                        <table className="customers">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Admin</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((user) => (
                                    <tr key={user._id}>
                                        <td>{user._id}</td>
                                        <td>{user.name}</td>
                                        <td>{user.email}</td>
                                        <td>{user.role ?
                                            <i className="fas fa-check"></i> :
                                            <i className="fas fa-times"></i>}
                                        </td>
                                        <td>
                                            <Link to={`/edit_user/${user._id}`}><i className="fas fa-edit"></i></Link>
                                            <i className="fas fa-trash" onClick={() => handleDeleteUser(user._id)}></i>
                                        </td>
                                    </tr>
                                ))}

                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    )
}
