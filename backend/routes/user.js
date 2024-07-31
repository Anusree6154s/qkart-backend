var express = require("express");
var router = express.Router();
const { nanoid } = require("nanoid");
const { handleError, verifyAuth } = require("../utils");
var { users } = require("../db");
const { isTemplateExpression } = require("typescript");

router.get("/addresses", verifyAuth, (req, res) => {
  console.log(`GET request received to "/user/addresses"`);

  return res.status(200).json(req.user.addresses);
});

router.post("/addresses", verifyAuth, (req, res) => {
  console.log(`POST request received to "/cart/addresses"`);

  if (req.body.address.length < 20) {
    return res.status(400).json({
      success: false,
      message: "Address should be greater than 20 characters",
    });
  }
  if (req.body.address.length > 128) {
    return res.status(400).json({
      success: false,
      message: "Address should be less than 128 characters",
    });
  }

  const existingAddressIndex = req.user.addresses.findIndex(
    (item) => item._id === req.body.addressId
  );

  console.log(existingAddressIndex);
  if (existingAddressIndex !== -1) {
    // Address exists, update it
    req.user.addresses[existingAddressIndex].address = req.body.address;
  } else {
    // Address does not exist, add it
    req.user.addresses.push({
      _id: nanoid(),
      address: req.body.address,
    });
  }

  users.update(
    { _id: req.user._id },
    { $set: { addresses: req.user.addresses } },
    {},
    (err) => {
      if (err) {
        handleError(res, err);
      }

      console.log(
        `Address "${req.body.address}" added to user ${req.user.username}'s address list`
      );

      return res.status(200).json(req.user.addresses);
    }
  );
});

router.delete("/addresses/:id", verifyAuth, async (req, res) => {
  console.log(`DELETE request received to "/cart/addresses"`);

  const index = await req.user.addresses.findIndex(
    (element) => element._id === req.params.id
  );
  if (index === -1) {
    return res.status(404).json({
      success: false,
      message: "Address to delete was not found",
    });
  }
  req.user.addresses.splice(index, 1);
  users.update(
    { _id: req.user._id },
    { $set: { addresses: req.user.addresses } },
    {},
    (err) => {
      if (err) {
        handleError(res, err);
      }

      console.log(
        `Address with id ${req.user._id} deleteed from user ${req.user.username}'s address list`
      );

      return res.status(200).json(req.user.addresses);
    }
  );
});

router.get("/", (req, res) => {
  console.log("Request received for retrieving users list");

  users.find({}, (err, docs) => {
    if (err) {
      return handleError(res, err);
    }
    return res.status(200).json(docs);
  });
});


module.exports = router;
