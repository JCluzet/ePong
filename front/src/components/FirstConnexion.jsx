import "../styles/firstconnexion.css";
import EditProfil from "./EditProfil";

export default function FirstConnexion() {
  return (
    <div className="container_firstconnexion">
      <div className="text-princ-welcome">Welcome to PONG 🏓</div>
      <div className="firstconnexion_text">
        Choose your avatar or/and username,
        <br />
        You can change them later in your profile.
      </div>
      <EditProfil firstlogin="true" />
    </div>
  );
}
