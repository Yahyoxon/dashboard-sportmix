import React, { useState, useEffect } from 'react'
import './layout.css'
import Sidebar from '../sidebar/Sidebar'
import TopNav from '../topnav/TopNav'
import Routes from '../Routes'
import { BrowserRouter, Route } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import axios from 'axios'
import ThemeAction from '../../redux/actions/ThemeAction'
import '../../assets/css/products.scss'


const Layout = () => {
    const themeReducer = useSelector(state => state.ThemeReducer)
    const dispatch = useDispatch()

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");



    const formSuccess = async (e) => {
        e.preventDefault()

        const response = await axios.post('https://api.sport-mix.uz/api/admin/check',
            {
                "username": email,
                "password": password
            }
        )
        if (response.data.message) {
            setError(<span style={{ margin: " 15px 0 0 0" }} className="badge badge-danger">{response.data.message}</span>);
        } else {
            localStorage.setItem("admin", JSON.stringify(response.data[0]));
            window.location = "/"
        }
    }


    useEffect(() => {
        const themeClass = localStorage.getItem('themeMode', 'theme-mode-light')
        const colorClass = localStorage.getItem('colorMode', 'theme-mode-light')
        dispatch(ThemeAction.setMode(themeClass))
        dispatch(ThemeAction.setColor(colorClass))
    }, [dispatch])

    return (
        <BrowserRouter>
            {/* <Route>
            </Route> */}
            <Route render={(props) => (
                <div className={`layout ${themeReducer.mode} ${themeReducer.color}`}>
                    {
                        localStorage.getItem("admin") ?
                            <>
                                <Sidebar {...props} />
                                <div className="layout__content">
                                    <TopNav />
                                    <div className="layout__content-main">
                                        <Routes />
                                    </div>
                                </div>
                            </> : <div className="card  login">
                                <div className="layout__content">
                                    <form onSubmit={formSuccess} className="loginForm" action="">
                                        <div className="formContainer">

                                            <span className="title" style={{ padding: " 10px 0" }}>Имя пользователя</span>

                                            <div className="topnav__search"  >
                                                <input type="text" placeholder="Имя пользователя" onChange={(e) => { setEmail(e.target.value); setError("") }} />
                                            </div>
                                            <span className="title" style={{ padding: " 10px 0" }}>Пароль</span>
                                            <div className="topnav__search"  >
                                                <input type="password" placeholder="Пароль" onChange={(e) => { setPassword(e.target.value); setError("") }} />
                                            </div>

                                            {error}
                                            <button type="submit" className="badge badge-primary btnLogin">Вход</button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                    }
                </div>
            )} />
        </BrowserRouter>
    )
}

export default Layout
