import { Box } from "@mui/system";
import React from "react";
import "./Footer.css";

const Footer = () => {
  return (
    <Box className="footer" style={{ zIndex: 2000 }}>
      <Box sx={{ textAlign: "center", flexShrink: 1 }}>
        <img src="logo_dark.svg" alt="QKart-icon"></img>
      </Box>
      <p className="footer-text">
        QKart is your one stop solution to the buy the latest trending items
        with India's Fastest Delivery to your doorstep
      </p>
    </Box>
  );
};

export default Footer;
