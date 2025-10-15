import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useSelector } from "react-redux";
import { Toaster } from "react-hot-toast";

import DeliveryBoyRegister from './Regstration';
import Login from './login';
import Home from './Home';
import useCheckAuth from './hooks/useCheckAuth';

function App() {
    const { loading } = useCheckAuth();

  const { user } = useSelector((state) => state.user);
  if (loading) {
    return <h1>Loading...</h1>;
  }
  return (
    <Router>
      <Toaster position="top-right" reverseOrder={false} />
      <Routes>
        <Route path="/" element={user? <Home/>:<DeliveryBoyRegister />} />
        <Route path="/login" element={user? <Home/>:<Login />} />
        <Route path="/dashboard" element={user? <Home />:<Login/>} />
      </Routes>
    </Router>
  );
}

export default App;
