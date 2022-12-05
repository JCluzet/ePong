import axios from "../config/axios";
import { accountService } from "./account_service";

let profilData = () => {
  var config = {
    method: "get",
    url: "/users/profile/" + accountService.userLogin(),
    headers: { Authorization: "Bearer " + accountService.userToken() },
  };

  axios(config)
    .then(function (response) {
    //   console.log("HERE>" + response.data.avatarUrl);
      localStorage.setItem("avatarUrl", response.data.avatarUrl);
    })
    .catch(function (error) {
      console.log(error);
    });
};

export default profilData;
