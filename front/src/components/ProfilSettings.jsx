import { accountService } from "../hooks/account_service";
import React from "react";
import returnBack from "../assets/images/return.png";
import "../styles/input-file.css";
import "../styles/profilSettingsButton.css";
import EditProfil from "./EditProfil";
import TwofaSettings from "./TwofaSettings";

export default function ProfilSettings() {
  const [profilEditing, setProfilEditing] = React.useState(false);
  const [menuSettings, setMenuSettings] = React.useState(true);
  const [tfaEditing, setTfaEditing] = React.useState(false);

  const boolTfaEditing = () => {
    if (tfaEditing === false) {
      setTfaEditing(true);
      setMenuSettings(false);
    } else {
      setTfaEditing(false);
      setMenuSettings(true);
    }
  };

  const boolProfilEditing = () => {
    if (profilEditing === false) {
      setProfilEditing(true);
      setMenuSettings(false);
    } else {
      setProfilEditing(false);
      setMenuSettings(true);
    }
  };
  return (
    <div>
      {menuSettings && (
        <div className="settings-profil">
          <button className="button" onClick={boolProfilEditing}>
            <div className="text-logout">CHANGE PROFIL</div>
          </button>
          <button className="button" onClick={boolTfaEditing}>
            <div className="text-logout">TWO FACTOR AUTH</div>
          </button>
          <button className="button" onClick={accountService.logout}>
            <div className="text-logout">LOGOUT</div>
          </button>
        </div>
      )}

      {profilEditing && (
        <div>
          <EditProfil firstlogin="false" />
          <img
            className="return-arrow"
            src={returnBack}
            alt="return"
            onClick={boolProfilEditing}
          />
        </div>
      )}

      {tfaEditing && (
        <div>
          <TwofaSettings />
          <img
            className="return-arrow"
            src={returnBack}
            alt="return"
            onClick={boolTfaEditing}
          />
        </div>
      )}
    </div>
  );
}
