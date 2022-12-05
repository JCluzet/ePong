import { useSearchParams } from "react-router-dom";
import { accountService } from "./account_service";

// import * as SecureStore from 'expo-secure-store';

export default function useStoreToken() {
  const [searchParams] = useSearchParams();
  const code = searchParams.get("code");
  console.log(code);
  // if code is present in url, store it in localStorage using accountService
  if (code) {
    accountService.saveToken(code);
    // redirect to dashboard
    // window.location.href = "/dashboard";
  }
  // if there is no code in url, check if there is a token in localStorage
  // if there is no token in localStorage, redirect to login
  if (accountService.isLogged()) {
    // window.location.href = "/dashboard";
    // if query contain error parameter, redirect to login
  }
  if (searchParams.get("error")) {
    alert("You decline the access to your account, please try again");
    window.location.href = "/";
  }
}
