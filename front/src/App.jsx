// import Header from "./components/Header";
// import { useState, useEffect } from "react";
import "semantic-ui-css/semantic.min.css";
import { Routes, Route, BrowserRouter as Router } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
// import ParticleBackground from "./particlesBackground/ParticleBackground";
import NotFound from "./pages/NotFound";
import Game from "./pages/Game";
import Social from "./pages/Social";
// import { GlobalProvider } from "./providers/GlobalProvider";

export default function App() {
  // state

  return (
    // classic url using browser
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<Home />} />
          <Route path="/play" element={<Game />} />
          <Route path="/social" element={<Social />} />
        <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </div>
  );
}
