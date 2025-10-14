import React, { use, useState } from "react";
import {
  Container,
  Paper,
  Box,
  Typography,
  TextField,
  Button,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import { useDispatch } from "react-redux";
import { useNavigate } from 'react-router-dom';
import { loginuser } from "./redux/userslice";

function Login() {
  const [showPassword, setShowPassword] = useState(false);
    const dispatch = useDispatch();
  const navigate = useNavigate(); // ✅ initialize navigation

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });


  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

 const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      
      const response = await axios.post(
        "http://localhost:5000/login",
        formData,
        { withCredentials: true }
      );
      dispatch(loginuser(response.data.token));
      navigate("/home");
      // window.location.reload();
      toast.success("Welcome back!");
    } catch (error) {
      console.log('hi');
      
      toast.error(error.response?.data?.error || "Login failed");
      console.log(error);
      
    }
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 10 }}>
      <Paper elevation={4} sx={{ p: 4, borderRadius: 3 }}>
        <Typography
          variant="h5"
          align="center"
          fontWeight={600}
          color="primary"
          gutterBottom
        >
          Login to Your Account
        </Typography>

        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ display: "flex", flexDirection: "column", gap: 3, mt: 2 }}
        >
          <TextField
            label="Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            fullWidth
            
          />

          <TextField
            label="Password"
            type={showPassword ? "text" : "password"}
            name="password"
            value={formData.password}
            onChange={handleChange}
            fullWidth
            
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <Button
            variant="contained"
            color="primary"
            type="submit"
            fullWidth
            sx={{ mt: 1, fontWeight: 600, textTransform: "none", py: 1 }}
          >
            Login
          </Button>

          <Typography variant="body2" align="center" sx={{ mt: 1 }}>
            Don’t have an account?{" "}
            <Link
              to="/signup"
              style={{ textDecoration: "none", color: "#1976d2", fontWeight: 500 }}
            >
              Create one
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
}

export default Login;
