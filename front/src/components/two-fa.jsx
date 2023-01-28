import returnBack from "../assets/images/return.png";
import { useState } from "react";
import { accountService } from "../hooks/account_service";
import "../styles/two-fa.css";
import { toast } from "react-toastify";

export default function Twofa() {
  // state

  const [tfa, setTfa] = useState("");
//   const [error, setError] = useState(false);
//   const [errorType, setErrorType] = useState("");

  // comportements

  function HandleBack() {
    localStorage.setItem("NeedTwoFa", false);
    window.location.href = "/";
  }

  function HandleTFA() {
    console.log("tfa => ", tfa);
    if (!tfa.match(/^[0-9]+$/)) {
    //   setErrorType("Error: Code must be only digits");
    toast.error("Error: Code must be only digits")
      return;
    }
    if (tfa.length !== 6 || isNaN(tfa)) {
    toast.error("Error: Code must be 6 digits")
      return;
    }
    if (tfa.length === 6) {


    const id = toast.loading("Checking code...")



    //   setError(false);
    //   setErrorType("");
        accountService.LoginWithTFA(tfa);
        // wait for the response
        // setError(true);
        // setErrorType("Connexion...");
        setTimeout(() => {
            if (localStorage.getItem("IncorrectTfa") === "true") {
                // setError(true);
                toast.update(id, { render: "Error: Incorrect code", type: "error", isLoading: false });
                // setErrorType("Error: Incorrect code");
                // localStorage.setItem("IncorrectTfa", false);
            } else {
                toast.update(id, { render: "All is good", type: "success", isLoading: false });
                window.location.href = "/";
            }
        }, 1500);
        // console.log("incorrecttfa -> ", localStorage.getItem("IncorrectTfa"));
    }
    // accountService.
  }

  function HandleTFAChange(e) {
    setTfa(e.target.value);
  }

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
            onChange={HandleTFAChange}
            className="input-2fa"
            type="text"
            maxLength="6"
            placeholder="000000"
          />
          {/* {error && <div className="text-error-2fa">{errorType}</div>} */}
          <button className="button-2fa" onClick={HandleTFA}>
            Validate
          </button>
          {/* <button className="button-2fa-dev" onClick={accountService.ResetUser}>
            <div className="text-dev-2fa">(dev) RESET-USER (dev)</div>
          </button> */}
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
