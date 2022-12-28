import schoollogo from "../assets/images/schoollogo.png";
import useStoreToken from "../hooks/storeToken";
import logo from "../assets/images/logo.svg";

export default function LoginTo42() {

    // state
  const HandleLogin = () => {
    const uid = process.env.REACT_APP_UID_TOKEN;
    window.location.href =
      "https://api.intra.42.fr/oauth/authorize?client_id=" +
      uid +
      "&redirect_uri=http%3A%2F%2Flocalhost%3A3000&response_type=code";
    // useStoreToken();
  };

  // comportements

  // affichage

  return(
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
      </div>
    </div>
  </div>
  );
}
