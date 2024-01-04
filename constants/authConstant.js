/**
 * authConstant.js
 * @description :: constants used in authentication
 */

const JWT = {
  CLIENT_SECRET:'myjwtclientsecret',
  ADMIN_SECRET:'myjwtadminsecret',
  EXPIRES_IN: 10000
};

const USER_TYPES = {
  User:1,
  Admin:2,
};

const PLATFORM = {
  CLIENT:1,
  ADMIN:2,
};

let LOGIN_ACCESS = {
  [USER_TYPES.User]:[PLATFORM.CLIENT],        
  [USER_TYPES.Admin]:[PLATFORM.ADMIN],        
};

const MAX_LOGIN_RETRY_LIMIT = 5;
const LOGIN_REACTIVE_TIME = 15;   

const SEND_LOGIN_OTP = { EMAIL:1, };
const DEFAULT_SEND_LOGIN_OTP = SEND_LOGIN_OTP.EMAIL;

const FORGOT_PASSWORD_WITH = {
  LINK: {
    email: true,
    sms: false
  },
  EXPIRE_TIME: 15
};
const NO_OF_DEVICE_ALLOWED = 5;

module.exports = {
  JWT,
  USER_TYPES,
  PLATFORM,
  MAX_LOGIN_RETRY_LIMIT,
  LOGIN_REACTIVE_TIME,
  SEND_LOGIN_OTP,
  DEFAULT_SEND_LOGIN_OTP,
  FORGOT_PASSWORD_WITH,
  NO_OF_DEVICE_ALLOWED,
  LOGIN_ACCESS,
};