export interface IUserProfile {
  login: string;
  name: string;
  nbWins: number;
  nbLoses: number;
  isTwoFa: boolean;
  avatarUrl: string;
  totalGame: number;
  kda: number;
  status: string;
}
