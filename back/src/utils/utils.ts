export function randNum(size: number): string {
  if (size === 0) return '';
  const str = '0123456789';
  let ret = '';
  for (let i = 0; i < size; ++i) ret += str.charAt(Math.floor(Math.random() * str.length));
  return ret;
}

export function randString(size: number): string {
  if (size <= 0) return '';

  const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let str = '';
  for (let i = 0; i < size; ++i) {
    str += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  return str;
}
