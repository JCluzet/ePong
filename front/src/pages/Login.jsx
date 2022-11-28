import logo from "../assets/images/logo.svg";
import schoollogo from "../assets/images/schoollogo.png";
import ParticleBackground from "../particlesBackground/ParticleBackground";

export default function Login() {
    // state
    const HandleLogin = () => {
        window.location.href = "https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-1d4559a5c9eed7d22d690216c5a60ec70061478ee58ff92e422846672eed7ca6&redirect_uri=https%3A%2F%2Fpong.grademe.fr%2Fapi_callback&response_type=code";
        
        // if connexion ok => redirect to dashboard
        // else => error message
        
    };



  return (
    <div>
      <ParticleBackground/>
      <div className="center">
        <div className="container-login">
          <img src={logo} alt="logo" className="logo" />
          <div className="btn-login">
            <button className="button-85" onClick={HandleLogin}>
              <div className="btn-login-btn">
                <img width={40} src={schoollogo} alt="" />
                <div className="text-login">Login</div>
              </div>
            </button>
          </div>
        </div>
      </div>
        <footer>
            <div className="footer">
                Created with <span className="heart">❤</span> by <a href="https://github.com/jcluzet">jcluzet</a> , <a href="https://github.com/jessy-damoiseau">jessy-damoiseau</a>, <a href="https://github.com/draak-z">draak-z</a>, <a href="https://github.com/misterwayne">misterwayne</a> & <a href="https://github.com/tkomaris">tkomaris</a> 

            </div>
        </footer>
    </div>
  );
}
