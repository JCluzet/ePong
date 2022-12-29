import { useEffect } from "react";
import Header from "../components/Header";
import { ToastContainer } from "react-toastify";
import "../styles/home.css";
// import { useSearchParams } from "react-router-dom";

export default function Home() {
  // state

  // comportements
  useEffect(() => {
    // if(localStorage.getItem("token")){
    //     window.location.href = "/";
    // }
  }, []);

  const SocialClick = () => {
    window.location.href = "/social";
  };
  const GameClick = () => {
    window.location.href = "/play";
  };

  // affichage

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
