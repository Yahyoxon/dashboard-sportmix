import React, { useState } from 'react'
// import React, { useState, useEffect } from 'react'
// import { Link } from 'react-router-dom'
import axios from 'axios'
// import md5 from 'md5'
import userThumb from '../assets/images/photo_2021-07-31_23-53-26.jpg'
import { useHistory } from "react-router-dom";

const Profile = () => {
    const oldProfile = JSON.parse(localStorage.getItem("admin"));
    const history = useHistory();


    const [name, setName] = useState(oldProfile.username)
    // const [oldPassword, setOldPassword] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [isUpload, setIsUpload] = useState(false);
    const [error, setError] = useState("");


    const handleChangeImage = () => {
        setIsUpload(false)
        console.log("image changed");
    }

    const updateProfile = async (e) => {
        e.preventDefault()
        // if (oldProfile.password === md5(oldPassword)) {
        if (newPassword.length >= 6) {


            if (newPassword === confirmPassword) {

                const response = await axios.post('https://api.sport-mix.uz/api/admin/update',
                    {
                        "id": oldProfile.id,
                        "username": name,
                        "password": newPassword
                    }
                )
                if (response.data === true) {
                    const res = await axios.post('https://api.sport-mix.uz/api/admin/check',
                        {
                            "username": name,
                            "password": newPassword
                        }
                    )
                    localStorage.removeItem("admin");
                    localStorage.setItem("admin", JSON.stringify(res.data[0]));
                    history.goBack();
                } else {
                    setError(<span style={{ padding: "7px", textAlign: "center", width: "100%", margin: " 5px auto" }} className="badge badge-danger">не обновлено</span>);
                }
            } else {
                setError(<span style={{ padding: "7px", textAlign: "center", width: "100%", margin: " 5px auto" }} className="badge badge-danger">пароли не совпадают</span>);
            }
        }
        else {
            setError(<span style={{ padding: "7px", textAlign: "center", width: "100%", margin: " 5px auto" }} className="badge badge-danger">пароль должен содержать не менее 6 символов</span>);
        }

        // } else {
        //     alert("Пароль не изменён, так как прежний пароль введён неправильно.")
        // }
    }




    return (
        <div>
            {/* <div className="tableHeader">
                <h2 className="page-header">
                    Изменить профиль
                </h2>
            </div> */}

            <div className="row">
                <div className="col-12">
                    <div className="card widthCard" >

                        <form onSubmit={updateProfile}>

                            <div className="images-labels userImage">
                                {
                                    isUpload === false ? <div className="imgActions">
                                        <img
                                            className="writeImg borderRadius"
                                            src={userThumb}
                                            alt="addImage"
                                        />

                                        <div className="overlay borderRadius">
                                            <label title="Replace image" className="actionButtons edi bx bx-edit">
                                                <input accept="image/jpg,image/jpeg,image/gif,image/png" style={{ display: "none" }} type="file" id="img" onChange={handleChangeImage} />
                                            </label>
                                        </div>

                                    </div>
                                        :
                                        <div className="imgActions">
                                            <img
                                                className="writeImg borderRadius"
                                                src={userThumb}
                                                alt="addImage"
                                            />
                                        </div>
                                }
                            </div>


                            <div className="topnav__input" style={{ marginBottom: "15px" }}>
                                <input type="text" id="name" value={name} onChange={(e) => { setName(e.target.value); setError("") }} placeholder="имя пользователя" required />
                            </div>
                            {/* <div className="topnav__input" style={{ marginBottom: "15px" }}>
                                <input type="password" id="link" value={oldPassword} onChange={(e) => { setOldPassword(e.target.value) }} placeholder="старый пароль" required />
                            </div> */}
                            <div className="topnav__input" style={{ marginBottom: "15px" }}>
                                <input type="password" id="link" value={newPassword} onChange={(e) => { setNewPassword(e.target.value); setError("") }} placeholder="новый пароль" required />
                            </div>
                            <div className="topnav__input" style={{ marginBottom: "15px" }}>
                                <input type="password" id="link" value={confirmPassword} onChange={(e) => { setConfirmPassword(e.target.value); setError("") }} placeholder="введите пароль еще раз" required />
                            </div>
                            <div className="topnav__input">
                                {error}
                            </div>
                            <div className="topnav__input">
                                {
                                    isUpload === true ? <div style={{ width: "100%", padding: "7px", textAlign: "center" }} className="badge badge-primary ">
                                        <div className="bx bx-loader-circle animLoader"></div> Загрузка
                                        {/* <progress value={progress} max="100" />
                                    <label>{progress} %</label> */}
                                    </div> : <button style={{ width: "100%", padding: "12px" }} type="submit" className="badge badge-primary">Обновить</button>
                                }
                            </div>
                        </form>
                    </div>
                </div>
            </div>

        </div >
    )
}

export default Profile
