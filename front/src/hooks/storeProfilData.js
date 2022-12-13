import axios from "../config/axios";
import { accountService } from "./account_service";

let storeProfilData = () => {
  var config = {
    method: "get",
    url: "/users/profile/" + accountService.userLogin(),
    headers: { Authorization: "Bearer " + accountService.userToken() },
  };

  axios(config)
    .then(function (response) {
      localStorage.setItem("avatarUrl", response.data.avatarUrl);
      console.log("Avatar saved : " + response.data.avatarUrl);
      // here store another data
        
    
    
    
    })
    .catch(function (error) {
    //   console.log("Erreur, impossible de get /user/profile > " . error);
    });
};

export default storeProfilData;
