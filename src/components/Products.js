import { Search, SentimentDissatisfied } from "@mui/icons-material";
import {
  CircularProgress,
  Grid,
  InputAdornment,
  TextField,
  Stack,
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
 *   // TODO: CRIO_TASK_MODULE_PRODUCTS - Fetch products data and store it
 * @property {string} productId - Unique ID for the product
 */

const Products = () => {
  const [products, setProducts] = useState(null);
  const [noSearchItem, setNoSearchItem] = useState(false);
  const [timeoutId, setTimeoutId] = useState(null);

  const [user, setUser] = useState("");
  const [token, setToken] = useState("");

  useEffect(() => {
    let username = localStorage.getItem("username");
    setUser(username);
    let Token = localStorage.getItem("token");
    setToken(Token);
  }, []);

  const { enqueueSnackbar } = useSnackbar();

  const [cartItems, setCartItems] = useState([]);

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
      console.log(error);
    }
  };

  useEffect(() => {
    performAPICall();
  }, []);

  // TODO: CRIO_TASK_MODULE_PRODUCTS - Implement search logic
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

  // TODO: CRIO_TASK_MODULE_PRODUCTS - Optimise API calls with debounce search implementation
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
      // TODO: CRIO_TASK_MODULE_CART - Pass Bearer token inside "Authorization" header to get data from "GET /cart" API and return the response data
      let res = await axios.get(`${config.endpoint}/cart`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCartItems(res.data);
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
    fetchCart(token);
  }, [token]);

  // TODO: CRIO_TASK_MODULE_CART - Return if a product already exists in the cart
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
  const addToCart = async (
    token,
    items,
    products,
    productId,
    qty,
    options = { preventDuplicate: false }
  ) => {
    if (options.preventDuplicate) {
      if (isItemInCart(items, productId)) {
        enqueueSnackbar(
          "Item already in cart. Use the cart sidebar to update quantity or remove item.",
          { variant: "warning" }
        );
        return;
      }

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
    } else {
      console.log("qty", qty);
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
    }
  };

  const handleAddToCart = (_id) => {
    //add new product to cart
    if (token) {
      addToCart(token, cartItems, products, _id, 1, { preventDuplicate: true });
    } else {
      enqueueSnackbar("Login to add an item to the Cart", {
        variant: "warning",
      });
    }
  };

  function handleQuantity(_id, operation) {
    //update the qty in cart
    let cartItem = cartItems.find((item) => item.productId === _id);
    if (operation === "add")
      addToCart(token, cartItems, products, _id, cartItem.qty + 1, {
        preventDuplicate: false,
      });
    else
      addToCart(token, cartItems, products, _id, cartItem.qty - 1, {
        preventDuplicate: false,
      });
  }

  return (
    <Box>
      <Header>
        {/* TODO: CRIO_TASK_MODULE_PRODUCTS - Display search bar in the header for Products page */}
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
        <Grid item xs={12} md={user ? 9 : 12}>
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
        {user && (
          <Grid item xs={12} md={3}>
            <Grid container sx={{ backgroundColor: "#E9F5E1", height: "100%" }}>
              <Grid item xs={12}>
                {/* TODO: CRIO_TASK_MODULE_CART - Display the Cart component */}
                <Cart
                  products={products}
                  items={cartItems}
                  handleQuantity={handleQuantity}
                ></Cart>
              </Grid>
            </Grid>
          </Grid>
        )}
      </Grid>

      <Footer />
    </Box>
  );
};

export default Products;
