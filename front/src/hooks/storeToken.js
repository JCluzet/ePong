import { useSearchParams } from "react-router-dom";
import { accountService } from "./account_service";

// import * as SecureStore from 'expo-secure-store';

export default function useStoreToken() {
  const [searchParams] = useSearchParams();
  const code = searchParams.get("code");
  if (code) {
    // console.log("code : " + code);
    accountService.saveToken(code);
    // window.location.href = "/";
  }
  if (searchParams.get("error")) {
      window.location.href = "/";
      alert("You decline the access to your account, please try again");
      // sleep 1 second
    //

  }
}
