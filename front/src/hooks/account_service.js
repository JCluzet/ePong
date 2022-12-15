// import { useEffect } from "react";
import axios from "../config/axios";
import storeProfilData from "./storeProfilData";

let ModifyUsername = (username) => {
  var config = {
    method: "post",
    url: "/users/edit",
    headers: { Authorization: "Bearer " + userToken(), "Content-Type": "application/json"},
    body: JSON.stringify({
      login: userLogin(),
      name: "username",
      isTwoFa: isTwoFa(),
      avatarUrl: userAvatarUrl(),
    }),
  };

//   console.log("Username modified : " + username);
  axios(config)
    .then(function (response) {
      console.log("Username modified : " + username);
      localStorage.setItem("username", username);
    })
    .catch(function (error) {
      console.log("Erreur, impossible de modifier le username > " + error);
    });
};

let saveToken = (code) => {
  localStorage.setItem("code", code);

  var config = {
    method: "get",
    url: "/auth/get_token?code=" + code,
    headers: {},
  };

  axios(config)
    .then(function (response) {
      localStorage.setItem("token", response.data.apiToken);
      console.log("Token saved : " + response.data.apiToken);
      localStorage.setItem("login", response.data.login);
      window.location.href = "/";
    })
    .catch(function (error) {
      alert("Backend still loading... Please wait");
      console.log("Token seems to be invalid, please try again");
      console.log(error);
      localStorage.removeItem("code");
      window.location.href = "/";
    });
  storeProfilData();
};

let userToken = () => {
  return localStorage.getItem("token");
};

let isTwoFa = () => {
  return localStorage.getItem("isTwoFa");
};

let userLogin = () => {
  //   alert("userLogin : " + localStorage.getItem("login"));
  return localStorage.getItem("login");
};

let userName = () => {
  return localStorage.getItem("username");
};

let userAvatarUrl = () => {
  return localStorage.getItem("avatarUrl");
};

let logout = () => {
  localStorage.removeItem("code");
  window.location.href = "/";
};

let isLogged = () => {
  return localStorage.getItem("code") !== null;
  //   window.location.href = "/das";
};

export const accountService = {
  saveToken,
  ModifyUsername,
  logout,
  isLogged,
  userToken,
  isTwoFa,
  userAvatarUrl,
  userLogin,
  userName,
};
