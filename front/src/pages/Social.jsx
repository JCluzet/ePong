import Header from "../components/Header";
import ProfileCard from "../components/ProfileCard";
import FriendList from "../components/FriendList";

export default function Social() {
  // state

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