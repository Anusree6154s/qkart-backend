import React, { useState } from "react";
import {
  TextField,
  Button,
  Container,
  Typography,
  Box,
  Card,
  CardMedia,
  CardContent,
  Rating,
  Stack,
} from "@mui/material";

import axios from "axios";
import { config } from "../App";
import AdminHeader from "./AdminHeader";
import Footer from "./Footer";
import { useSnackbar } from "notistack";

const AddProductForm = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [product, setProduct] = useState({
    name: "",
    cost: "",
    image: "",
    rating: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct((prevProduct) => ({
      ...prevProduct,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${config.endpoint}/products`, product);
      enqueueSnackbar("Product has been added", { variant: "success" });
    } catch (e) {
      console.log(e);
    }
    setProduct({ name: "", category: "", cost: "", image: "", rating: "" });
  };

  return (
    <Box
      backgroundColor="#e9f5e1"
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      height="100vh"
    >
      <AdminHeader hiddenButtons="true" />
      <Container
        sx={{
          display: "flex",
          gap: "5%",
          width: "70vw",
        }}
        className="form"
      >
        <Box flex="1.5">
          <Typography variant="h6" style={{ color: "#3C3C3C" }}>
            Add New Product
          </Typography>
          <form
            onSubmit={handleSubmit}
            // style={{ display: "flex", flexDirection: "column" }}
          >
            <Stack spacing={1}>
              <TextField
                size="small"
                fullWidth
                margin="normal"
                label="Product Name"
                variant="outlined"
                name="name"
                value={product.name}
                onChange={handleChange}
                sx={{
                  marginTop: 0,
                  marginBottom: 0,
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "#ddd",
                    },
                    "&:hover fieldset": {
                      borderColor: "#00A278",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#00A278",
                    },
                  },
                  "& .MuiInputLabel-root.Mui-focused": {
                    color: "#00A278",
                  },
                }}
                InputLabelProps={{
                  style: { fontSize: "0.7rem" },
                }}
                InputProps={{
                  style: { fontSize: "0.7rem" },
                }}
              />
              <TextField
                size="small"
                fullWidth
                margin="normal"
                label="Category"
                variant="outlined"
                name="category"
                value={product.category}
                onChange={handleChange}
                sx={{
                  marginTop: 0,
                  marginBottom: 0,
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "#ddd",
                    },
                    "&:hover fieldset": {
                      borderColor: "#00A278",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#00A278",
                    },
                  },
                  "& .MuiInputLabel-root.Mui-focused": {
                    color: "#00A278",
                  },
                }}
                InputLabelProps={{
                  style: { fontSize: "0.7rem" },
                }}
                InputProps={{
                  style: { fontSize: "0.7rem" },
                }}
              />
              <TextField
                size="small"
                fullWidth
                margin="normal"
                label="Cost"
                variant="outlined"
                name="cost"
                type="number"
                value={product.cost}
                onChange={handleChange}
                sx={{
                  marginTop: 0,
                  marginBottom: 0,
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "#ddd",
                    },
                    "&:hover fieldset": {
                      borderColor: "#00A278",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#00A278",
                    },
                  },
                  "& .MuiInputLabel-root.Mui-focused": {
                    color: "#00A278",
                  },
                }}
                InputLabelProps={{
                  style: { fontSize: "0.7rem" },
                }}
                InputProps={{
                  style: { fontSize: "0.7rem" },
                }}
              />
              <TextField
                size="small"
                fullWidth
                margin="normal"
                label="Image URL"
                variant="outlined"
                name="image"
                value={product.image}
                onChange={handleChange}
                sx={{
                  marginTop: 0,
                  marginBottom: 0,
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "#ddd",
                    },
                    "&:hover fieldset": {
                      borderColor: "#00A278",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#00A278",
                    },
                  },
                  "& .MuiInputLabel-root.Mui-focused": {
                    color: "#00A278",
                  },
                }}
                InputLabelProps={{
                  style: { fontSize: "0.7rem" },
                }}
                InputProps={{
                  style: { fontSize: "0.7rem" },
                }}
              />
              <TextField
                size="small"
                fullWidth
                margin="normal"
                label="Rating"
                variant="outlined"
                name="rating"
                type="number"
                inputProps={{ min: 0, max: 5, step: 0.1 }}
                value={product.rating}
                onChange={handleChange}
                sx={{
                  marginTop: 0,
                  marginBottom: 0,
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "#ddd",
                    },
                    "&:hover fieldset": {
                      borderColor: "#00A278",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#00A278",
                    },
                  },
                  "& .MuiInputLabel-root.Mui-focused": {
                    color: "#00A278",
                  },
                }}
                InputLabelProps={{
                  style: { fontSize: "0.7rem" },
                }}
                InputProps={{
                  style: { fontSize: "0.7rem" },
                }}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{
                  marginTop: 0,
                  marginBottom: 0,
                  backgroundColor: "#00A278",
                  "&:hover": {
                    backgroundColor: "#007956",
                  },
                  fontSize: "0.7rem",
                }}
              >
                Add Product
              </Button>
            </Stack>
          </form>
        </Box>

        <Box flex="1">
          <Typography variant="h6" style={{ color: "#3C3C3C" }}>
            Product Preview
          </Typography>
          <Card>
            <CardMedia
              component="img"
              height="120"
              image={product.image || "https://via.placeholder.com/180"}
              alt={product.name || "Product Image"}
            />
            <CardContent>
              <Typography gutterBottom variant="h7" component="div">
                {product.name || "Product Name"}
              </Typography>
              <Typography
                variant="body2"
                color="text.primary"
                style={{ fontWeight: "bold" }}
              >
                ${product.cost || "Product Cost"}
              </Typography>
              <Rating
                name="read-only"
                precision={0.5}
                value={parseFloat(product.rating) || 0}
                readOnly
              />
            </CardContent>
          </Card>
        </Box>
      </Container>
      <Footer />
    </Box>
  );
};

export default AddProductForm;
