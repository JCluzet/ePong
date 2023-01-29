import { useEffect } from "react";
import Header from "../components/Header";
import "../styles/home.css";
import storeProfilData from "../hooks/storeProfilData";
import { accountService } from "../hooks/account_service";

export default function Home() {
  useEffect(() => {}, []);

  async function updateProfil() {
    await storeProfilData(
      accountService.userToken(),
      accountService.userLogin(),
      null
    );
  }
  updateProfil();

  const SocialClick = () => {
    window.location.href = "/social";
  };
  const GameClick = () => {
    window.location.href = "/play";
  };

  const ChatClick = () => {
    window.location.href = "/social/chat";
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
        </div>

        <div className="social-container">
          <button className="button" onClick={SocialClick}>
            <div className="text-social">SOCIAL</div>
          </button>
        </div>

        <div className="chat-container">
          <button className="button" onClick={ChatClick}>
            <div className="text-social">CHAT</div>
          </button>
        </div>
      </div>
    </div>
  );
}
