import returnBack from "../assets/images/return.png";
import { useState } from "react";
import { accountService } from "../hooks/account_service";
import "../styles/two-fa.css";
import { toast } from "react-toastify";

export default function Twofa() {
  const [tfa, setTfa] = useState("");

  function HandleBack() {
    localStorage.setItem("NeedTwoFa", false);
    window.location.href = "/";
  }

  function HandleTFA() {
    if (!tfa.match(/^[0-9]+$/)) {
      toast.error("Error: Code must be only digits");
      return;
    }
    if (tfa.length !== 6 || isNaN(tfa)) {
      toast.error("Error: Code must be 6 digits");
      return;
    }
    if (tfa.length === 6) {
      const id = toast.loading("Checking code...");

      accountService.LoginWithTFA(tfa);
      setTimeout(() => {
        if (localStorage.getItem("IncorrectTfa") === "true") {
          toast.update(id, {
            render: "Error: Incorrect code",
            type: "error",
            isLoading: false,
          });
        } else {
          toast.update(id, {
            render: "All is good",
            type: "success",
            isLoading: false,
          });
          window.location.href = "/";
        }
      }, 1500);
    }
  }

  function HandleTFAChange(e) {
    setTfa(e.target.value);
  }

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
          <button className="button-2fa" onClick={HandleTFA}>
            Validate
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
