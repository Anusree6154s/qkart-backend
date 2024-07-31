import {
  AddOutlined,
  RemoveOutlined,
  ShoppingCart,
  ShoppingCartOutlined,
} from "@mui/icons-material";
import { Button, IconButton, Stack } from "@mui/material";
import { Box } from "@mui/system";
import React, { useState } from "react";
import { useHistory, Link } from "react-router-dom";
import "./Cart.css";
import VpnKeyIcon from "@mui/icons-material/VpnKey";
import { useSnackbar } from "notistack";

import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";

import CloseIcon from "@mui/icons-material/Close";
// import Divider from '@mui/material/Divider';

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
  if (!cartData) return [];
  let cartItems = cartData.map((item) => {
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
  return cartItems;
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
  let value = items.reduce((acc, curr) => curr.qty * curr.cost + acc, 0);
  return value;
};

// TODO: CRIO_TASK_MODULE_CHECKOUT - Implement function to return total cart quantity
/**
 * Return the sum of quantities of all products added to the cart
 *
 * @param { Array.<CartItem> } items
 *    Array of objects with complete data on products in cart
 *
 * @returns { Number }
 *    Total quantity of products added to the cart
 *
 */
export const getTotalItems = (items = []) => {};

// TODO: CRIO_TASK_MODULE_CHECKOUT - Add static quantity view for Checkout page cart
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
 * @param {Boolean} isReadOnly
 *    If product quantity on cart is to be displayed as read only without the + - options to change quantity
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
 * @param {Boolean} isReadOnly
 *    If product quantity on cart is to be displayed as read only without the + - options to change quantity
 *
 */
const Cart = ({
  isReadOnly,
  products,
  items = [],
  handleQuantity,
  local = false,
  mobile = false,
}) => {
  let cartItems = generateCartItemsFrom(items, products);
  const { enqueueSnackbar } = useSnackbar();
  const history = useHistory();

  const [expanded, setExpanded] = useState(false);

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

  if (mobile && local) {
    return (
      <Accordion
        sx={{
          position: "fixed",
          bottom: 0,
          display: "flex",
          flexDirection: "column-reverse",
          "@media (min-width: 900px)": {
            display: "none",
          },
          width: "100%",
          zIndex:'2'
        }}
        expanded={expanded}
        onChange={() => setExpanded(!expanded)}
      >
        <AccordionSummary aria-controls="panel1-content" id="panel1-header">
          <Stack
            direction={expanded ? "column" : "row"}
            justifyContent="space-between"
            style={{ width: "100%" }}
          >
            <Stack>
              {!expanded ? (
                <>
                  <div style={{ fontSize: "0.8rem" }}>
                    {items.length} items in cart ⓘ
                  </div>

                  <div style={{ fontSize: "1rem", fontWeight: "bold" }}>
                    ${getTotalCartValue(cartItems)}
                  </div>
                </>
              ) : (
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  padding="0.5rem"
                >
                  <div style={{ fontSize: "0.8rem" }}>
                    Total amount to checkout
                  </div>
                  <div style={{ fontSize: "1rem", fontWeight: "bold" }}>
                    ${getTotalCartValue(cartItems)}
                  </div>
                </Stack>
              )}
            </Stack>

            {!isReadOnly && (
              <Button
                color="primary"
                variant="contained"
                startIcon={local ? <VpnKeyIcon /> : <ShoppingCart />}
                className="checkout-btn"
                size="small"
                onClick={(event) => {
                  event.stopPropagation();
                  if (local) {
                    history.push("/login");
                  } else {
                    history.push("/checkout");
                  }
                }}
                // alignSelf="flex-end"
              >
                {/* TODO; collect user email and send a confirmation email upon checkout */}
                {local ? "Login to Checkout" : "Checkout"}
              </Button>
            )}
          </Stack>
        </AccordionSummary>
        <AccordionDetails>
          <Stack>
            <Box display="flex" justifyContent="space-between">
              <Box display="flex" gap="10px" alignItems="center">
                <div style={{ fontSize: "1rem", fontWeight: "bold" }}>
                  {items.length}
                </div>
                <div style={{ fontSize: "0.8rem" }}>
                  {" "}
                  {items.length > 1 ? "items" : "item"} in cart
                </div>
              </Box>
              <IconButton
                aria-label="close"
                onClick={() => setExpanded(!expanded)}
                size="small"
              >
                <CloseIcon />
              </IconButton>
            </Box>
            <Stack
              spacing={2}
              sx={{
                overflow: "auto",
                maxHeight: "200px",
              }}
            >
              {cartItems.map((item, index) => (
                <Box
                  display="flex"
                  padding="1rem"
                  key={index}
                  // borderBottom="1px lightGrey solid"
                >
                  <Box className="image-container">
                    <img
                      src={item.image}
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
                    width="100%"
                  >
                    <div style={{ fontSize: "0.7rem" }}>{item.name}</div>
                    <Box
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                      width="100%"
                    >
                      {!isReadOnly ? (
                        <ItemQuantity
                          value={item.qty}
                          handleAdd={() =>
                            handleQuantity(item.productId, "add")
                          }
                          handleDelete={() =>
                            handleQuantity(item.productId, "delete")
                          }
                        />
                      ) : (
                        <div style={{ fontSize: "0.7rem" }}>Qty:{item.qty}</div>
                      )}
                      <Box padding="0.5rem" fontWeight="700" fontSize="0.7rem">
                        ${item.cost * item.qty}
                      </Box>
                    </Box>
                  </Box>
                </Box>
              ))}
            </Stack>
          </Stack>
        </AccordionDetails>
      </Accordion>
    );
  }

  return (
    <>
      <Box className="cart">
        {cartItems.length &&
          cartItems.map((item, index) => (
            <Box
              display="flex"
              padding="1rem"
              key={index}
            >
              <Box className="image-container">
                <img
                  src={item.image}
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
                width='100%'
                paddingX="1rem"
              >
                <div style={{ fontSize: "0.7rem" }}>{item.name}</div>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  {!isReadOnly ? (
                    <ItemQuantity
                      value={item.qty}
                      handleAdd={() => handleQuantity(item.productId, "add")}
                      handleDelete={() =>
                        handleQuantity(item.productId, "delete")
                      }
                    />
                  ) : (
                    <div style={{ fontSize: "0.7rem" }}>Qty:{item.qty}</div>
                  )}
                  <Box padding="0.5rem" fontWeight="700" fontSize="0.7rem">
                    ${item.cost * item.qty}
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
        {!isReadOnly && (
          <Box display="flex" justifyContent="flex-end" className="cart-footer">
            <Button
              color="primary"
              variant="contained"
              startIcon={local ? <VpnKeyIcon /> : <ShoppingCart />}
              className="checkout-btn"
              size="small"
              onClick={() => {
                if (local) {
                  history.push("/login");
                } else {
                  history.push("/checkout");
                }
              }}
            >
              {/* TODO; collect user email and send a confirmation email upon checkout */}
              {local ? "Login to Checkout" : "Checkout"}
            </Button>
          </Box>
        )}
      </Box>
      {isReadOnly && (
        <Box className="cart" padding="1rem 0rem">
          <Box
            padding=" 1rem 1rem 0rem 1rem "
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Box alignSelf="center" fontSize="1.5rem" fontWeight="bold">
              Order Details
            </Box>
          </Box>
          <Stack padding="1rem" spacing={1.5}>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <Box color="#3C3C3C" alignSelf="center" fontSize="0.8rem">
                Products
              </Box>
              <Box
                color="#3C3C3C"
                fontWeight="700"
                fontSize="0.8rem"
                alignSelf="center"
                data-testid="cart-total"
              >
                {cartItems.length}
              </Box>
            </Box>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <Box color="#3C3C3C" alignSelf="center" fontSize="0.8rem">
                Subtotal
              </Box>
              <Box
                color="#3C3C3C"
                fontWeight="700"
                fontSize="0.8rem"
                alignSelf="center"
                data-testid="cart-total"
              >
                ${getTotalCartValue(cartItems)}
              </Box>
            </Box>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <Box color="#3C3C3C" alignSelf="center" fontSize="0.8rem">
                Shipping Charges
              </Box>
              <Box
                color="#3C3C3C"
                fontWeight="700"
                fontSize="0.8rem"
                alignSelf="center"
                data-testid="cart-total"
              >
                $0
              </Box>
            </Box>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <Box
                color="#3C3C3C"
                alignSelf="center"
                fontSize="1rem"
                fontWeight="bold"
              >
                Total
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
          </Stack>
        </Box>
      )}
    </>
  );
};

export default Cart;
