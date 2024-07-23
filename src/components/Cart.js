import {
  AddOutlined,
  RemoveOutlined,
  ShoppingCart,
  ShoppingCartOutlined,
} from "@mui/icons-material";
import { Button, IconButton, Stack } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";
import {  Link } from "react-router-dom";
import "./Cart.css";

// Definition of Data Structures used
/**
 * @typedef {Object} Product - Data on product available to buy
 *
 * @property {string} name - The name or title of the product
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
 * @property {string} productId - Unique ID for the product
 */

/**
 * Returns the complete data on all products in cartData by searching in productsData
 *
 * @param { Array.<{ productId: String, qty: Number }> } cartData
 *    Array of objects with productId and quantity of products in cart
 *
 * @param { Array.<Product> } productsData
 *    Array of objects with complete data on all available products
 *
 * @returns { Array.<CartItem> }
 *    Array of objects with complete data on products in cart
 *
 */
export const generateCartItemsFrom = (cartData, productsData) => {
  return cartData.map((item) => {
    let product = productsData.find(
      (product) => product._id === item.productId
    );
    let { name, category, cost, rating, image, _id } = product;

    return {
      name,
      qty: item.qty,
      category,
      cost,
      rating,
      image,
      productId: _id,
    };
  });
};

/**
 * Get the total value of all products added to the cart
 *
 * @param { Array.<CartItem> } items
 *    Array of objects with complete data on products added to the cart
 *
 * @returns { Number }
 *    Value of all items in the cart
 *
 */
export const getTotalCartValue = (items = []) => {
  return items.reduce((acc, curr) => curr.qty * curr.cost + acc, 0);
};

/**
 * Component to display the current quantity for a product and + and - buttons to update product quantity on cart
 *
 * @param {Number} value
 *    Current quantity of product in cart
 *
 * @param {Function} handleAdd
 *    Handler function which adds 1 more of a product to cart
 *
 * @param {Function} handleDelete
 *    Handler function which reduces the quantity of a product in cart by 1
 *
 *
 */
const ItemQuantity = ({ value, handleAdd, handleDelete }) => {
  return (
    <Stack direction="row" alignItems="center">
      <IconButton size="small" color="primary" onClick={handleDelete}>
        <RemoveOutlined sx={{ fontSize: 15 }} />
      </IconButton>
      <Box padding="0.5rem" data-testid="item-qty" fontSize="0.7rem">
        {value}
      </Box>
      <IconButton size="small" color="primary" onClick={handleAdd}>
        <AddOutlined sx={{ fontSize: 15 }} />
      </IconButton>
    </Stack>
  );
};

/**
 * Component to display the Cart view
 *
 * @param { Array.<Product> } products
 *    Array of objects with complete data of all available products
 *
 * @param { Array.<Product> } items
 *    Array of objects with complete data on products in cart
 *
 * @param {Function} handleDelete
 *    Current quantity of product in cart
 *
 *
 */
const Cart = ({ products, items = [], handleQuantity }) => {
  let cartItems = generateCartItemsFrom(items, products);

  if (!items.length) {
    return (
      <Box className="cart empty">
        <ShoppingCartOutlined className="empty-cart-icon" />
        <Box color="#aaa" textAlign="center">
          Cart is empty. Add more items to the cart to checkout.
        </Box>
      </Box>
    );
  }

  return (
    <>
      <Box className="cart">
        {/* TODO: CRIO_TASK_MODULE_CART - Display view for each cart item with non-zero quantity */}

        {cartItems.map((item, index) => (
          <Box
            display="flex"
            alignItems="flex-start"
            padding="1rem"
            sx={{ alignItems: "stretch" }}
            key={index}
          >
            <Box className="image-container">
              <img
                // Add product image
                src={item.image}
                // Add product name as alt eext
                alt={item.name}
                width="100%"
                height="100%"
              />
            </Box>
            <Box
              display="flex"
              flexDirection="column"
              justifyContent="space-between"
              height="4rem"
              paddingX="1rem"
            >
              <div style={{ fontSize: "0.7rem" }}>{item.name}</div>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <ItemQuantity
                  // Add required props by checking implementation
                  value={item.qty}
                  handleAdd={() => handleQuantity(item.productId, "add")}
                  handleDelete={() => handleQuantity(item.productId, "delete")}
                />
                <Box padding="0.5rem" fontWeight="700" fontSize="0.7rem">
                  ${item.cost}
                </Box>
              </Box>
            </Box>
          </Box>
        ))}

        <Box
          padding="1rem"
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          <Box color="#3C3C3C" alignSelf="center" fontSize="0.8rem">
            Order total
          </Box>
          <Box
            color="#3C3C3C"
            fontWeight="700"
            fontSize="1rem"
            alignSelf="center"
            data-testid="cart-total"
          >
            ${getTotalCartValue(cartItems)}
          </Box>
        </Box>
        <Box display="flex" justifyContent="flex-end" className="cart-footer">
          <Link to="/checkout">
          <Button
            color="primary"
            variant="contained"
            startIcon={<ShoppingCart />}
            className="checkout-btn"
            size="small"
          >
            Checkout
          </Button>
          </Link>
        </Box>
      </Box>
    </>
  );
};

export default Cart;
