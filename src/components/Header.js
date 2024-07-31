import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {
  Avatar,
  Button,
  Stack,
} from "@mui/material";
import Box from "@mui/material/Box";
import React, { useState, useEffect } from "react";
import "./Header.css";
import { useHistory, Link } from "react-router-dom";

const Header = ({ children, hasHiddenAuthButtons = true }) => {
  const [user, setUser] = useState("");
  const [token, setToken] = useState("");

  useEffect(() => {
    let username = localStorage.getItem("username");
    setUser(username);
    let Token = localStorage.getItem("token");
    setToken(Token);
  }, []);

  return (
    <Box className="header">
      <Box className="header-title">
        <img src="logo_light.svg" alt="QKart-icon"></img>
      </Box>
      {hasHiddenAuthButtons && (
        <>
          {children}
          <Stack direction="row" spacing={2}>
            {!token && (
              <>
                <Link to="/login">
                  <Button className="login-button" variant="text">
                    Login
                  </Button>
                </Link>
                <Link to="/register">
                  <Button className="register-button" variant="contained">
                    Register
                  </Button>
                </Link>
              </>
            )}
            {token && (
              <>
                <Box display="flex" gap={1} alignItems="center">
                  <Avatar
                    src="/broken-image.jpg"
                    alt={user}
                    sx={{ width: 24, height: 24 }}
                  />
                  {user}
                </Box>
                <Link to="/">
                  <Button
                    className="logout-button"
                    variant="text"
                    onClick={() => {
                      localStorage.setItem("token", "");
                      localStorage.setItem("balance", "");
                      setToken("");
                    }}
                  >
                    Logout
                  </Button>
                </Link>
              </>
            )}
          </Stack>
        </>
      )}
      {!hasHiddenAuthButtons && (
        <Link to="/">
          <Button
            className="explore-button"
            startIcon={<ArrowBackIcon />}
            variant="text"
          >
            Back to explore
          </Button>
        </Link>
      )}
    </Box>
  );
};

export default Header;
