const CODE_REGEX = /^[A-Za-z0-9]{6,8}$/;

export function isValidUrl(url) {
  try {
    const u = new URL(url);
    return u.protocol === 'http:' || u.protocol === 'https:';
  } catch {
    return false;
  }
}

export function isValidCode(code) {
  return CODE_REGEX.test(code);
}

const ALPHANUM = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

export function generateCode(length = 6) {
  let res = '';
  for (let i = 0; i < length; i++) {
    res += ALPHANUM[Math.floor(Math.random() * ALPHANUM.length)];
  }
  return res;
}
