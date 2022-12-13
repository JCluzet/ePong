// import { useEffect } from "react";
import axios from "../config/axios";
import storeProfilData from "./storeProfilData";

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

let userLogin = () => {
//   alert("userLogin : " + localStorage.getItem("login"));
  return localStorage.getItem("login");
};

let userAvatarUrl = () => {
    return localStorage.getItem("avatarUrl");
};

// let userAvatarUrl = () => {
    // return localStorage.getItem("

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
  logout,
  isLogged,
  userToken,
  userAvatarUrl,
  userLogin,
};
