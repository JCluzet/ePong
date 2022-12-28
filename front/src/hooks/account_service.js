// import { useEffect } from "react";
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
       storeProfilData();
      if (!reload)
        window.location.reload();
    })
    .catch(function (error) {
      console.log("Erreur, impossible de modifier le username > " + error);
    });
};

let handleTwoFa = (isTwoFa) => {
  localStorage.setItem("isTwoFa", isTwoFa);
  if (isTwoFa === true) {
    localStorage.setItem("NeedTwoFa", true);
  } else {
    localStorage.setItem("NeedTwoFa", false);
  }
  console.log("isTwoFa saved : " + isTwoFa);
};

let checkBackend = () => {
    var config = {
        method: "get",
        url: "/"
    };
    axios(config)
        .then(function (response) {
            console.log("Backend is up");
            localStorage.setItem("BackendDown", false);
            // window.location.href = "/";
            // return false;
        })
        .catch(function (error) {
            console.log("Backend is down");
            localStorage.setItem("BackendDown", true);
            // alert("Backend is down, please wait");
            setTimeout(checkBackend, 2000);
            // window.location.reload();
            // return true;
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
      handleTwoFa(response.data.twofa);
      if (localStorage.getItem("NeedTwoFa") === "true") {
        return;
      }

      localStorage.setItem("token", response.data.apiToken);
      console.log("Token saved : " + response.data.apiToken);
      localStorage.setItem("login", response.data.login);
      storeProfilData();
    })
    .catch(function (error) {
    //   alert("Backend still loading... Please wait");
      console.log("Token seems to be invalid, please try again");
      console.log(error);
      localStorage.removeItem("code");
      window.location.href = "/";
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
      // console.log("Us");
    })
    .catch(function (error) {
      console.log("Erreur, impossible de delete l'user > " + error);
    });
};

//

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
  isBackendDown,
  checkBackend,
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
