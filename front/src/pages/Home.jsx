import Header from "../components/Header";
import "../styles/home.css";

export default function Home() {
  
    const SocialClick = () => {
        window.location.href = "/social";
    };
    const GameClick = () => {
        window.location.href = "/play";
    };
  
    return (
    <div>
      <Header />
      <br />
      <div className="center">
        <div className="container-home">
          <button className="button-shiny" onClick={GameClick}>
            <div className="text-play">PLAY</div>
          </button>
          <div className="social-container">
            <button className="button" onClick={SocialClick}>
              <div className="text-social">SOCIAL</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
