// import Header from "./components/Header";
// import { useState, useEffect } from "react";
import "semantic-ui-css/semantic.min.css";
import { Routes, Route, BrowserRouter as Router } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
// import ParticleBackground from "./particlesBackground/ParticleBackground";
import NotFound from "./pages/NotFound";
import Game from "./pages/Game";
import Live from "./components/Live"
import Social from "./pages/Social";
import { accountService } from "./hooks/account_service";
// import { GlobalProvider } from "./providers/GlobalProvider";

export default function App() {
  // state

  return (
    // classic url using browser
    <div>
      <Router>
        <Routes>
          <Route path="/" element={
            accountService.isLogged() ? <Home /> : <Login />
            } />
          <Route path="/play" element={
            accountService.isLogged() ? <Game /> : <Login />
            } />
          <Route path="/social" element={
            accountService.isLogged() ? <Social /> : <Login />
            } />
          <Route path="/live" element={
            accountService.isLogged() ? <Live /> : <Login />
            } />
        <Route path="*" element={
            accountService.isLogged() ? <NotFound /> : <Login />
            } />
        </Routes>
      </Router>
    </div>
  );
}
