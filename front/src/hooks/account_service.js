// import { useEffect } from "react";
import axios from "../config/axios";

let saveToken = (token) => {
    // alert("saveToken : " + token);
  localStorage.setItem("token", token);
  // use axios to send token using get request to backend with /auth/get_token?code=token
  // if response is 200, redirect to dashboard
  console.log(token);

  axios.get(`http://localhost:5001/auth/get_token?code=${token}`).then(
    (response) => {
      if (response.status === 200 || response.status === 201) {
        // window.location.href = "/dashboard";
        alert("You are logged in with Bearer token :" + response.data);
        // store access_token in localStorage
        localStorage.setItem("api_token", response.data.api_token);
      }
    },
    (error) => {
      console.log(error);
    }
  );
};

let logout = () => {
  localStorage.removeItem("token");
  window.location.href = "/";
};

let isLogged = () => {
  return localStorage.getItem("token") !== null;
};

export const accountService = {
  saveToken,
  logout,
  isLogged,
};
