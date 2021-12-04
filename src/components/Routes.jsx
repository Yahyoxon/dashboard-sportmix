import React, { useEffect, useState } from "react";
import { Route, Switch } from "react-router-dom";
import axios from "axios";
import Dashboard from "../pages/Dashboard";
import Customers from "../pages/Customers";
import Products from "../pages/Products";
import Videos from "../pages/Videos";
import Courses from "../pages/Course";
import Brands from "../pages/Brands";
import Categories from "../pages/Categories";
import Orders from "../pages/Orders";
import Admin100k from "../pages/Admins100k";
import CourseOrders from "../pages/CourseOrders";
import Ads from "../pages/Ads";
import Profile from "../pages/Profile";
import PageNotFound from "../pages/PageNotFound";

import AddProduct from "./add/AddProductAws";
import AddVideo from "./add/AddVideoAws";
import AddCategory from "./add/AddCategoryAws";
import AddBrand from "./add/AddBrandAws";
import AddCourseCategory from "./add/AddCourseCategoryAws";
import AddCourseVideo from "./add/AddCourseVideoAws";
import EditProduct from "./edit/EditProduct";
import EditCategory from "./edit/EditCategoryAws";
import EditBrand from "./edit/EditBrandAws";
import EditCourseCategory from "./edit/EditCourseCategoryAws";
import EditOrder from "./edit/EditOrder";
import AddAds from "./add/AddAds";
import { Mediafiles } from "../pages/Mediafiles";
import AdminAccount from "../pages/AdminAccount";

const Routes = () => {
  const [videos, setVideos] = useState([]);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  //videos
  async function getVideos() {
    const response = await axios.post(
      'https://api.sport-mix.uz/api/videos/read',
      { u_id: 16 }
    );
    if (response.data.message) {
      setVideos([]);
      console.log(response.data.message);
    } else {
      setVideos(response.data.reverse());
    }
  }
  useEffect(() => {
    getVideos();
    setVideos([]);
  }, []);
  //products
  async function getProducts() {
    const response = await axios.get(
      'https://api.sport-mix.uz/api/products/read'
    );
    if (response.data.message) {
      setProducts([]);
      console.log(response.data.message);
    } else {
      setProducts(response.data);
    }
  }
  useEffect(() => {
    getProducts();
    setProducts([]);
  }, []);
  //categories
  async function getCategories() {
    const response = await axios.get(
      'https://api.sport-mix.uz/api/categories/read'
    );
    console.log("object")
    if (response.data.message) {
      setCategories([]);
      console.log(response.data.message);
    } else {
      setCategories(response.data);
    }
  }
  useEffect(() => {
    getCategories();
    setCategories([]);
  }, []);

  useEffect(() => {
    getBrands();
    setBrands([]);
  }, []);
  //brands
  async function getBrands() {
    try {
      const response = await axios.get(
        'https://api.sport-mix.uz/api/brands/read'
      );
      setBrands(response.data);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <>
      <Switch>
        <Route exact path="/">
          <Dashboard brands={brands} categories={categories} />
        </Route>
        <Route path="/profile">
          <Profile />
        </Route>
        <Route path="/customers" component={Customers} />
        {/* create components */}
        <Route path="/products/add-product">
          <AddProduct categories={categories} brands={brands} />
        </Route>
        <Route path="/video/add-video">
          <AddVideo />
        </Route>
        <Route path="/ads/add-ads">
          <AddAds />
        </Route>
        <Route path="/categories/add-category">
          <AddCategory />
        </Route>
        <Route path="/brands/add-brand">
          <AddBrand />
        </Route>
        <Route path="/tutorials/add-course-category">
          <AddCourseCategory />
        </Route>
        <Route path="/tutorials/add-course-video">
          <AddCourseVideo />
        </Route>
        {/* edit components */}
        <Route path="/products/edit-product/:id">
          <EditProduct categories={categories} brands={brands} />
        </Route>
        <Route path="/categories/edit-category/:id">
          <EditCategory />
        </Route>
        <Route path="/brands/edit-brand/:id">
          <EditBrand />
        </Route>
        <Route path="/order/edit-order/:id">
          <EditOrder />
        </Route>
        <Route path="/tutorials/edit-course-category/:id">
          <EditCourseCategory />
        </Route>
        {/*read components  */}
        <Route path="/products">
          <Products
            products={products}
            getProducts={getProducts}
            categories={categories}
            brands={brands}
          />
        </Route>
        <Route path="/categories">
          <Categories getCategories={getCategories} categories={categories} />
        </Route>
        <Route path="/brands">
          <Brands getBrands={getBrands} brands={brands} />
        </Route>
        <Route path="/video">
          <Videos getVideos={getVideos} videos={videos} />
        </Route>
        <Route path="/tutorials">
          <Courses />
        </Route>
        <Route path="/orders">
          <Orders brands={brands} />
        </Route>
        <Route path="/courseOrders">
          <CourseOrders />
        </Route>
        <Route path="/ads">
          <Ads brands={brands} />
        </Route>
        <Route path="/mediafiles">
          <Mediafiles products={products} />
        </Route>
        <Route path="/market-admins/:id">
          <AdminAccount />
        </Route>
        <Route path="/market-admins">
          <Admin100k />
        </Route>

        <Route component={PageNotFound} />
      </Switch>
    </>
  );
};

export default Routes;
