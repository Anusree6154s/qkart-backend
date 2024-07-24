import { Button, CircularProgress, Stack, TextField } from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useState } from "react";
import { useHistory, Link } from "react-router-dom";
import { config } from "../App";
import Footer from "./Footer";
import Header from "./Header";
import "./Login.css";

const Login = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const history = useHistory();

  // TODO: CRIO_TASK_MODULE_LOGIN - Fetch the API response
  /**
   * Perform the Login API call
   * @param {{ username: string, password: string }} formData
   *  Object with values of username, password and confirm password user entered to register
   *
   * API endpoint - "POST /auth/login"
   *
   * Example for successful response from backend:
   * HTTP 201
   * {
   *      "success": true,
   *      "token": "testtoken",
   *      "username": "criodo",
   *      "balance": 5000
   * }
   *
   * Example for failed response from backend:
   * HTTP 400
   * {
   *      "success": false,
   *      "message": "Password is incorrect"
   * }
   *
   */
  const login = async () => {
    try {
      let res = await axios.post(`${config.endpoint}/auth/login`, formData);
      enqueueSnackbar("Logged in successfully", { variant: "success" });
      let { token, username, balance } = res.data;
      persistLogin(token, username, balance);
      setTimeout(() => {
        history.push("/", { from: "Login" });
      }, 1000);
    } catch (error) {
      if (error.response) {
        enqueueSnackbar(error.response.data.message, { variant: "error" });
      } else {
        enqueueSnackbar(
          "Something went wrong. Check that the backend is running, reachable and returns valid JSON.",
          { variant: "error" }
        );
      }
    }
  };

  // TODO: CRIO_TASK_MODULE_LOGIN - Validate the input
  /**
   * Validate the input values so that any bad or illegal values are not passed to the backend.
   *
   * @param {{ username: string, password: string }} data
   *  Object with values of username, password and confirm password user entered to register
   *
   * @returns {boolean}
   *    Whether validation has passed or not
   *
   * Return false and show warning message if any validation condition fails, otherwise return true.
   * (NOTE: The error messages to be shown for each of these cases, are given with them)
   * -    Check that username field is not an empty value - "Username is a required field"
   * -    Check that password field is not an empty value - "Password is a required field"
   */
  const validateInput = () => {
    const { username, password } = formData;

    let arr = [
      {
        check: username === "",
        popup: "Username is a required field",
      },
      {
        check: password === "",
        popup: "Password is a required field",
      },
    ];

    for (let { check, popup } of arr) {
      if (check) {
        enqueueSnackbar(popup, { variant: "warning" });
        setIsLoading(false);
        return false;
      }
    }
    setIsLoading(false);
    return true;
  };

  // TODO: CRIO_TASK_MODULE_LOGIN - Persist user's login information
  /**
   * Store the login information so that it can be used to identify the user in subsequent API calls
   *
   * @param {string} token
   *    API token used for authentication of requests after logging in
   * @param {string} username
   *    Username of the logged in user
   * @param {string} balance
   *    Wallet balance amount of the logged in user
   *
   * Make use of localStorage: https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage
   * -    `token` field in localStorage can be used to store the Oauth token
   * -    `username` field in localStorage can be used to store the username that the user is logged in as
   * -    `balance` field in localStorage can be used to store the balance amount in the user's wallet
   */
  const persistLogin = (token, username, balance) => {
    localStorage.setItem("token", token);
    localStorage.setItem("username", username);
    localStorage.setItem("balance", balance);
  };

  return (
    <Box display="flex" flexDirection="column" height="100vh">
      <Header hasHiddenAuthButtons={false} />
      <Box className="content" sx={{ flexGrow: 1 }}>
        <Stack spacing={2} className="form">
          <h2 className="title">Login</h2>
          <TextField
            className="TextField"
            id="username"
            label="Username"
            variant="outlined"
            title="Username"
            name="username"
            placeholder="Enter Username"
            fullWidth
            onChange={(e) =>
              setFormData((prevData) => ({
                ...prevData,
                [e.target.id]: e.target.value,
              }))
            }
          />
          <TextField
            className="TextField"
            id="password"
            variant="outlined"
            label="Password"
            name="password"
            type="password"
            fullWidth
            onChange={(e) =>
              setFormData((prevData) => ({
                ...prevData,
                [e.target.id]: e.target.value,
              }))
            }
          />
          {!isLoading && (
            <Button
              className="button"
              variant="contained"
              onClick={async () => {
                await setIsLoading(true);
                if (validateInput()) login();
              }}
            >
              Login to QKart
            </Button>
          )}
          {isLoading && (
            <Box className="progress">
              <CircularProgress />
            </Box>
          )}
          <p className="secondary-action">
            Don't have an account? <Link to="/register">Register Now</Link>
          </p>
        </Stack>
      </Box>
      <Footer />
    </Box>
  );
};

export default Login;
