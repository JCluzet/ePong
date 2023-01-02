import { StringifyOptions } from "querystring";

// export type User = {
//     id: string;
//     isLoggedIn: boolean;
//     avatar?: string;
//     status?: string;
//     numberWins: number;
//     numberLosses: number;
//     numberGamesPlayed: number;
//     twofa: boolean;
//     userType?: number;
// };

export type EUser = {
    id?: number;
    login: string;
    name: string;
    role: string;
    nbWins: number;
    nbLoses: number;
    isTwoFa?: boolean;
    avatarUrl: string;
    status: string;
    total_games: number;
    win_loss_ratio: number;
    userType?: number;
};

export default EUser;