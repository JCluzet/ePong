import { useSearchParams } from "react-router-dom";
import { accountService } from "./account_service";

// import * as SecureStore from 'expo-secure-store';

export default function useStoreToken() {
  const [searchParams] = useSearchParams();
  const code = searchParams.get("code");
  if (code) {
    accountService.saveToken(code);
  }
  if (accountService.isLogged()) {
    window.location.href = "/dashboard";
  }
  if (searchParams.get("error")) {
      window.location.href = "/";
      // sleep 1 second
    //

      alert("You decline the access to your account, please try again");
  }
}
