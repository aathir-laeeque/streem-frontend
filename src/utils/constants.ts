export const fetchBaseUrl = () => {
  const { hostname, protocol } = window.location;

  let apiUrl = '';

  if (hostname === 'localhost') {
    apiUrl = `https://api.dev.streem.leucinetech.com/v1`;
  } else {
    apiUrl = `${protocol}//api.${hostname}/v1`;
  }

  return apiUrl;
};

export enum LoginErrorCodes {
  BLOCKED = 1004,
  INCORRECT = 1005,
  EXPIRED = 1007,
}

export const emojis = [
  '✅',
  '👁',
  '⭐',
  '🔦',
  '🧰',
  '⛑',
  '🥽',
  '🧤',
  '🦺',
  '🚫',
  '⛔',
  '🚯',
  '♻',
  '🆘',
  '🚩',
  '⚡',
  '🔥',
  '⚠',
  '✋',
  '🗑',
  '❎',
  '🔒',
];

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
