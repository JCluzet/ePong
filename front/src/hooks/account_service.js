// import { useEffect } from "react";
import { toast } from "react-hot-toast";
import axios from "../config/axios";
import storeProfilData from "./storeProfilData";

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
      window.location.reload();
    })
    .catch(function (error) {
      console.log("Erreur, impossible de get /user/profile > " + error);
      logout();
  localStorage.setItem("Alert", "You have been disconnected for inactivity");
    });
};

async function ModifyAvatar(formData) {
  var config = {
    method: "post",
    url: "/users/uploadAvatar",
    headers: {
      Authorization: "Bearer " + userToken(),
      "Content-Type": "multipart/form-data",
    },
    data: formData,
  };

  axios(config)
    .then(function (response) {
      // refresh the window
      console.log("OK MODIFY AVATAR");
      console.log("Avatar modified : " + formData);
      majAvatar();
    })
    .catch(function (error) {
      console.log("KO MODIFY AVATAR");
      console.log("Erreur, impossible de modifier l'avatar > " + error);
      logout();
      localStorage.setItem("Alert", "You have been disconnected for inactivity");
    });
}

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
      logout();
      localStorage.setItem("Alert", "You have been disconnected for inactivity");
    });
};

let ModifyUsername = (username, reload) => {
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

  axios(config)
    .then(function (response) {
      // storeprofil a remplacer a la place de setItem
      localStorage.setItem("username", username);
      storeProfilData(userToken(), userLogin());
      if (!reload) window.location.reload();
    })
    .catch(function (error) {
      console.log("Erreur, impossible de modifier le username > " + error);
      logout();
      localStorage.setItem("Alert", "You have been disconnected for inactivity");
    });
};

let isBackendDown = () => {
  return localStorage.getItem("BackendDown");
};

let saveToken = (code) => {
  localStorage.setItem("code", code);
  console.log("Code saved : " + code);

  var config = {
    method: "get",
    url: "/auth/get_token?code=" + code,
    headers: {},
  };

  axios(config)
    .then(function (response) {
      window.location.href = "/";
      console.log("TwoFa: " + response.data.twofa);
      localStorage.setItem("NeedTwoFa", response.data.twofa);
      if (response.data.twofa) {
        return;
      }

      localStorage.setItem("token", response.data.apiToken);
      console.log("Token saved : " + response.data.apiToken);
      localStorage.setItem("login", response.data.login);
      storeProfilData(response.data.apiToken, response.data.login);
    })
    .catch(function (error) {
      console.log("Token seems to be invalid, please try again");
      console.log(error);
      localStorage.removeItem("code");
      window.location.href = "/";
      localStorage.setItem("Alert", "Cannot get_token, please check email API");
    });
};

// DEV ONLY

let LoginWithTFA = (code) => {
  var config = {
    method: "get",
    url: "/auth/twofa/get_token?login=" + userLogin() + "&code=" + code,
    headers: {},
  };

  axios(config)
    .then(function (response) {
      // window.location.href = "/";
      console.log("TwoFa is Good!");
      localStorage.setItem("token", response.data.apiToken);
      console.log("Token saved : " + response.data.apiToken);
      localStorage.setItem("NeedTwoFa", false);
      localStorage.setItem("IncorrectTfa", false);
      return true;
    })
    .catch(function (error) {
      localStorage.setItem("NeedTwoFa", true);
      localStorage.setItem("IncorrectTfa", true);
      // localStorage.setItem("IncorrectTfa", true);
      console.log("TwoFa is incorrect");
      return false;
    });
};

let ResetUser = () => {
  var config = {
    method: "delete",
    url: "/users/reset",
    headers: {},
  };

  axios(config)
    .then(function (response) {
      alert("User reset & Tfa disabled ✅");
      window.location.href = "/";
      localStorage.removeItem("NeedTwoFa");
    })
    .catch(function (error) {
      console.log("Erreur, impossible de delete l'user > " + error);
    });
};

let userToken = () => {
  return localStorage.getItem("token");
};

let isTwoFa = () => {
  return localStorage.getItem("isTwoFa") === "true" ? true : false;
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
    console.log("Logout");
};

let isLogged = () => {
  return localStorage.getItem("token") !== null;
};

export const accountService = {
  saveToken,
  ModifyUsername,
  logout,
  isLogged,
  isBackendDown,
  ModifyTfa,
  userToken,
  isTwoFa,
  ModifyAvatar,
  userAvatarUrl,
  ResetUser,
  userLogin,
  LoginWithTFA,
  userName,
};
