import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Chart from 'react-apexcharts'
import { useSelector } from 'react-redux'
import StatusCard from '../components/status-card/StatusCard'
import Table from '../components/table/Table'
import Badge from '../components/badge/Badge'
import axios from "axios";

const Dashboard = (props) => {

    const numFormatter = (num) => {
        if (num > 999 && num < 1000000) {
            return (num / 1000).toFixed(1) + 'K';
        } else if (num > 1000000) {
            return (num / 1000000).toFixed(1) + 'M';
        } else if (num < 900) {
            return num;
        }
    }
    //change theme
    const themeReducer = useSelector(state => state.ThemeReducer.mode)
    //boxes infos
    const [brandsCount, setBrandsCount] = useState([])
    const [categoriesCount, setCategoriesCount] = useState([])
    const [videosCount, setVideosCount] = useState([])
    const [productsCount, setProductsCount] = useState([])
    const [pendingOrdersCount, PendingOrdersCount] = useState([])
    //read states
    const [orders, setOrders] = useState([])
    //get orders region
    const [ordersRegion, setOrdersRegion] = useState([])
    const [ordersCountFromRegion, setOrdersCountFromRegion] = useState([])
    // video views chart
    const [videoViews, setVideoViews] = useState([])
    const [videoDate, setVideoDate] = useState([])
    // orders chart
    const [orderViews, setOrderViews] = useState([])
    const [orderDate, setOrderDate] = useState([])

    //brands count
    async function getBrandsCount() {
        const response = await axios.post('https://api.sport-mix.uz/api/analytics/getBrandsCount')
        setBrandsCount(response.data)
    }
    useEffect(() => {
        getBrandsCount()
    }, [])
    //categories count
    async function getCategoriesCount() {
        const response = await axios.post('https://api.sport-mix.uz/api/analytics/getCategoriesCount')
        setCategoriesCount(response.data)
    }
    useEffect(() => {
        getCategoriesCount()
    }, [])
    //videos count
    async function getVideosCount() {
        const response = await axios.post('https://api.sport-mix.uz/api/analytics/getVideosCount')
        setVideosCount(response.data)
    }
    useEffect(() => {
        getVideosCount()
    }, [])
    //products count
    async function getProductsCount() {
        const response = await axios.post('https://api.sport-mix.uz/api/analytics/getProductsCount')
        setProductsCount(response.data)
    }
    useEffect(() => {
        getProductsCount()
    }, [])
    //pending orders count
    async function getPendingOrders() {
        const response = await axios.post('https://api.sport-mix.uz/api/analytics/getPendingOrder')
        PendingOrdersCount(response.data)
    }
    useEffect(() => {
        getPendingOrders()
    }, [])
    //orders
    async function getOrdersData() {
        const response = await axios.post('https://api.sport-mix.uz/api/order/read')
        if (response.data.message) {
            setOrders([])
            console.log(response.data.message);
        } else {
            setOrders(response.data.reverse())
        }
    }
    useEffect(() => {
        getOrdersData()
    }, [])
    //video views
    async function getViewsForChart() {
        const response = await axios.get('https://api.sport-mix.uz/api/analytics/getVideoViewsChart?per=day')

        if (response.data.message) {
            setVideoViews([])
            setVideoDate([])
        } else {
            var videoViews = [];
            var videoDate = [];
            for (let i = 0; i < response.data.length; i++) {
                videoViews.push(response.data[i].views);
                videoDate.push(response.data[i].date);
            }
            setVideoViews(videoViews)
            setVideoDate(videoDate)
        }
    }
    useEffect(() => {
        getViewsForChart()
    }, [])
    //orders region
    async function getOrdersRegionChart() {
        const response = await axios.get('https://api.sport-mix.uz/api/analytics/getOrderRegion')

        if (response.data.message) {
            setOrdersRegion([])
            setOrdersCountFromRegion([])
        } else {
            var region = [];
            var count = [];
            for (let i = 0; i < response.data.length; i++) {
                region.push(response.data[i].region);
                count.push(response.data[i].count);
            }
            setOrdersRegion(region)
            setOrdersCountFromRegion(count)
        }
    }
    useEffect(() => {
        getOrdersRegionChart()
    }, [])
    //orders count per day
    async function getOrdersForChart() {
        const response = await axios.get('https://api.sport-mix.uz/api/analytics/getOrdersDataChart?per=day')
        if (response.data.message) {
            setOrderViews([])
            setOrderDate([])
        } else {
            var ordersCount = [];
            var ordersDate = [];
            for (let o = 0; o < response.data.length; o++) {
                ordersCount.push(response.data[o].orders);
                ordersDate.push(response.data[o].date);
            }
            setOrderViews(ordersCount)
            setOrderDate(ordersDate)
        }
    }
    useEffect(() => {
        getOrdersForChart()
    }, [])


    //shop chart
    const shopStatusCards = [
        {
            "icon": "bx bx-shopping-bag",
            "count": brandsCount.count,
            "link": "brands",
            "title": brandsCount.title
        },
        {
            "icon": "bx bx-cart",
            "count": productsCount.count,
            "link": "products",
            "title": productsCount.title
        },
        {
            "icon": "bx bx-category",
            "count": categoriesCount.count,
            "link": "categories",
            "title": categoriesCount.title
        },
        {
            "icon": "bx bx-time",
            "count": pendingOrdersCount.count,
            "link": "orders",
            "title": pendingOrdersCount.title
        }
    ]



    //video chart
    const videoStatusCards = [
        {
            "icon": "bx bx-video",
            "count": videosCount.count,
            "link": "video",
            "title": videosCount.title
        },
        {
            "icon": "bx bx-cart",
            "count": productsCount.count,
            "link": "products",
            "title": productsCount.title
        }
    ]
    const videosChart = {
        series: [{
            name: 'Просмотры',
            data: videoViews,

        }],
        options: {
            chart: {
                background: 'transparent',
                stacked: false,
            },
            dataLabels: {
                enabled: false
            },
            stroke: {
                curve: 'smooth'
            },
            xaxis: {
                categories: videoDate,
                // max: 7, // weekly data
            },
            legend: {
                position: 'top'
            },
            grid: {
                show: false
            },
            title: {
                text: "Видео просмотры",
                align: 'center',
                margin: 10,
                offsetX: 0,
                offsetY: 0,
                floating: false,
                style: {
                    fontSize: '14px',
                    fontWeight: 'bold',
                },
            }
        }
    }
    //orders chart
    const ordersRegionData = {
        series: [{
            name: 'Заказы',
            data: orderViews
        }],
        options: {
            chart: {
                background: 'transparent'
            },
            dataLabels: {
                enabled: false
            },
            stroke: {
                curve: 'smooth'
            },
            xaxis: {
                categories: orderDate
            },
            legend: {
                position: 'top'
            },
            grid: {
                show: false
            },
            title: {
                text: "Заказы",
                align: 'center',
                margin: 10,
                offsetX: 0,
                offsetY: 0,
                floating: false,
                style: {
                    fontSize: '14px',
                    fontWeight: 'bold',
                },
            }
        }
    }
    const orderStatusCards = [
        {
            "icon": "bx bx-time",
            "count": pendingOrdersCount.count,
            "link": "orders",
            "title": pendingOrdersCount.title
        },
        {
            "icon": "bx bx-video",
            "count": videosCount.count,
            "link": "video",
            "title": videosCount.title
        },
        {
            "icon": "bx bx-cart",
            "count": productsCount.count,
            "link": "products",
            "title": productsCount.title
        },
        {
            "icon": "bx bx-cart",
            "count": productsCount.count,
            "link": "products",
            "title": productsCount.title
        }
    ]

    //regions chart
    const chartOptionsRegion = {
        series: ordersCountFromRegion,
        options: {
            chart: {
                background: 'transparent'
            },
            labels: ordersRegion,
            legend: {
                position: 'bottom'
            }
        },
    }
    //orders section

    const latestOrders = {
        header: [
            'order ID',
            'Пользователь',
            "Итог",
            "Магазин",
            "Дата",
            "Статус"
        ]
    }

    const orderStatus = {
        "новый": "new",
        "принято": "accepted",
        "ожидающий": "waiting",
        "отменен": "canceled",
        "куплен": "purchased"
    }


    const renderOrderHead = (item, index) => (
        <th key={index}>{item}</th>
    )

    const renderOrderBody = (item, index) => (
        <tr key={index}>
            <td>{item.order_id}</td>
            <td>{item.username}</td>
            <td>{Number(item.total_price).toLocaleString()} </td>
            <td>{item.send_to}</td>
            <td>{item.date}</td>
            <td>
                <Badge type={orderStatus[item.status]} content={item.status} />
            </td>
        </tr>
    )


    return (
        <div>
            <div className="row">
                <div className="col-12 ">
                    <div className="tableHeader">
                        <h2 className="page-header">Интернет-магазин</h2>
                    </div>
                </div>
                <div className="col-5">
                    <div className="row">
                        {shopStatusCards.map((item, index) => (
                            <div className="col-6" key={index}>
                                <Link to={`/${item.link}`} >
                                    <StatusCard
                                        icon={item.icon}
                                        count={numFormatter(item.count)}
                                        title={item.title}
                                    />
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="col-7">
                    <div className="card full-height">
                        <Chart
                            options={themeReducer === 'theme-mode-dark' ? {
                                ...ordersRegionData.options,
                                theme: { mode: 'dark' }
                            } : {
                                ...ordersRegionData.options,
                                theme: { mode: 'light' }
                            }}
                            series={ordersRegionData.series}
                            type='area'
                            height='100%'
                        />
                    </div>
                </div>
                {orders.length > 0 ? <>
                    <div className="col-4">
                        <div className="card">
                            <Chart
                                className="full-height"
                                options={themeReducer === 'theme-mode-dark' ? {
                                    ...chartOptionsRegion.options,
                                    theme: { mode: 'dark' }
                                } : {
                                    ...chartOptionsRegion.options,
                                    theme: { mode: 'light' }
                                }}
                                series={chartOptionsRegion.series}
                                type='pie'
                            />
                            {/* <div className="card__footer">
                                <Link to='/orders'>view all</Link>
                            </div> */}
                        </div>
                    </div>
                    <div className="col-8">
                        <div className="card">
                            <div className="card__header">
                                <h3>Последние заказы</h3>
                            </div>
                            <div className="card__body">
                                <Table
                                    headData={latestOrders.header}
                                    renderHead={(item, index) => renderOrderHead(item, index)}
                                    bodyData={orders.slice(0, 3)}
                                    renderBody={(item, index) => renderOrderBody(item, index)}
                                />
                            </div>
                            <div className="card__footer">
                                <Link to='/orders'>view all</Link>
                            </div>
                        </div>
                    </div></> : null}
            </div>

            <div className="row">
                <div className="col-12">
                    <div className="tableHeader">
                        <h2 className="page-header">Видео</h2>
                    </div>
                </div>
                <div className="col-9">
                    <div className="card full-height">
                        <Chart
                            options={themeReducer === 'theme-mode-dark' ? {
                                ...videosChart.options,
                                theme: { mode: 'dark' }
                            } : {
                                ...videosChart.options,
                                theme: { mode: 'light' },
                            }}
                            series={videosChart.series}
                            type='area'
                            height='100%'
                        />
                    </div>
                </div>
                <div className="col-3">
                    <div className="row">
                        {videoStatusCards.map((item, index) => (
                            <div className="col-12" key={index}>
                                <Link to={`/${item.link}`} >
                                    <StatusCard
                                        icon={item.icon}
                                        count={numFormatter(item.count)}
                                        title={item.title}
                                    />
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col-12">
                    <div className="tableHeader">
                        <h2 className="page-header">Заказы</h2>
                    </div>
                </div>
                <div className="col-6">
                    <div className="card full-height">
                        <Chart
                            options={themeReducer === 'theme-mode-dark' ? {
                                ...ordersRegionData.options,
                                theme: { mode: 'dark' }
                            } : {
                                ...ordersRegionData.options,
                                theme: { mode: 'light' }
                            }}
                            series={ordersRegionData.series}
                            type='area'
                            height='100%'
                        />
                    </div>
                </div>
                <div className="col-6">
                    <div className="row">
                        {
                            orderStatusCards.map((item, index) => (
                                <Link to={`/${item.link}`} className="col-6" key={index}>
                                    <StatusCard
                                        icon={item.icon}
                                        count={numFormatter(item.count)}
                                        title={item.title}
                                    />
                                </Link>
                            ))
                        }
                    </div>
                </div>
            </div>
        </div >
    )
}

export default Dashboard
