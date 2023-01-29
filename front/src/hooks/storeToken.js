import { useSearchParams } from "react-router-dom";
import { accountService } from "./account_service";

export default function useStoreToken() {
  const [searchParams] = useSearchParams();
  const code = searchParams.get("code");
  if (code) {
    localStorage.setItem("code", code);
    accountService.saveToken(code);
  }
  if (searchParams.get("error")) {
    window.location.href = "/";
    localStorage.setItem(
      "Alert",
      "You decline access to your account, please try again"
    );
  }
}
