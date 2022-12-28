import { useState } from "react";
import axios from "../config/axios";
import { accountService } from "../hooks/account_service";

export default function Status() {
  // state
  const [backendStatus, setBackendStatus] = useState(
    localStorage.getItem("BackendDown") === "true"
  );

  // comportements
  const checkBackend = () => {
    var config = {
      method: "get",
      url: "/",
    };
    axios(config)
      .then(function (response) {
          localStorage.setItem("BackendDown", false);
          setBackendStatus(false);
          console.log("check backend... UP!");
    })
    .catch(function (error) {
        setBackendStatus(true);
        localStorage.setItem("BackendDown", true);
        console.log("check backend... DOWN!");
    });
    setTimeout(checkBackend, 2000);

  };

  // affichage

  return (
    <div className="status">
      {checkBackend()}
      <div className="status-text">Backend Status</div>
      {backendStatus ? (
        <div className="status-circle-down"></div>
      ) : (
        <div className="status-circle-up"></div>
      )}
    </div>
  );
}
