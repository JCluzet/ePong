import returnBack from "../assets/images/return.png";
import { accountService } from "../hooks/account_service";
import "../styles/two-fa.css";

export default function Twofa() {
  // state
    function HandleBack() {
        localStorage.setItem("NeedTwoFa", false);
        window.location.href = "/";
    }



  // comportements

  // affichage

  return (
    <div>
      <div className="container-2fa">
        <div className="text-2fa">
          Two-Factor Auth
          <div />
          <div className="text-semi-2fa">
            Enter the code you receive by mail 📨
          </div>
          <input
            className="input-2fa"
            type="text"
            maxLength="4"
            placeholder="Code"
          />
          <button className="button-2fa">Validate</button>
          <button className="button-2fa-dev" onClick={accountService.ResetUser}>
            <div className="text-dev-2fa">
            (dev) RESET-USER (dev)

            </div>
            </button>
          <img
              className="return-arrow-tfa"
              src={returnBack}
              alt="return"
              onClick={HandleBack}
            />
        </div>
      </div>
    </div>
  );
}
