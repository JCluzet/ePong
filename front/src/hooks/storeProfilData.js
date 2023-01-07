import axios from "../config/axios";
// import { accountService } from "./account_service";

let storeProfilData = async (token, login, callback) => {
  var config = {
    method: "get",
    url: "/users/profile/" + login,
    headers: { Authorization: "Bearer " + token },
  };
  console.log("storeProfilData");

  // wait until axios is available, then make the request
  axios(config)
    .then(function (response) {
      console.log("OK! STORE PROFIL DATA : " + response.data.name);
      console.log("hour : " + Date.now());


      // console.log("Avatar saved : " + response.data.avatarUrl);
      // console.log("Username saved : " + response.data.name);
      // console.log("isTwoFa saved : " + response.data.isTwoFa);
      localStorage.setItem("avatarUrl", response.data.avatarUrl);
      localStorage.setItem("isTwoFa", response.data.isTwoFa);
      localStorage.setItem("status", response.data.status);
      localStorage.setItem("kda", response.data.kda);
      localStorage.setItem("totalGame", response.data.totalGame.toString());
      console.log(`nbWins: ${response.data.nbWins}`);
      localStorage.setItem("nbWins", response.data.nbWins.toString());
      localStorage.setItem("nbLoses", response.data.nbLoses.toString());
      localStorage.setItem("username", response.data.name);
    //   console.log("userCreate : " + response.data.userCreate);
      //first login check here
        // localStorage.setItem("userCreate", response.data.userCreate);

      if (typeof callback === "function"){
          callback();
      } 
        return response;
    })
    .catch(function (error) {
        console.log("KO STORE DATAPROFIL!");
        console.log("Erreur, impossible de get /user/profile > ".error);
    });
  // print what is the response status code by making a new request
  console.log("fin storeProfilData");
};

export default storeProfilData;
