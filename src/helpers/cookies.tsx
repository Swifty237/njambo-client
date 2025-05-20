export const getCookie = (cookieName: string) => {
  const allStoredCookies = document.cookie.split('; ');
  const foundCookie = allStoredCookies.filter((cookie) =>
    cookie.split('=').includes(cookieName),
  )[0];
  return foundCookie;
};

export const checkCookies = (cookieName: string) => {
  return getCookie(cookieName) ? true : false;
};

export const setCookie = (cookieName: string, cookieValue: string, expirationDays: number) => {
  const date = new Date();
  date.setTime(date.getTime() + expirationDays * 24 * 60 * 60 * 1000);
  document.cookie = `${cookieName}=${cookieValue};expires=${date.toUTCString()};path=/`;
};
