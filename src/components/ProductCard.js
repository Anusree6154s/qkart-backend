// import { AddShoppingCartOutlined } from "@mui/icons-material";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Rating,
  Typography,
  Stack,
  // useMediaQuery,
  // useTheme,
} from "@mui/material";
import React from "react";
import "./ProductCard.css";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";

const ProductCard = ({ product, handleAddToCart }) => {
  const { name, cost, image, rating } = product;
  // const theme = useTheme();
  // const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  return (
    <Card className="card">
      <CardMedia sx={{ height: 180 }} image={image} title={name} component="img"/>
      <CardContent>
        <Stack spacing={0.5}>
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
          <Rating name="read-only" value={rating} readOnly />
        </Stack>
      </CardContent>
      <CardActions>
        <Button fullWidth variant="contained" size="small">
          <AddShoppingCartIcon sx={{ height: 15 }}></AddShoppingCartIcon>
          Add to Cart
        </Button>
      </CardActions>
    </Card>
  );
};

export default ProductCard;
