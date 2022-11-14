export const JwtConstants = {
  secret: 'secretjwt',
};

export const API_UID = process.env.INTRA_UID;
export const API_SECRET = process.env.INTRA_SECRET;
export const HOST_NAME = 'http://localhost';

export const APP_URL = HOST_NAME + ':3000';
export const API_URL = HOST_NAME + ':5001';

export const INTRA_API_URL = 'https://api.intra.42.fr';

export const APP_LOGIN_REDIRECT = 'https://google.com';

export const TWOFA_LENGTH = 6;
