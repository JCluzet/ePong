import logo from "../assets/images/logo.svg";
import schoollogo from "../assets/images/schoollogo.png";
import Footer from "../components/Footer";
import ParticleBackground from "../particlesBackground/ParticleBackground";
import useStoreToken from "../hooks/storeToken";
import Twofa from "../components/two-fa";
import LoginTo42 from "../components/LoginTo42";
import { accountService } from "../hooks/account_service";

export default function Login() {
  return (
    <div>
      {useStoreToken()}
      <ParticleBackground />
      <div className="center">
        {localStorage.getItem("NeedTwoFa") === "true" ? <Twofa/> : <LoginTo42/>}
        {/* <Twofa /> */}
        {/* <LoginTo42 /> */}
      </div>
      <Footer />
    </div>
  );
}
