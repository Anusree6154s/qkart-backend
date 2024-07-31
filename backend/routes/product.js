var express = require("express");
var router = express.Router();
const { handleError, getProduct } = require("../utils");
var { products } = require("../db");

router.get("/", (req, res) => {
  console.log("Request received for retrieving products list");

  products.find({}, (err, docs) => {
    if (err) {
      return handleError(res, err);
    }
    return res.status(200).json(docs);
  });
});

// /search?value=
router.get("/search", (req, res) => {
  console.log("Request received for searching ", req.query.value);

  //Creating a RegEx to search
  const searchRegex = new RegExp(req.query.value.replace(/['"]+/g, ""), "i");

  products.find(
    { $or: [{ name: searchRegex }, { category: searchRegex }] },
    (err, docs) => {
      if (err) {
        return handleError(res, err);
      }

      if (docs.length) {
        return res.status(200).json(docs);
      } else {
        return res.status(404).json([]);
      }
    }
  );
});

router.get("/:id", async (req, res) => {
  console.log(
    `Request received for retrieving product with id: ${req.params.id}`
  );
  try {
    const product = await getProduct(req.params.id);
    if (product) {
      return res.status(200).json(product);
    } else {
      return res.status(404).json();
    }
  } catch (error) {
    handleError(res, error);
  }
});

router.put("/:id", (req, res) => {
  console.log(`Request received for updating product with ID ${req.params.id}`);

  products.update(
    { _id: req.params.id },
    { $set: req.body.product },
    {},
    (err) => {
      if (err) {
        handleError(res, err);
      }

      console.log(`Product with ID ${req.params.id} updated successfully`);

      // Fetch all products after the update
      products.find({}, (err, docs) => {
        if (err) {
          return handleError(res, err);
        }
        return res.status(200).json(docs);
      });
    }
  );
});

router.delete("/:id", (req, res) => {
  console.log(`Request received for deleting product with ID ${req.params.id}`);

  products.remove(
    { _id: req.params.id }, // Filter criteria: find the product by ID
    {}, // Options: empty object, no special options
    (err) => {
      if (err) {
        return handleError(res, err); // Handle the error
      }

      console.log(`Product with ID ${req.params.id} deleted successfully`);

      // Fetch all products after the deletion
      products.find({}, (err, docs) => {
        if (err) {
          return handleError(res, err);
        }
        return res.status(200).json(docs);
      });
    }
  );
});

router.post("/", (req, res) => {
  console.log(`Request received for adding product ${req.body.name}`);
  products.insert({
    name: req.body.name,
    category: req.body.category,
    image: req.body.image,
    cost: req.body.cost,
    rating: req.body.rating,
  });

  console.log(`Added Product ${req.body.name}`);

  return res.status(201).json({
    success: true,
  });
});

module.exports = router;
