import Header from "../components/Header";
import ProfileCard from "../components/ProfileCard";
import FriendList from "../components/FriendList";

export default function Home() {
  // state

  // comportements

  // affichage
  return (
    <div className="social-page">
      <Header />
      <br />
      <ProfileCard/>
      <FriendList/>
    </div>
  );
}
