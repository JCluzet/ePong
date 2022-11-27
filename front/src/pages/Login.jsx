import LoginButton from "../components/LoginButton";
import logo from "../assets/images/logo.svg";
import schoollogo from "../assets/images/schoollogo.png";

export default function Login() {
  return (
    <div className="center">
      <div className="container-login">
        <img src={logo} alt="logo" className="logo" />
        <div className="btn-login">
          <button className="button-85" role="button">
            <div className="btn-login-btn">
              <img width={40} src={schoollogo} alt="" />
              <div className="text-login">Login</div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
