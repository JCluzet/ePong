import React from "react";
import { accountService } from "../hooks/account_service";

export default function TwofaSettings() {
  // state
  const [checked, setChecked] = React.useState(accountService.isTwoFa());

  // comportements
  const handleTfaChange = (checked) => {
    setChecked(checked);
    accountService.ModifyTfa(checked);
  };

  // affichage

  return (
    <div className="change-avatar-container">
      <div className="tfa-text">Two Factor Auth</div>
      <br />

      <input
        id="checkbox"
        className="switch-input"
        type="checkbox"
        defaultChecked={checked}
        onChange={() => handleTfaChange(!checked)}
      />
      <label htmlFor="checkbox" className="switch"></label>
    </div>
  );
}
