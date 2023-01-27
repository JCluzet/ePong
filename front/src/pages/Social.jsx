import Header from "../components/Header";
// import ProfileCard from "../components/ProfileCard";
import Tabs from "../components/Tabs";
import ParticleBackground from "../particlesBackground/ParticleBackground";
// import storeProfilData from "../hooks/storeProfilData";
// import { accountService } from "../hooks/account_service";

export default function Social() {
  return (
    <div className="social-page">
      <ParticleBackground/>
      <Header />
      <br />
      <Tabs/>
    </div>
  );
}