import { EUser } from './users/interfaces/user.entity';

export const JwtConstants = {
  secret: 'secretjwt',
};

export const API_UID = process.env.INTRA_UID;
export const API_SECRET = process.env.INTRA_SECRET;
export const HOST_NAME = 'http://localhost';

export const APP_URL = HOST_NAME + ':3000';
export const API_URL = HOST_NAME + ':5001';

export const INTRA_API_URL = 'https://api.intra.42.fr';
export const APP_LOGIN_REDIRECT = APP_URL;
export const API_AVATAR_GET_URL = API_URL + '/users/avatars';
export const TWOFA_LENGTH = 6;
export const TWOFA_SALTS = 2;

export const USERNAME_MAX_LENGTH = 15;
export const CHANNELNAME_MAX_LENGTH = 20;
export const PASSWORD_MAX_LENGTH = 20;
export const TIMESTAMP_MAX_LENGTH = 80;
export const MESSAGE_MAX_LENGTH = 512;

export const test_user: EUser[] = [
  {
    id: 1,
    login: 'jdamoise',
    role: 'admin',
    avatarUrl: 'https://cdn.intra.42.fr/users/905c27be11c4773dad9ee9ec776fa673/medium_jdamoise.jpg',
    nbWins: 0,
    nbLoses: 0,
    isTwoFa: false,
  },
  {
    id: 2,
    login: 'bmaudet',
    role: 'admin',
    avatarUrl: '',
    nbWins: 0,
    nbLoses: 0,
    isTwoFa: false,
  },
  {
    id: 3,
    login: 'jcluzet',
    role: 'admin',
    avatarUrl: '',
    nbWins: 0,
    nbLoses: 0,
    isTwoFa: false,
  },
  {
    id: 4,
    login: 'tkomaris',
    role: 'admin',
    avatarUrl: '',
    nbWins: 0,
    nbLoses: 0,
    isTwoFa: false,
  },
  {
    id: 5,
    login: 'mwane',
    role: 'admin',
    avatarUrl: '',
    nbWins: 0,
    nbLoses: 0,
    isTwoFa: false,
  },
];
