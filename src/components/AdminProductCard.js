import React, { useState } from "react";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Rating,
  Typography,
  Stack,
  TextField,
} from "@mui/material";
import "./ProductCard.css";

const ProductCard = ({ product, handleEditProduct, handleDeleteProduct }) => {
  const { name, category, cost, image, rating, _id } = product;
  const [isEditing, setIsEditing] = useState(false);
  const [editedProduct, setEditedProduct] = useState({
    image,
    name,
    cost,
    rating,
    category
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedProduct((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = () => {
    handleEditProduct(_id, editedProduct);
    setIsEditing(false);
  };

  return (
    <Card className="card">
      {isEditing ? (
        <div style={{ padding: "10%" }}>
          <TextField
            label="Product Image"
            variant="outlined"
            size="small"
            name="image"
            value={editedProduct.image}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <br></br>
          <TextField
            label="Product Category"
            variant="outlined"
            size="small"
            name="category"
            value={editedProduct.category}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
        </div>
      ) : (
        <CardMedia
          sx={{ height: 180 }}
          image={image}
          title={name}
          component="img"
        />
      )}
      <CardContent>
        <Stack spacing={0.5}>
          {isEditing ? (
            <>
              <TextField
                label="Product Name"
                variant="outlined"
                size="small"
                name="name"
                value={editedProduct.name}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
              />
              <br></br>
              <TextField
                label="Cost"
                variant="outlined"
                size="small"
                name="cost"
                type="number"
                value={editedProduct.cost}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
              />
              <br></br>
              <TextField
                label="Rating"
                variant="outlined"
                size="small"
                name="rating"
                type="number"
                value={editedProduct.rating}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
                inputProps={{ min: 0, max: 5 }}
              />
            </>
          ) : (
            <>
              <Typography gutterBottom variant="body2" component="div">
                {name}
              </Typography>
              <Typography
                variant="body2"
                color="text.primary"
                style={{ fontWeight: "bold" }}
              >
                ${cost}
              </Typography>
              <Rating name="read-only" value={Number(rating)} readOnly />
            </>
          )}
        </Stack>
      </CardContent>
      <CardActions>
        {isEditing ? (
          <>
            <Button
              fullWidth
              variant="contained"
              size="small"
              color="success"
              onClick={handleSave}
            >
              Save
            </Button>
            <Button
              fullWidth
              variant="outlined"
              size="small"
              color="inherit"
              onClick={() => setIsEditing(false)}
            >
              Cancel
            </Button>
          </>
        ) : (
          <>
            <Button
              fullWidth
              variant="contained"
              size="small"
              onClick={() => setIsEditing(true)}
            >
              <EditOutlinedIcon sx={{ height: 15 }} />
              Edit
            </Button>
            <Button
              fullWidth
              variant="contained"
              size="small"
              color="error"
              onClick={() => handleDeleteProduct(_id)}
            >
              <DeleteOutlinedIcon sx={{ height: 15 }} />
              Delete
            </Button>
          </>
        )}
      </CardActions>
    </Card>
  );
};

export default ProductCard;
