import axios from "../config/axios";

let storeProfilData = async (token, login, callback) => {
  var config = {
    method: "get",
    url: "/users/profile/" + login,
    headers: { Authorization: "Bearer " + token },
  };

  axios(config)
    .then(function (response) {
      localStorage.setItem("avatarUrl", response.data.avatarUrl);
      localStorage.setItem("isTwoFa", response.data.isTwoFa);
      localStorage.setItem("status", response.data.status);
      localStorage.setItem("kda", response.data.kda);
      localStorage.setItem("totalGame", response.data.totalGame.toString());
      localStorage.setItem("nbWins", response.data.nbWins.toString());
      localStorage.setItem("nbLoses", response.data.nbLoses.toString());
      localStorage.setItem("username", response.data.name);

      if (typeof callback === "function") {
        callback();
      }
      return response;
    })
    .catch(function (error) {});
};

export default storeProfilData;
