import React, { useState, useEffect } from 'react'
import Table from '../components/table/Table'
import '../assets/css/products.scss'
import axios from 'axios'
import { Link } from 'react-router-dom'

const Products = (props) => {

    const [brand_name, setBrand_name] = useState("all")
    const [products, setProducts] = useState([])
    const [error, setError] = useState("")


    //products
    async function getProducts(b_name) {
        const response = await axios.post('https://api.sport-mix.uz/api/products/readWithBrands', { "brand_name": b_name })

        if (response.data.message) {
            setProducts([])
            setError(response.data.message);
        } else {
            setProducts(response.data)
            setError("");
        }
    }
    useEffect(() => {
        getProducts(brand_name)
    }, [brand_name])


    const shortString = (str, n) => {
        return str?.length > n ? str.substr(0, n - 1) + "..." : str;
    };

    const ins_arr = [{ link: "all", name: "Все" }, { link: "order", name: "Заказать" }, { link: "none", name: "Скрыть" }]

    const customerTableHead = [
        '',
        'название',
        'Цена',
        'Категория',
        'Магазин',
        'Изображение',
        "rec",
        'Видимость',
        'Действие'
    ]

    //delete
    const deleteProduct = async (id, name) => {
        const confirm = window.confirm(`Do you really want to delete ${name}?`);
        if (confirm === true) {
            await axios.delete(`https://api.sport-mix.uz/api/products/delete`, {
                headers: { "Content-Type": "application/json" },
                data: { "id": id }
            });
            await getProducts(brand_name);
        } else {
            console.log("Not deleted");
        }

    }
    //order product
    const orderProduct = async (product, username, phone, region, quantity, brand_name, image, total_price) => {
        const res = await axios.post(`https://api.sport-mix.uz/api/order/create`, {
            "product": product,
            "username": username,
            "phone": phone,
            "region": region,
            "quantity": quantity,
            "brand_name": brand_name,
            "image": image,
            "total_price": total_price
        });
        console.log(res.data);
    }

    const setInstallment = async (installment, id) => {
        const response = await axios.put(`https://api.sport-mix.uz/api/products/setInstallment`,
            {
                "installment": installment,
                "id": id
            }
        )
        if (response.data.message) {
            console.log(response.data);
        } else {
            console.log(response.data);
        }
        await getProducts(brand_name)
    }
    //set  recommendation
    const setRec = async (p_id) => {
        await axios.put(`https://api.sport-mix.uz/api/products/setRec`,
            { "id": p_id }
        )
        await getProducts(brand_name)
    }

    const renderHead = (item, index) => <th key={index}>{item}</th>
    const renderBody = (item, index) => (
        <tr key={index}>
            <td>{index + 1}</td>
            <td title={`${item.name}\n\n${item.description}`}>{shortString(item.name, 20)}</td>
            <td>{Number(item.price).toLocaleString()}</td>
            <td>
                {props.categories.map((c, i) => {
                    return c.link === item.category_name ? <span key={i}>{c.name}</span> : null
                })}
            </td>
            <td>
                {props.brands.map((b, br) => {
                    return b.link === item.brand_name ? <span key={br}>{b.name}</span> : null
                })}
            </td>
            <td style={{ display: "flex" }}>
                {item.images.slice(0, 3).map((img, k) => {
                    return <img className="imgProduct" key={k} src={img} alt="img" width="60px" />
                })}
            </td>
            <td>
                {
                    item.recommendation === "false" ? <div title="Добавить в рекомендации" onClick={() => { setRec(item.id) }}><span className={"bx bx-star"} style={{ fontSize: "25px" }}></span> </div> : <div title="Удалить из рекомендации" onClick={() => { setRec(item.id) }}><span className={"bx bxs-star"} style={{ fontSize: "25px" }}></span></div>
                }
            </td>
            <td>
                <select className={`orderSelect badge badge-${item.installment}`} onChange={(e) => setInstallment(e.target.value, item.id)} required>
                    {ins_arr.map((installment, ins) => {
                        return item.installment === installment.link ?
                            <option key={ins} selected value={installment.link}  >{installment.name}</option>
                            :
                            <option key={ins} value={installment.link}  >{installment.name}</option>
                    })}
                </select>
            </td>
            <td>
                <Link title="Изменить" to={`/products/edit-product/${item.id}`}>
                    <button className="badge-btn badge-primary bx bx-edit editBtnMargin"></button>
                </Link>
                <button title="Удалить" className="badge-btn badge-danger bx bx-trash" onClick={() => { deleteProduct(item.id, item.name) }}></button>
                {/* <button title="Заказать" className="badge-btn badge-warning bx bx-shopping-bag" onClick={() => { orderProduct(item.name, "test", "+000000000000", "buxoro", 5, item.brand_name, item.images[0], item.price) }}></button> */}
            </td>
        </tr>
    )

    return (
        <div>
            <div className="tableHeader">
                <h2 className="page-header">
                    Товары
                </h2>
                <div className="topnav__select">
                    <select onChange={(e) => setBrand_name(e.target.value)} required>
                        <option selected value="all">Все</option>
                        {props.brands.map((brand, o) => {
                            return <option key={o} value={brand.link}  >{brand.name}</option>
                        })}
                    </select>
                </div>
                <Link to="/products/add-product"><button className="badge badge-success">Добавить</button></Link>

            </div>
            <div className="row">
                <div className="col-12">
                    <div className="card">
                        <div className="card__body">
                            <Table
                                limit='20'
                                headData={customerTableHead}
                                renderHead={(item, index) => renderHead(item, index)}
                                bodyData={products}
                                renderBody={(item, index) => renderBody(item, index)}
                            />
                            {
                                error ? <span className="empty">{error}</span> : null
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div >
    )
}

export default Products
