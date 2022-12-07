import { accountService } from "../hooks/account_service";

export default function ProfilSettings() {
  // state

  // comportements

  // affichage

  return (
    <div>
          <button className="button" onClick={accountService.logout}>
            <div className="text-logout">LOGOUT</div>
          </button>
    </div>
  );
}
