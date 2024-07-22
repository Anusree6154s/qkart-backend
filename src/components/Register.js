import { Button, CircularProgress, Stack, TextField } from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useState } from "react";
import { config } from "../App";
import Footer from "./Footer";
import Header from "./Header";
import "./Register.css";

const Register = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  // TODO: CRIO_TASK_MODULE_REGISTER - Implement the register function
  /**
   * Definition for register handler
   * - Function to be called when the user clicks on the register button or submits the register form
   *
   * @param {{ username: string, password: string, confirmPassword: string }} formData
   *  Object with values of username, password and confirm password user entered to register
   *
   * API endpoint - "POST /auth/register"
   *
   * Example for successful response from backend for the API call:
   * HTTP 201
   * {
   *      "success": true,
   * }
   *
   * Example for failed response from backend for the API call:
   * HTTP 400
   * {
   *      "success": false,
   *      "message": "Username is already taken"
   * }
   */
  const register = async () => {
    const { username, password } = formData;
    try {
      await axios.post(config.endpoint + "/auth/register", {
        username,
        password,
      });
      enqueueSnackbar("Registered successfully", { variant: "success" });
    } catch (error) {
      if (error.response) {
        enqueueSnackbar("Username is already taken", { variant: "error" });
      } else {
        enqueueSnackbar(
          "Something went wrong. Check that the backend is running, reachable and returns valid JSON.",
          { variant: "error" }
        );
      }
    }
  };

  // TODO: CRIO_TASK_MODULE_REGISTER - Implement user input validation logic
  /**
   * Validate the input values so that any bad or illegal values are not passed to the backend.
   *
   * @param {{ username: string, password: string, confirmPassword: string }} data
   *  Object with values of username, password and confirm password user entered to register
   *
   * @returns {boolean}
   *    Whether validation has passed or not
   *
   * Return false if any validation condition fails, otherwise return true.
   * (NOTE: The error messages to be shown for each of these cases, are given with them)
   * -    Check that username field is not an empty value - "Username is a required field"
   * -    Check that username field is not less than 6 characters in length - "Username must be at least 6 characters"
   * -    Check that password field is not an empty value - "Password is a required field"
   * -    Check that password field is not less than 6 characters in length - "Password must be at least 6 characters"
   * -    Check that confirmPassword field has the same value as password field - Passwords do not match
   */
  const validateInput = () => {
    const { username, password, confirmPassword } = formData;

    console.log(isLoading);
    let arr = [
      {
        check: username === "",
        popup: "Username is a required field",
      },
      {
        check: username.length < 6,
        popup: "Username must be at least 6 characters",
      },
      {
        check: password === "",
        popup: "Password is a required field",
      },
      {
        check: password.length < 6,
        popup: "Password must be at least 6 characters",
      },
      {
        check: confirmPassword !== password,
        popup: "Passwords do not match",
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

  console.log(isLoading);
  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      minHeight="100vh"
    >
      <Header hasHiddenAuthButtons />
      <Box className="content">
        <Stack spacing={2} className="form">
          <h2 className="title">Register</h2>
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
            helperText="Password must be atleast 6 characters length"
            fullWidth
            placeholder="Enter a password with minimum 6 characters"
            onChange={(e) =>
              setFormData((prevData) => ({
                ...prevData,
                [e.target.id]: e.target.value,
              }))
            }
          />
          <TextField
            className="TextField"
            id="confirmPassword"
            variant="outlined"
            label="Confirm Password"
            name="confirmPassword"
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
                setTimeout(() => {
                  validateInput() && register();
                }, 1000);
              }}
            >
              Register Now
            </Button>
          )}
          {isLoading && (
            <Box className="progress">
              <CircularProgress />
            </Box>
          )}
          <p className="secondary-action">
            Already have an account?{" "}
            <a className="link" href="#">
              Login here
            </a>
          </p>
        </Stack>
      </Box>
      <Footer />
    </Box>
  );
};

export default Register;
