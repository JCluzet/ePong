export const JwtConstants = {
  secret: 'secretjwt',
};

export const API_UID = process.env.INTRA_UID;
export const API_SECRET = process.env.INTRA_SECRET;
export const HOST_NAME = 'http://localhost';
export const MAIL_ADDRESS = '@student.42.fr'

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

export const ADMIN_NAME: string[] = ['jdamoise', 'bmaudet', 'jcluzet', 'tkomaris'];
