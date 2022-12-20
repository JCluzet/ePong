export interface ILoginSuccess {
  login: string;
  userCreate: boolean;
  twofa: boolean;
  apiToken: string;
  expDate: Date;
}
