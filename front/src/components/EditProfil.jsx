import React from "react";
import { accountService } from "../hooks/account_service";

export default function EditProfil() {
  // state
  const [username, setUsername] = React.useState(accountService.userName());
  const [formData, setFormData] = React.useState(null);

  // comportements

  const updateProfil = (e) => {
    e.preventDefault();
    if (formData !== null) {
      accountService.ModifyAvatar(formData);
    }
    if (username !== accountService.userName()) {
      if (username.length === 0) {
        accountService.ModifyUsername(accountService.userLogin(), formData !== null);
      } else {
        accountService.ModifyUsername(username, formData !== null);
      }
    }
    // toast.success("Hello World");
  };

  const handleChange = (e) => {
    if (e.target.value.length <= 20) {
      setUsername(e.target.value);
    }
  };

  const onImageChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      let formdata = new FormData();
      formdata.append("file", event.target.files[0]);
      setFormData(formdata);
    }
  };

  // affichage
  return (
    <div>
      <form onSubmit={updateProfil}>
        <div className="change-avatar-container">
          <input
            type="text"
            placeholder="New username"
            value={username}
            onChange={handleChange}
            className="newUsername-text-area"
          />
          <div className="file-input">
            <input type="file" accept="image/*" onChange={onImageChange} />
          </div>
          <div className="button-change-container">
            <button className="button-change" type="submit">
              <div className="text-change">SAVE</div>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
