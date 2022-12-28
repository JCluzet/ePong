import Footer from "../components/Footer";
import ParticleBackground from "../particlesBackground/ParticleBackground";
import Twofa from "../components/two-fa";
import LoginTo42 from "../components/LoginTo42";
import { accountService } from "../hooks/account_service";
import BackendDown from "../components/BackendDown";

export default function Login() {
  return (
    <div>
      <ParticleBackground />
      {accountService.checkBackend()}
        {/* {accountService.isBackendDown() ? accountService.checkBackend() : null} */}
      <div className="center">
        {localStorage.getItem("BackendDown") === "true" ? <BackendDown/> : (localStorage.getItem("NeedTwoFa") === "true" ? <Twofa/> : <LoginTo42/>)}
      </div>
      <Footer />
    </div>
  );
}
