// import Header from "./components/Header";
// import { useState, useEffect } from "react";
import "semantic-ui-css/semantic.min.css";
import { /*toast,*/ ToastContainer } from 'react-toastify';  
import "react-toastify/dist/ReactToastify.css";
import { Routes, Route, BrowserRouter as Router } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
// import ParticleBackground from "./particlesBackground/ParticleBackground";
import NotFound from "./pages/NotFound";
import Game from "./pages/Game";
// import Live from "./components/Live"
import Social from "./pages/Social";
import { accountService } from "./hooks/account_service";
// import { Toaster } from 'react-hot-toast';
import Chat from "./pages/Chat";
import { CreateConv } from "./components/chatComponents/CreateConv/CreateConv";
import { CreateDirectConv } from "./components/chatComponents/CreateConv/CreateDirectConv";
import { CreateGroupConv } from "./components/chatComponents/CreateConv/CreateGroupConv";
import { JoinConversation } from "./components/chatComponents/CreateConv/JoinConversation";
import { AdminPanel } from "./components/chatComponents/ChatFeed/AdminPanel";
import GameSpectate from "./pages/GameSpectate";

// import { GlobalProvider } from "./providers/GlobalProvider";

export default function App() {
  // state

  return (
    // classic url using browser
    <div>
      {/* Same as */}
      {/* <Toaster
        position="bottom-left"
        reverseOrder={false}
      /> */}
            <ToastContainer
position="bottom-right"
autoClose={5000}
hideProgressBar={false}
newestOnTop={false}
closeOnClick
rtl={false}
pauseOnFocusLoss
draggable
pauseOnHover
theme="light"
/>
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
          <Route path="/social/chat" element={
            accountService.isLogged() ? <Chat /> : <Login />
            } />
          <Route path="/social/chat/createconv" element={
            accountService.isLogged() ? <CreateConv /> : <Login />
            } />
          <Route path="/social/chat/createDirectConv" element={
            accountService.isLogged() ? <CreateDirectConv /> : <Login />
            } />
          <Route path="/social/chat/createGroupConv" element={
            accountService.isLogged() ? <CreateGroupConv /> : <Login />
            } />
          <Route path="/social/chat/joinConversation" element={
            accountService.isLogged() ? <JoinConversation /> : <Login />
            } />
          <Route path="/social/chat/adminpanel" element={
            accountService.isLogged() ? <AdminPanel /> : <Login />
            } />

          <Route path="/spectate" element={
            accountService.isLogged() ? <GameSpectate /> : <Login />
            } />
          {/* <Route path="/live" element={
            accountService.isLogged() ? <Live /> : <Login />
            } /> */}
        <Route path="*" element={
            accountService.isLogged() ? <NotFound /> : <Login />
            } />
        </Routes>
      </Router>
    </div>
  );
}
