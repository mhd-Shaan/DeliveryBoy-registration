import React, { useEffect, useState } from "react";
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  CircularProgress,
  Alert,
  Snackbar,
} from "@mui/material";
import axios from "axios";
import { useSelector } from "react-redux";

const Dashboard = () => {
  const user = useSelector((state) => state.user.user); // Logged-in delivery boy
  
  const [currentOrder, setCurrentOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  // Show snackbar messages
  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  // Update location
  const updateLocation = async (lat, lng) => {
    try {
await axios.patch(
  `http://localhost:5000/location/${user.user._id}`,
  { lat, lng }, // 🟩 body
  {
    withCredentials: true, // 🟩 config (optional, only if backend uses cookies)
  }
);

    } catch (err) {
      console.error("Location update failed:", err.message);
    }
  };

  // Get current assigned order
  const fetchCurrentOrder = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/current-order/${user.user._id}`,{
                 withCredentials: true 

      });
      setCurrentOrder(res.data.order || null);
    } catch (err) {
      console.error("Fetch order failed:", err.message);
    }
  };

  // Start geolocation tracking
  useEffect(() => {
    let watchId;

    if ("geolocation" in navigator) {
      watchId = navigator.geolocation.watchPosition(
        (position) => {
          updateLocation(position.coords.latitude, position.coords.longitude);
        },
        (error) => {
          console.error("Geolocation error:", error.message);
        },
        { enableHighAccuracy: true, maximumAge: 5000, timeout: 10000 }
      );
    } else {
      console.error("Geolocation not available");
    }

    return () => {
      if (watchId) navigator.geolocation.clearWatch(watchId);
    };
  }, []);

  // Poll current order every 5 seconds
  useEffect(() => {
    fetchCurrentOrder();
    const interval = setInterval(fetchCurrentOrder, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Typography variant="h4" gutterBottom>
          Delivery Dashboard
        </Typography>
        <Typography variant="body1" sx={{ mb: 3 }}>
          Status: <strong>{currentOrder ? "Busy (Order Assigned)" : "Online & Available"}</strong>
        </Typography>

        {currentOrder ? (
          <Box sx={{ p: 2, border: "1px solid #1976d2", borderRadius: 2 }}>
            <Typography variant="h6">Current Order</Typography>
            <Typography>Order ID: {currentOrder._id}</Typography>
            <Typography>Store: {currentOrder.storeName}</Typography>
            <Typography>Customer: {currentOrder.customerName}</Typography>
            <Typography>Address: {currentOrder.deliveryAddress}</Typography>
            <Typography>Status: {currentOrder.orderStatus}</Typography>
          </Box>
        ) : (
          <Box sx={{ textAlign: "center", mt: 4 }}>
            <CircularProgress />
            <Typography variant="body2" sx={{ mt: 1 }}>
              Waiting for new orders...
            </Typography>
          </Box>
        )}
      </Paper>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          severity={snackbar.severity}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Dashboard;
