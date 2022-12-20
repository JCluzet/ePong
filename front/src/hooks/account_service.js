// import { useEffect } from "react";
import axios from "../config/axios";
import storeProfilData from "./storeProfilData";

// let ModifyAvatar = (avatarUrl) => {
//   var config = {
//     method: "post",
//     url: "/users/edit",
//     headers: {
//       Authorization: "Bearer " + userToken(),
//       "Content-Type": "application/json",
//     },
//     data: JSON.stringify({
//       login: userLogin(),
//       name: userName(),
//       isTwoFa: isTwoFa(),
//       avatarUrl: avatarUrl,
//     }),
//   };

//   axios(config)
//     .then(function (response) {
//       localStorage.setItem("avatarUrl", avatarUrl);
//       // refresh the window
//       window.location.reload();
//     })
//     .catch(function (error) {
//       console.log("Erreur, impossible de modifier l'avatar > " + error);
//     });
// };

let majAvatar = () => {
    var config = {
        method: "get",
        url: "/users/profile/" + userLogin(),
        headers: { Authorization: "Bearer " + userToken() },
    };

    axios(config)
        .then(function (response) {
            localStorage.setItem("avatarUrl", response.data.avatarUrl);
            console.log("Avatar saved : " + response.data.avatarUrl);
        })
        .catch(function (error) {
            console.log("Erreur, impossible de get /user/profile > " + error);
        });
};

// export async function postCustomAvatar(formData) {
    // const storedData = JSON.parse(localStorage.getItem("user"));


let ModifyAvatar = (formData) => {
    console.log("Modify Avatar...");
    var config = {
        method: "post",
        url: "/users/uploadAvatar",
        headers: {
            Authorization: "Bearer " + userToken(),
            "Content-Type": "multipart/form-data"
        },
        data: {formData}
    };

    axios(config)
        .then(function (response) {
            majAvatar();
            // refresh the window
            console.log("Avatar modified : " + formData);
            window.location.reload();
        })
        .catch(function (error) {
            console.log("Erreur, impossible de modifier l'avatar > " + error);
        });
};

let ModifyTfa = (tfa) => {
  var config = {
    method: "post",
    url: "/users/edit",
    headers: {
      Authorization: "Bearer " + userToken(),
      "Content-Type": "application/json",
    },
    data: JSON.stringify({
      login: userLogin(),
      name: userName(),
      // istwofa must be a boolean
        isTwoFa: tfa,
      avatarUrl: userAvatarUrl(),
    }),
  };

  console.log("tfa change: " + tfa);

  axios(config)
    .then(function (response) {
        localStorage.setItem("isTwoFa", tfa);
        console.log("isTwoFa modified : " + accountService.isTwoFa());
    })
    .catch(function (error) {
      console.log("Erreur, impossible de modifier le tfa > " + error);
    });
};

let ModifyUsername = (username) => {
  var config = {
    method: "post",
    url: "/users/edit",
    headers: {
      Authorization: "Bearer " + userToken(),
      "Content-Type": "application/json",
    },
    data: JSON.stringify({
      login: userLogin(),
      name: username,
      isTwoFa: isTwoFa(),
      avatarUrl: userAvatarUrl(),
    }),
  };

  //   console.log("Username modified : " + username);
  axios(config)
    .then(function (response) {
      localStorage.setItem("username", username);
      // refresh the window
      console.log("Username modified : " + username);
      window.location.reload();
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
      window.location.href = "/";
      localStorage.setItem("token", response.data.apiToken);
      console.log("Token saved : " + response.data.apiToken);
      localStorage.setItem("login", response.data.login);
      storeProfilData();
    })
    .catch(function (error) {
      alert("Backend still loading... Please wait");
      console.log("Token seems to be invalid, please try again");
      console.log(error);
      localStorage.removeItem("code");
      window.location.href = "/";
    });
};

let userToken = () => {
  return localStorage.getItem("token");
};

let isTwoFa = () => {
  return (localStorage.getItem("isTwoFa") === "true" ? true : false);
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
  localStorage.removeItem("token");
  window.location.href = "/";
};

let isLogged = () => {
  return localStorage.getItem("token") !== null;
  //   window.location.href = "/das";
};

export const accountService = {
  saveToken,
  ModifyUsername,
  logout,
  isLogged,
  ModifyTfa,
  userToken,
  isTwoFa,
  ModifyAvatar,
  userAvatarUrl,
  userLogin,
  userName,
};
