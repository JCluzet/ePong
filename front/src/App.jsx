import Header from "./components/Header";
import { useState, useEffect } from "react";
import "semantic-ui-css/semantic.min.css";
import Particle from "./components/Particle";
import { Routes, Route, BrowserRouter as Router } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import { Button } from "semantic-ui-react";
// import { GlobalProvider } from "./providers/GlobalProvider";

export default function App() {
  // state

  return (
    // classic url using browser
    // <div>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<Home />} />
        </Routes>

      </Router>
    // </div>
  );
}
