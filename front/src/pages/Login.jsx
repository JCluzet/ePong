import Footer from "../components/Footer";
import ParticleBackground from "../particlesBackground/ParticleBackground";
import Twofa from "../components/two-fa";
import LoginTo42 from "../components/LoginTo42";
import Status from "../components/Status";

export default function Login() {
  return (
    <div>
      <ParticleBackground />
      <Status />
      <div className="center">
        {localStorage.getItem("NeedTwoFa") === "true" ? (
          <Twofa />
        ) : (
          <LoginTo42 />
        )}
      </div>
      <Footer />
    </div>
  );
}
