import dotenv from 'dotenv';

dotenv.config();

export const fetchBaseUrl = () => {
  const { hostname, protocol } = window.location;

  let apiUrl = '';

  if (hostname === 'localhost') {
    apiUrl = process.env.API_URL || 'http://localhost:8080/v1';
  } else {
    apiUrl = `${protocol}//api.${hostname}/v1`;
  }

  return apiUrl;
};

// TODO [FOR FE & BE Both] :: Change All Error Codes to Number even the Hexadecimal ones ie. `E210` etc.

export enum LoginErrorCodes {
  ACCESS_TOKEN_EXPIRED = '101104',
  ARCHIVED = '104007',
  BLOCKED = '104006',
  INCORRECT = '101003',
  JWT_EXPIRED = '101105',
  JWT_TOKEN_INVALID = '101101',
  JWT_TOKEN_REVOKED = '101102',
  REFRESH_TOKEN_EXPIRED = '101103',
}

export const DEFAULT_SESSION_TIMEOUT_IN_MIN = 10;

export enum EmojisUniCodes {
  CHECK = '2705',
  EYE = 'DC41',
  STAR = '2B50',
  TORCH = 'DD26',
  TOOLBOX = 'DDF0',
  HELMET = '26D1',
  GLASSES = 'DD7D',
  GLOVES = 'DDE4',
  VEST = 'DDBA',
  CANCEL = 'DEAB',
  STOP = '26D4',
  CLEAN = 'DEAF',
  RECYCLE = '267B',
  SOS = 'DD98',
  FLAG = 'DEA9',
  ELECTRIC = '26A1',
  FIRE = 'DD25',
  CAUTION = '26A0',
  HAND = '270B',
  BIN = 'DDD1',
  CROSS = '274E',
  LOCK = 'DD12',
}

export const emojis = [
  {
    value: '✅',
    name: 'Tick Mark',
  },
  {
    value: '👁',
    name: 'Inspect',
  },
  {
    value: '⭐',
    name: 'Star',
  },
  {
    value: '🔦',
    name: 'Torch',
  },
  {
    value: '🧰',
    name: 'Toolkit',
  },
  {
    value: '⛑',
    name: 'Safety Helmet',
  },
  {
    value: '🥽',
    name: 'Eye Glasses',
  },
  {
    value: '🧤',
    name: 'Hand Gloves',
  },
  {
    value: '🦺',
    name: 'Safety Vest',
  },
  {
    value: '🚫',
    name: 'Stop',
  },
  {
    value: '⛔',
    name: 'Not Allowed',
  },
  {
    value: '🚯',
    name: 'Keep Clean',
  },
  {
    value: '♻',
    name: 'Recycle',
  },
  {
    value: '🆘',
    name: 'SOS',
  },
  {
    value: '🚩',
    name: 'Important',
  },
  {
    value: '⚡',
    name: 'Electricity',
  },
  {
    value: '🔥',
    name: 'Fire',
  },
  {
    value: '⚠',
    name: 'Alert',
  },
  {
    value: '✋',
    name: 'Stop',
  },
  {
    value: '🗑',
    name: 'Waste Bin',
  },
  {
    value: '❎',
    name: 'Cross',
  },
  {
    value: '🔒',
    name: 'Protected',
  },
];
