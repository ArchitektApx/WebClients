import { useEffect } from 'react';
import { setCookie, getCookie } from 'proton-shared/lib/helpers/cookies';
import { getSecondLevelDomain } from 'proton-shared/lib/helpers/url';

import { useUser } from './useUser';

const COOKIE_NAME = 'is-paid-user';

const today = new Date();
const lastDayOfTheYear = new Date(today.getFullYear(), 11, 31, 23, 59, 59);
const cookieDomain = `.${getSecondLevelDomain()}`;

const usePaidCookie = () => {
    const [user] = useUser();

    useEffect(() => {
        if (user?.isPaid && getCookie(COOKIE_NAME) !== '1') {
            setCookie({
                cookieName: COOKIE_NAME,
                cookieValue: '1',
                cookieDomain,
                expirationDate: lastDayOfTheYear.toUTCString(),
                path: '/',
            });
        }
    }, [user]);
};

export default usePaidCookie;
