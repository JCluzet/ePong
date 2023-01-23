// import { useEffect } from "react";
import axios from "../config/axios";
import storeProfilData from "./storeProfilData";
import { /*toast,*/ toast } from "react-toastify";



let GetUsername = async (login) => {
    var config = {
        method: "get",
        url: "/users/profile/" + login,
        headers: { Authorization: "Bearer " + userToken() }
    };
    let username = "";

    await axios(config).then(function (response) {
        username = response.data.name;
    }).catch(function (error) {
        console.log("Erreur, impossible de get username > " + error);
    });
    return(username);
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
        console.log("je viens de modif username dans le back par "+ username);
        // output on console the exact time in milliseconds
        console.log("houfdfdfdr : " + Date.now());
      localStorage.setItem("username", username);
    //   storeProfilData(userToken(), userLogin());
    //wait 1 second before return response;
    //   if (!reload) window.location.reload();
      return response;
    //   if (!reload) window.location.reload();
    })
    .catch(function (error) {
      console.log("Erreur, impossible de modifier le username > " + error);
      logout();
      localStorage.setItem("Alert", "You have been disconnected for inactivity");
    });
};

let editAll = async (image, username, tfa) => {
    // if the image is "undefined" we need to catch the actual image data with url userAvatarUrl() and put it in the form data
    let formdata = new FormData();
    if (image === undefined) {
        formdata.append("file", undefined);
        formdata.append("name", username);
        formdata.append("twofa", tfa);
        console.dir(formdata);
    }
    else {
        formdata = image;
        formdata.append("name", username);
        formdata.append("twofa", tfa);
        console.dir("formdata with new image: " + formdata);
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
            console.log("EditAll username :" + username);
            console.log("EditAll tfa :" + tfa);
            console.log("EditAll image :" + image);
            console.log("EditAll response :" + response);
            toast.success("Your profile has been updated");
            return response;
        })
        .catch(function (error) {
            console.log("Erreur, impossible de EditAll > " + error);
        });
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
      console.log("Avatar saved : " + response.data.avatarUrl);
    //   window.location.reload();
    })
    .catch(function (error) {
      console.log("Erreur, impossible de get /user/profile > " + error);
      logout();
  localStorage.setItem("Alert", "You have been disconnected for inactivity");
    });
};

// create a async function that modify avatar 
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
        console.log("response : " + response);
        await majAvatar();
        return response;
    } catch (error) {
        console.log("KO MODIFY AVATAR");
        console.log("Erreur, impossible de modifier l'avatar > " + error);
        logout();
        localStorage.setItem("Alert", "You have been disconnected for inactivity");
    }
}

async function ChangeStatus(newStatus) {
  var config = {
    method: 'post',
    url: '/users/changeStatus',
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


// function ModifyAvatar(formData) {
//   var config = {
//     method: "post",
//     url: "/users/uploadAvatar",
//     headers: {
//       Authorization: "Bearer " + userToken(),
//       "Content-Type": "multipart/form-data",
//     },
//     data: formData,
//   };

//   axios(config)
//     .then(function (response) {
//       // refresh the window
//       console.log("OK MODIFY AVATAR");
//       console.log("Avatar modified : " + formData);
//       majAvatar();
//     })
//     .catch(function (error) {
//       console.log("KO MODIFY AVATAR");
//       console.log("Erreur, impossible de modifier l'avatar > " + error);
//       logout();
//       localStorage.setItem("Alert", "You have been disconnected for inactivity");
//     });
// }

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

  console.log("tfa change: " + tfa);

  axios(config)
    .then(function (response) {
      localStorage.setItem("isTwoFa", tfa);
    //   localStorage.setItem("NeedTwoFa", tfa);
      console.log("isTwoFa modified : " + accountService.isTwoFa());
    })
    .catch(function (error) {
      console.log("Erreur, impossible de modifier le tfa > " + error);
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
    //   window.location.href = "/";
      console.log("TwoFa: " + response.data.twofa);
      localStorage.setItem("NeedTwoFa", response.data.twofa);
      if (response.data.twofa) {
        window.location.href = "/";
        return;
      }
      console.log("UserCreate: " + response.data.userCreate);
      localStorage.setItem("firstlogin", response.data.userCreate);

      localStorage.setItem("token", response.data.apiToken);
      console.log("Token saved : " + response.data.apiToken);
      localStorage.setItem("login", response.data.login);
      storeProfilData(response.data.apiToken, response.data.login, () => window.location.href="/");
    })
    .catch(function (error) {
      console.log("Token seems to be invalid, please try again");
      console.log(error);
      localStorage.removeItem("code");
      window.location.href = "/";
      localStorage.setItem("Alert", "API Key (MAIL) seems to be invalid");
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
    url: "/reset",
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

let userStatus = () => {
  return localStorage.getItem("status");
}

let userKda = () => {
  return localStorage.getItem("kda");
}

let userTotalGame = () => {
  return localStorage.getItem("totalGame");
}

let userNbWins = () => {
  return localStorage.getItem("nbWins");
}

let userNbLoses = () => {
  return localStorage.getItem("nbLoses");
}

let friendName = () => {
  return localStorage.getItem("friendName");
}

let logout = () => {
  ChangeStatus('offline');
  localStorage.removeItem("token");
  window.location.href = "/";
    console.log("Logout");
};

let isLogged = () => {
    if (userLogin === "")
        return false;
    if (localStorage.getItem("firstlogin") === "true")
        return false;
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
  ResetUser,
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
