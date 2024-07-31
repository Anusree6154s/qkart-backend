import { Search, SentimentDissatisfied } from "@mui/icons-material";
import {
  CircularProgress,
  Grid,
  InputAdornment,
  TextField,
  Stack,
  Button,
} from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { config } from "../App";
import Footer from "./Footer";
import Header from "./Header";
import ProductCard from "./ProductCard";
import Cart from "./Cart";
import "./Products.css";

/* TODO: SEND localCartItems to cartItems in database after login and RESET localCart*/

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

/**
 * @typedef {Object} CartItem -  - Data on product added to cart
 *
 * @property {string} name - The name or title of the product in cart
 * @property {string} qty - The quantity of product added to cart
 * @property {string} category - The category that the product belongs to
 * @property {number} cost - The price to buy the product
 * @property {number} rating - The aggregate rating of the product (integer out of five)
 * @property {string} image - Contains URL for the product image
 *
 * @property {string} productId - Unique ID for the product
 */

const Products = () => {
  const [products, setProducts] = useState(null);
  const [noSearchItem, setNoSearchItem] = useState(false);
  const [timeoutId, setTimeoutId] = useState(null);

  const [token, setToken] = useState("");

  useEffect(() => {
    let Token = localStorage.getItem("token");
    setToken(Token);
  }, []);

  const { enqueueSnackbar } = useSnackbar();

  const [cartItems, setCartItems] = useState([]);
  const [localCartItems, setLocalCartItems] = useState([]);

  /**
   * Make API call to get the products list and store it to display the products
   *
   * @returns { Array.<Product> }
   *      Array of objects with complete data on all available products
   *
   * API endpoint - "GET /products"
   *
   * Example for successful response from backend:
   * HTTP 200
   * [
   *      {
   *          "name": "iPhone XR",
   *          "category": "Phones",
   *          "cost": 100,
   *          "rating": 4,
   *          "image": "https://i.imgur.com/lulqWzW.jpg",
   *          "_id": "v4sLtEcMpzabRyfx"
   *      },
   *      {
   *          "name": "Basketball",
   *          "category": "Sports",
   *          "cost": 100,
   *          "rating": 5,
   *          "image": "https://i.imgur.com/lulqWzW.jpg",
   *          "_id": "upLK9JbQ4rMhTwt4"
   *      }
   * ]
   *
   * Example for failed response from backend:
   * HTTP 500
   * {
   *      "success": false,
   *      "message": "Something went wrong. Check the backend console for more details"
   * }
   */
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

  /**
   * Definition for search handler
   * This is the function that is called on adding new search keys
   *
   * @param {string} text
   *    Text user types in the search bar. To filter the displayed products based on this text.
   *
   * @returns { Array.<Product> }
   *      Array of objects with complete data on filtered set of products
   *
   * API endpoint - "GET /products/search?value=<search-query>"
   *
   */
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

  /**
   * Definition for debounce handler
   * With debounce, this is the function to be called whenever the user types text in the searchbar field
   *
   * @param {{ target: { value: string } }} event
   *    JS event object emitted from the search input field
   *
   * @param {NodeJS.Timeout} debounceTimeout
   *    Timer id set for the previous debounce call
   *
   */
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

  /**
   * Perform the API call to fetch the user's cart and return the response
   *
   * @param {string} token - Authentication token returned on login
   *
   * @returns { Array.<{ productId: string, qty: number }> | null }
   *    The response JSON object
   *
   * Example for successful response from backend:
   * HTTP 200
   * [
   *      {
   *          "productId": "KCRwjF7lN97HnEaY",
   *          "qty": 3
   *      },
   *      {
   *          "productId": "BW0jAAeDJmlZCF8i",
   *          "qty": 1
   *      }
   * ]
   *
   * Example for failed response from backend:
   * HTTP 401
   * {
   *      "success": false,
   *      "message": "Protected route, Oauth2 Bearer token not found"
   * }
   */

  const fetchCart = async (token) => {
    if (!token) return;

    try {
      let res = await axios.get(`${config.endpoint}/cart`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCartItems(res.data);
      return res.data;
    } catch (e) {
      if (e.response && e.response.status === 400) {
        enqueueSnackbar(e.response.data.message, { variant: "error" });
      } else {
        enqueueSnackbar(
          "Could not fetch cart details. Check that the backend is running, reachable and returns valid JSON.",
          {
            variant: "error",
          }
        );
      }
      return null;
    }
  };

  useEffect(() => {
    const updateCart = async () => {
      let cartData = await fetchCart(token);
      if (localCartItems.length) {
        localCartItems.forEach((localItem) => {
          let cartItem = cartData.find(
            (item) => item.productId === localItem.productId
          );
          let cartItemQty = cartItem ? cartItem.qty : 0;
          let prevDuplicate = cartItem ? false : true;
          addToCart(
            token,
            cartData,
            localItem.productId,
            localItem.qty + cartItemQty,
            {
              preventDuplicate: prevDuplicate,
            }
          );
        });
        localStorage.setItem("cart", "[]");
        setLocalCartItems([]);
      }
    };

    if (token) {
      updateCart();
    }
  }, [token]);

  /**
   * Return if a product already is present in the cart
   *
   * @param { Array.<{ productId: String, quantity: Number }> } items
   *    Array of objects with productId and quantity of products in cart
   * @param { String } productId
   *    Id of a product to be checked
   *
   * @returns { Boolean }
   *    Whether a product of given "productId" exists in the "items" array
   *
   */
  const isItemInCart = (items, productId) => {
    if (items.find((item) => item.productId === productId)) return true;
    return false;
  };

  /**
   * Perform the API call to add or update items in the user's cart and update local cart data to display the latest cart
   *
   * @param {string} token
   *    Authentication token returned on login
   * @param { Array.<{ productId: String, quantity: Number }> } items
   *    Array of objects with productId and quantity of products in cart
   * @param { Array.<Product> } products
   *    Array of objects with complete data on all available products
   * @param {string} productId
   *    ID of the product that is to be added or updated in cart
   * @param {number} qty
   *    How many of the product should be in the cart
   * @param {boolean} options
   *    If this function was triggered from the product card's "Add to Cart" button
   *
   * Example for successful response from backend:
   * HTTP 200 - Updated list of cart items
   * [
   *      {
   *          "productId": "KCRwjF7lN97HnEaY",
   *          "qty": 3
   *      },
   *      {
   *          "productId": "BW0jAAeDJmlZCF8i",
   *          "qty": 1
   *      }
   * ]
   *
   * Example for failed response from backend:
   * HTTP 404 - On invalid productId
   * {
   *      "success": false,
   *      "message": "Product doesn't exist"
   * }
   */
  //if logged in
  const addToCart = async (
    token,
    items,
    productId,
    qty,
    options = { preventDuplicate: false }
  ) => {
    // if duplicate not allowed and item is in cart, send warning and dont add to cart
    if (options.preventDuplicate && isItemInCart(items, productId)) {
      enqueueSnackbar(
        "Item already in cart. Use the cart sidebar to update quantity or remove item.",
        { variant: "warning" }
      );
      return;
    }

    // if duplicate not allowed and item not  in cart, & if duplicate allowed and item in cart thne,
    // add/update to cart
    try {
      let res = await axios.post(
        `${config.endpoint}/cart`,
        { productId, qty },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setCartItems(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  //if not logged in
  const addToLocalCart = async (
    items,
    productId,
    qty,
    options = { preventDuplicate: false }
  ) => {
    //get local cart from storage
    let cart = localStorage.getItem("cart");
    cart = cart ? JSON.parse(cart) : [];

    if (options.preventDuplicate) {
      //adding a new product
      if (isItemInCart(items, productId)) {
        enqueueSnackbar(
          "Item already in cart. Use the cart panel to update quantity or remove item.",
          { variant: "warning" }
        );
        return;
      }

      cart.push({ productId: productId, qty: qty });
    } else {
      //updating qty of existing product

      let index = cart.findIndex((item) => item.productId === productId);
      if (qty === 0) {
        cart.splice(index, 1);
      } else {
        let newData = { productId: productId, qty: qty };
        cart.splice(index, 1, newData);
      }
    }

    //set items to local cart and local storage
    localStorage.setItem("cart", JSON.stringify(cart));
    setLocalCartItems(cart);
  };

  useEffect(() => {
    let cart = localStorage.getItem("cart");
    if (cart) setLocalCartItems(JSON.parse(cart));
  }, []);

  const handleAddToCart = (_id) => {
    //add new product to cart
    let token = localStorage.getItem("token");
    if (token) {
      //if logged in
      addToCart(token, cartItems, _id, 1, { preventDuplicate: true });
    } else {
      //if not logged in
      addToLocalCart(localCartItems, _id, 1, {
        preventDuplicate: true,
      });
    }
  };

  function handleQuantity(_id, operation) {
    // if logged in(token), update the qty in cart
    let token = localStorage.getItem("token");
    if (token) {
      let cartItem = cartItems.find((item) => item.productId === _id);
      if (operation === "add")
        addToCart(token, cartItems, _id, cartItem.qty + 1, {
          preventDuplicate: false,
        });
      else
        addToCart(token, cartItems, _id, cartItem.qty - 1, {
          preventDuplicate: false,
        });
    }
    // else, update the qty in local cart
    else {
      let localCartItem = localCartItems.find((item) => item.productId === _id);
      if (operation === "add")
        addToLocalCart(localCartItems, _id, localCartItem.qty + 1, {
          preventDuplicate: false,
        });
      else
        addToLocalCart(localCartItems, _id, localCartItem.qty - 1, {
          preventDuplicate: false,
        });
    }
  }

  return (
    <Box>
      <Header>
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
      </Header>

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
        <Grid
          item
          xs={12}
          md={
            localStorage.getItem("token") || (localCartItems.length && products)
              ? 9
              : 12
          }
          className="1"
        >
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
                  <ProductCard
                    product={product}
                    handleAddToCart={handleAddToCart}
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
        {/* TODO: if logged in display cart sidebar in desktop, if logged out do not show. But adding items when logged out should show the cart*/}
        {products && localStorage.getItem("token") ? (
          <Grid
            item
            md={3}
            sx={{
              "@media (max-width: 900px)": {
                display: "none",
              },
            }}
            className="2"
          >
            <Grid container sx={{ backgroundColor: "#E9F5E1", height: "100%" }}>
              <Grid item xs={12}>
                <Cart
                  products={products}
                  items={cartItems}
                  handleQuantity={handleQuantity}
                  local={false}
                  mobile={false}
                ></Cart>
              </Grid>
            </Grid>
          </Grid>
        ) : (
          products &&
          localCartItems.length > 0 && (
            <Grid
              className="3"
              item
              md={3}
              sx={{
                "@media (max-width: 900px)": {
                  display: "none",
                },
              }}
            >
              <Grid
                container
                sx={{ backgroundColor: "#E9F5E1", height: "100%" }}
              >
                <Grid item xs={12}>
                  <Cart
                    products={products}
                    items={localCartItems}
                    handleQuantity={handleQuantity}
                    local={true}
                    mobile={false}
                  ></Cart>
                </Grid>
              </Grid>
            </Grid>
          )
        )}

        {/* TODO: if logged in display cart panel in mobile, if logged out do not show. But adding items when logged out should show the cart*/}
        {products && localStorage.getItem("token") ? (
          <Grid
            item
            xs={12}
            sx={{
              "@media (min-width: 900px)": {
                display: "none",
              },
            }}
          >
            <Grid container sx={{ backgroundColor: "#E9F5E1", height: "100%" }}>
              <Grid item xs={12}>
                <Cart
                  products={products}
                  items={cartItems}
                  handleQuantity={handleQuantity}
                  local={false}
                  mobile={true}
                ></Cart>
              </Grid>
            </Grid>
          </Grid>
        ) : (
          products &&
          localCartItems.length > 0 && (
            <Cart
              products={products}
              items={localCartItems}
              handleQuantity={handleQuantity}
              local={true}
              mobile={true}
            ></Cart>
          )
        )}
      </Grid>

      <Footer />
    </Box>
  );
};

export default Products;
