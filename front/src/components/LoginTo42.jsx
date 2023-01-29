import schoollogo from "../assets/images/schoollogo.png";
import useStoreToken from "../hooks/storeToken";
import logo from "../assets/images/logo.svg";
import Alert from "./Alert";
import { toast } from "react-toastify";

export default function LoginTo42() {
  const HandleLogin = () => {
    if (localStorage.getItem("BackendDown") === "true") {
      toast.error("Backend is down, please try again later");
      return;
    }
    const uid = process.env.REACT_APP_UID_TOKEN;
    window.location.href =
      "https://api.intra.42.fr/oauth/authorize?client_id=" +
      uid +
      "&redirect_uri=http%3A%2F%2Flocalhost%3A3000&response_type=code";
  };

  return (
    <div>
      {useStoreToken()}
      <div className="container-login">
        <img src={logo} alt="logo" className="logo" />
        <div className="btn-login">
          <button className="button-shiny" onClick={HandleLogin}>
            <div className="element-btn-login">
              <img width={40} src={schoollogo} alt="" />
              <div className="text-login">Login</div>
            </div>
          </button>
          <Alert />
        </div>
      </div>
    </div>
  );
}
