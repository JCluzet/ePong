import Header from "../components/Header";
import ProfileCard from "../components/ProfileCard";
import FriendList from "../components/FriendList";
// import storeProfilData from "../hooks/storeProfilData";
// import { accountService } from "../hooks/account_service";

export default function Social() {
  // state
  // async function updateProfil() {
  //   await storeProfilData(accountService.userToken(), accountService.userLogin(), null);
  // }
  // updateProfil();
  // comportements
  const ChatClick = () => {
    window.location.href = "/social/chat";
  };
  // affichage
  return (
    <div className="social-page">
      <Header />
      <br />
      <ProfileCard/>
      <FriendList/>
      <button className="button" onClick={ChatClick}> 
         <div className="text-social">Chat</div>
      </button> 
    </div>
  );  
}