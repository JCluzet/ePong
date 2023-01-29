import axios from "../config/axios";
import storeProfilData from "./storeProfilData";
import { toast } from "react-toastify";

let GetUsername = async (login) => {
  var config = {
    method: "get",
    url: "/users/profile/" + login,
    headers: { Authorization: "Bearer " + userToken() },
  };
  let username = "";

  await axios(config)
    .then(function (response) {
      username = response.data.name;
    })
    .catch(function (error) {});
  return username;
};

let ModifyUsername = async (username) => {
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
      localStorage.setItem("username", username);
      return response;
    })
    .catch(function (error) {
      logout();
    });
};

let editAll = async (image, username, tfa) => {
  let formdata = new FormData();
  if (image === undefined) {
    formdata.append("file", undefined);
    formdata.append("name", username);
    formdata.append("twofa", tfa);
  } else {
    formdata = image;
    formdata.append("name", username);
    formdata.append("twofa", tfa);
  }

  var config = {
    method: "post",
    url: "/users/editAll",
    headers: {
      Authorization: "Bearer " + userToken(),
      "Content-Type": "multipart/form-data",
    },
    data: formdata,
  };
  axios(config)
    .then(function (response) {
      toast.success("Your profile has been updated");
      return response;
    })
    .catch(function (error) {});
};

let majAvatar = async () => {
  var config = {
    method: "get",
    url: "/users/profile/" + userLogin(),
    headers: { Authorization: "Bearer " + userToken() },
  };

  axios(config)
    .then(function (response) {
      localStorage.setItem("avatarUrl", response.data.avatarUrl);
    })
    .catch(function (error) {
      logout();
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

  try {
    const response = await axios(config);
    await majAvatar();
    return response;
  } catch (error) {
    logout();
  }
}

async function ChangeStatus(newStatus) {
  var config = {
    method: "post",
    url: "/users/changeStatus",
    headers: {
      Authorization: "Bearer " + userToken(),
      "Content-Type": "application/json",
    },
    data: JSON.stringify({
      status: newStatus,
    }),
  };
  await axios(config);
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
      isTwoFa: tfa,
      avatarUrl: userAvatarUrl(),
    }),
  };

  axios(config)
    .then(function (response) {
      localStorage.setItem("isTwoFa", tfa);
    })
    .catch(function (error) {
      logout();
    });
};

let isBackendDown = () => {
  return localStorage.getItem("BackendDown");
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
      localStorage.setItem("NeedTwoFa", response.data.twofa);
      if (response.data.twofa) {
        window.location.href = "/";
        return;
      }
      localStorage.setItem("firstlogin", response.data.userCreate);

      localStorage.setItem("token", response.data.apiToken);
      localStorage.setItem("login", response.data.login);
      storeProfilData(
        response.data.apiToken,
        response.data.login,
        () => (window.location.href = "/")
      );
    })
    .catch(function (error) {
      localStorage.removeItem("code");
      window.location.href = "/";
      localStorage.setItem("Alert", "API Key (MAIL) seems to be invalid");
    });
};

let LoginWithTFA = (code) => {
  var config = {
    method: "get",
    url: "/auth/twofa/get_token?login=" + userLogin() + "&code=" + code,
    headers: {},
  };

  axios(config)
    .then(function (response) {
      localStorage.setItem("token", response.data.apiToken);
      localStorage.setItem("NeedTwoFa", false);
      localStorage.setItem("IncorrectTfa", false);
      return true;
    })
    .catch(function (error) {
      localStorage.setItem("NeedTwoFa", true);
      localStorage.setItem("IncorrectTfa", true);
      return false;
    });
};

let userToken = () => {
  return localStorage.getItem("token");
};

let isTwoFa = () => {
  return localStorage.getItem("isTwoFa") === "true" ? true : false;
};

let userLogin = () => {
  return localStorage.getItem("login");
};

let userName = () => {
  return localStorage.getItem("username");
};

let userAvatarUrl = () => {
  return localStorage.getItem("avatarUrl");
};

let userStatus = () => {
  return localStorage.getItem("status");
};

let userKda = () => {
  return localStorage.getItem("kda");
};

let userTotalGame = () => {
  return localStorage.getItem("totalGame");
};

let userNbWins = () => {
  return localStorage.getItem("nbWins");
};

let userNbLoses = () => {
  return localStorage.getItem("nbLoses");
};

let friendName = () => {
  return localStorage.getItem("friendName");
};

let logout = () => {
  ChangeStatus("offline");
  localStorage.removeItem("token");
  window.location.href = "/";
};

let isLogged = () => {
  if (userLogin === "") return false;
  if (localStorage.getItem("firstlogin") === "true") return false;
  return localStorage.getItem("token") !== null;
};

export const accountService = {
  saveToken,
  ModifyUsername,
  logout,
  isLogged,
  isBackendDown,
  editAll,
  ModifyTfa,
  userToken,
  isTwoFa,
  ModifyAvatar,
  userAvatarUrl,
  userLogin,
  LoginWithTFA,
  userName,
  userKda,
  userNbLoses,
  GetUsername,
  userNbWins,
  userStatus,
  userTotalGame,
  friendName,
};
