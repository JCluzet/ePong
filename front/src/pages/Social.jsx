import Header from "../components/Header";
import ProfileCard from "../components/ProfileCard";
// import storeProfilData from "../hooks/storeProfilData";
// import { accountService } from "../hooks/account_service";

export default function Social() {
  return (
    <div className="social-page">
      <Header />
      <br />
      <ProfileCard/>
      {/* <FriendList/> */}
    </div>
  );
}