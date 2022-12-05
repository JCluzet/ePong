// import { useEffect } from "react";
import axios from "../config/axios";
import profilData from "./profilData";

let saveToken = (token) => {
  localStorage.setItem("token", token);

  var config = {
    method: "get",
    url: "/auth/get_token?code=" + token,
    headers: {},
  };

  axios(config)
    .then(function (response) {
      localStorage.setItem("apiToken", response.data.apiToken);
      localStorage.setItem("login", response.data.login);
      window.location.href = "/dashboard";
    })
    .catch(function (error) {
      console.log(error);
    });
    profilData();
};

let userToken = () => {
  return localStorage.getItem("apiToken");
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
  localStorage.removeItem("token");
  window.location.href = "/";
};

let isLogged = () => {
  return localStorage.getItem("token") !== null;
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
