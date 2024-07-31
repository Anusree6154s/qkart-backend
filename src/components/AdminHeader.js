import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Button, Stack } from "@mui/material";
import Box from "@mui/material/Box";
import React from "react";
import "./Header.css";
import { Link } from "react-router-dom";

const AdminHeader = ({
  children,
  hiddenButtons = false,
  dashboard = false,
}) => {
  return (
    <Box
      className="header"
      style={
        dashboard
          ? {
              position: "fixed",
              width: "98%",
              zIndex: 2000,
            }
          : {}
      }
    >
      <Box className="header-title">
        <img src="logo_light.svg" alt="QKart-icon"></img>
      </Box>
      {children}

      {hiddenButtons ? (
        <Link to="/admin">
          <Button
            className="explore-button"
            startIcon={<ArrowBackIcon />}
            variant="text"
          >
            Back to explore
          </Button>
        </Link>
      ) : (
        <Stack direction="row" spacing={2}>
          <Link to="/addProduct">
            <Button className="login-button" variant="text">
              Add Product
            </Button>
          </Link>
          <Link to="/dashboard">
            <Button className="register-button" variant="contained">
              Dashboard
            </Button>
          </Link>
        </Stack>
      )}
    </Box>
  );
};

export default AdminHeader;
