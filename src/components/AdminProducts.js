import { Search, SentimentDissatisfied } from "@mui/icons-material";
import {
  CircularProgress,
  Grid,
  InputAdornment,
  TextField,
} from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { config } from "../App";
import Footer from "./Footer";
import AdminHeader from "./AdminHeader";
import AdminProductCard from "./AdminProductCard";
// import Cart from "./Cart";
import "./Products.css";

// Definition of Data Structures used
/**
 * @typedef {Object} Product - Data on product available to buy
 *
 * @property {string} name - The name or title of the product
 * @property {string} qty - The quantity of product added to cart
 * @property {string} category - The category that the product belongs to
 * @property {number} cost - The price to buy the product
 * @property {number} rating - The aggregate rating of the product (integer out of five)
 * @property {string} image - Contains URL for the product image
 * @property {string} _id - Unique ID for the product
 */

const Products = () => {
  const [products, setProducts] = useState(null);
  const [noSearchItem, setNoSearchItem] = useState(false);
  const [timeoutId, setTimeoutId] = useState(null);

  const { enqueueSnackbar } = useSnackbar();

  //get products upon page load
  const performAPICall = async () => {
    try {
      let res = await axios.get(`${config.endpoint}/products`);
      setProducts(res.data);
    } catch (error) {
      if (error.response) {
        enqueueSnackbar(error.response.data.message, { variant: "error" });
      } else {
        enqueueSnackbar(
          "Could not fetch cart details. Check that the backend is running, reachable and returns valid JSON.",
          {
            variant: "error",
          }
        );
      }
    }
  };

  useEffect(() => {
    performAPICall();
  }, []);

  // search products on search bar
  const performSearch = async (text) => {
    try {
      let res = await axios.get(
        `${config.endpoint}/products/search?value=${text}`
      );
      setProducts(res.data);
    } catch (error) {
      if (error.response.status === 404) {
        setProducts(null);
        setNoSearchItem(true);
      }
    }
  };

  //debounce search on search bar
  const debounceSearch = (event, debounceTimeout) => {
    //clear prev timeout id
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    //set new timeout id and perform fucntion
    const newTimeoutId = setTimeout(() => {
      performSearch(event.target.value);
    }, debounceTimeout);
    setTimeoutId(newTimeoutId);
  };

  const handleAddProduct = async () => {
    try {
      let res = await axios.post(`${config.endpoint}/products`);
      setProducts(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleEditProduct = async (id, editedProduct) => {
    try {
      let res = await axios.put(`${config.endpoint}/products/${id}`, {
        product: editedProduct,
      });
      setProducts(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteProduct = async (id) => {
    try {
      let res = await axios.delete(`${config.endpoint}/products/${id}`);
      setProducts(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Box>
      <AdminHeader handleAddProduct={handleAddProduct}>
        <TextField
          className="search-desktop"
          size="small"
          fullWidth
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <Search color="primary" />
              </InputAdornment>
            ),
          }}
          placeholder="Search for items/categories"
          name="search"
          sx={{ backgroundColor: "white", width: "30%" }}
          onChange={(e) => debounceSearch(e, 500)}
        />
      </AdminHeader>

      {/* Search view for mobiles */}
      <TextField
        className="search-mobile"
        size="small"
        fullWidth
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <Search color="primary" />
            </InputAdornment>
          ),
        }}
        placeholder="Search for items/categories"
        name="search"
        sx={{ backgroundColor: "white" }}
        onChange={(e) => debounceSearch(e, 500)}
      />

      <Grid container sx={{ p: 2 }} spacing={2}>
        <Grid item xs={12} className="1">
          <Grid container spacing={2}>
            <Grid item className="product-grid" xs={12}>
              <Box className="hero">
                <p className="hero-heading">
                  India’s{" "}
                  <span className="hero-highlight">FASTEST DELIVERY</span> to
                  your door step
                </p>
              </Box>
            </Grid>
            {products ? (
              products.map((product) => (
                <Grid item xs={6} md={3} key={product._id}>
                  <AdminProductCard
                    product={product}
                    handleEditProduct={handleEditProduct}
                    handleDeleteProduct={handleDeleteProduct}
                  />
                </Grid>
              ))
            ) : noSearchItem ? (
              <Grid
                item
                xs={12}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <SentimentDissatisfied></SentimentDissatisfied>
                <p>No products found</p>
              </Grid>
            ) : (
              <Grid
                item
                xs={12}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <CircularProgress />
                <p>Loading Products...</p>
              </Grid>
            )}
          </Grid>
        </Grid>
      </Grid>

      <Footer />
    </Box>
  );
};

export default Products;
