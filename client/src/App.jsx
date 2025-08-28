import React from 'react'
import DeliveryBoyRegister from './Regstration'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<DeliveryBoyRegister/>} />
        </Routes>

      </Router>
    </div>
  )
}

export default App
