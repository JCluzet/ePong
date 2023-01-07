import "../styles/firstconnexion.css"
import EditProfil from "./EditProfil";

export default function FirstConnexion() {
    // state
  
    // comportements
  
    // affichage
  
    return (
          <div className="container_firstconnexion">
            <h1>Welcome to PONG 🏓</h1>
            <div className="firstconnexion_text">
               Choose your avatar or/and username,
               <br/>
               You can change them later in your profile.
            </div>
                <EditProfil firstlogin="true"/>
          </div>
    );
  }
  