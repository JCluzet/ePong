import { useState } from "react";
import axios from "../config/axios";

export default function Status() {
  const [backendStatus, setBackendStatus] = useState(
    localStorage.getItem("BackendDown") === "true"
  );

  const checkBackend = () => {
    var config = {
      method: "get",
      url: "/",
    };
    axios(config)
      .then(function (response) {
        localStorage.setItem("BackendDown", false);
        setBackendStatus(false);
      })
      .catch(function (error) {
        setBackendStatus(true);
        localStorage.setItem("BackendDown", true);
      });
    setTimeout(checkBackend, 2000);
  };

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
