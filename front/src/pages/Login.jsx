import logo from "../assets/images/logo.svg";
import schoollogo from "../assets/images/schoollogo.png";
import Footer from "../components/Footer";
import ParticleBackground from "../particlesBackground/ParticleBackground";
import useStoreToken from "../hooks/storeToken";


export default function Login() {
    // state
    const HandleLogin = () => {
        const uid = "u-s4t2ud-b59cc983f394e5955fd2958b140836f2b7da91861bbc9c153c5fa2bbaccd280d";
        window.location.href = "https://api.intra.42.fr/oauth/authorize?client_id=" + uid + "&redirect_uri=http%3A%2F%2Flocalhost%3A3000&response_type=code";
    };



  return (
    <div>
        {/* check if a token is already stored, if not, redirect to 42 login page */}
        {useStoreToken()}
      <ParticleBackground/>
      <div className="center">
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
        <Footer/>
    </div>
  );
}
