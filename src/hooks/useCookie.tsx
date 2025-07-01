import { useState, useEffect } from 'react';

const useCookie = (cookieName: string, initialState: boolean) => {
  const [isCookieSet, setIsCookieSet] = useState(initialState);

  useEffect(() => {
    setIsCookieSet(checkCookies(cookieName));
    // eslint-disable-next-line
  }, []);

  const getCookieValue = (cookieName: string) => {
    const allStoredCookies = document.cookie.split('; ');
    const foundCookie = allStoredCookies.filter((cookie) =>
      cookie.split('=').includes(cookieName),
    )[0];
    return foundCookie;
  };

  const checkCookies = (cookieName: string) => {
    return getCookieValue(cookieName) ? true : false;
  };

  const setCookie = (cookieValue: string, expirationDays: number) => {
    const date = new Date();
    date.setTime(date.getTime() + expirationDays * 24 * 60 * 60 * 1000);
    document.cookie = `${cookieName}=${cookieValue};expires=${date.toUTCString()};path=/`;
    setIsCookieSet(true);
  };

  return { isCookieSet, setCookie, getCookieValue };
};

export default useCookie;
