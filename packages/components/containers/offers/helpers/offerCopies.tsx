import { ReactElement } from 'react';

import { c, msgid } from 'ttag';

import { CALENDAR_APP_NAME, CYCLE, DRIVE_APP_NAME, MAIL_APP_NAME, VPN_APP_NAME } from '@proton/shared/lib/constants';
import humanSize from '@proton/shared/lib/helpers/humanSize';
import { getNormalCycleFromCustomCycle } from '@proton/shared/lib/helpers/subscription';

export const getMonthFreeText = (n: number) => {
    return c('specialOffer: Deal').ngettext(msgid`${n} month FREE`, `${n} months FREE`, n);
};

export const getMonthsFree = (cycle: CYCLE) => {
    if (cycle === CYCLE.THIRTY) {
        return 6;
    }
    if (cycle === CYCLE.FIFTEEN) {
        return 3;
    }
    return 0;
};

const getStorageSizeFeature = (storageSize: string, vpn?: boolean) => {
    return {
        name: c('specialOffer: Deal details').t`${storageSize} total storage`,
        tooltip: vpn
            ? undefined
            : c('specialOffer: Tooltip')
                  .t`Storage space is shared across ${MAIL_APP_NAME}, ${CALENDAR_APP_NAME}, and ${DRIVE_APP_NAME}.`,
    };
};

export const getMailPlusFeatures = () => {
    return [
        getStorageSizeFeature(humanSize(15 * 1024 ** 3, undefined, undefined, 0)),
        {
            name: c('specialOffer: Deal details').t`All paid Mail and Calendar features`,
            tooltip: c('specialOffer: Tooltip')
                .t`Includes support for 1 custom email domain, 10 email addresses, 10 Hide My Email aliases, calendar sharing, and more.`,
        },
    ];
};

export const getUnlimitedFeatures = () => {
    return [
        getStorageSizeFeature(humanSize(500 * 1024 ** 3, undefined, undefined, 0)),
        {
            name: c('specialOffer: Deal details').t`All paid Mail and Calendar features`,
            tooltip: c('specialOffer: Tooltip')
                .t`Includes support for 3 custom email domains, 15 email addresses, unlimited Hide My Email aliases, calendar sharing, and more.`,
        },
        {
            name: c('specialOffer: Deal details').t`High speed VPN`,
            tooltip: c('specialOffer: Tooltip')
                .t`Access blocked content and browse privately. Includes 1700 servers in 60+ countries, highest VPN speed, 10 VPN connections, worldwide streaming services, malware and ad-blocker, and more.`,
        },
        {
            name: c('specialOffer: Deal details').t`Secure cloud storage`,
            tooltip: c('specialOffer: Tooltip')
                .t`Secure your files with encrypted cloud storage. Includes automatic sync, encrypted file sharing, and more.`,
        },
    ];
};

export const getUnlimitedDealFeatures = () => {
    return [
        getStorageSizeFeature(humanSize(500 * 1024 ** 3, undefined, undefined, 0)),
        {
            name: c('specialOffer: Deal details').t`Premium Mail and Calendar`,
            tooltip: c('specialOffer: Tooltip')
                .t`Includes support for 3 custom email domains, 15 email addresses, unlimited Hide My Email aliases, calendar sharing, and more.`,
        },
        {
            name: c('specialOffer: Deal details').t`Premium VPN`,
            tooltip: c('specialOffer: Tooltip')
                .t`Access blocked content and browse privately. Includes 1700 servers in 60+ countries, highest VPN speed, 10 VPN connections, worldwide streaming services, malware and ad-blocker, and more.`,
        },
        {
            name: c('specialOffer: Deal details').t`Premium Drive`,
            tooltip: c('specialOffer: Tooltip')
                .t`Secure your files with encrypted cloud storage. Includes automatic sync, encrypted file sharing, and more.`,
        },
    ];
};

export const getVisionaryFeatures = () => [
    // humanSize doesn't support TB and we don't want to add it yet because of "nice numbers" rounding issues.
    getStorageSizeFeature(c('specialOffer: Deal details').t`3 TB`),
    {
        name: c('specialOffer: Deal details').t`6 users`,
        tooltip: c('specialOffer: Tooltip')
            .t`Perfect for families or small teams, each can have their own inbox and aliases. Requires a custom domain.`,
    },
    {
        name: c('specialOffer: Deal details').t`Premium Mail, Calendar and Drive`,
        tooltip: c('specialOffer: Tooltip')
            .t`All our premium services with their highest limits: 100 email addresses, support for 10 custom domains, unlimited Hide My Email aliases, calendar sharing, encrypted cloud storage and file sharing, and more.`,
    },
    {
        name: c('specialOffer: Deal details').t`Premium VPN`,
        tooltip: c('specialOffer: Tooltip')
            .t`Access blocked content and browse privately. Includes 1700 servers in 60+ countries, highest VPN speed, 10 VPN connections per user, worldwide streaming services, malware and ad-blocker, and more.`,
    },
    {
        name: c('specialOffer: Deal details').t`Premium early access`,
        tooltip: c('specialOffer: Tooltip')
            .t`Receive at no extra cost the paid versions of all new privacy services we release in the future, along with early access to all future features and products.`,
    },
    {
        name: c('specialOffer: Deal details').t`Support online privacy`,
    },
];

export const getVPNPlusFeatures = () => [
    {
        name: c('specialOffer: Deal details').t`64 countries`,
    },
    {
        name: c('specialOffer: Deal details').t`Highest VPN speed`,
    },
    {
        name: c('specialOffer: Deal details').t`Secure streaming`,
        tooltip: c('specialOffer: Tooltip')
            .t`Access content on streaming services, including Netflix, Disney+, and Prime Video, from anywhere.`,
    },
];

export const getUnlimitedVPNFeatures = () => {
    return [
        {
            name: `${VPN_APP_NAME} Plus`,
        },
        {
            name: c('specialOffer: Deal details').t`Mail, Calendar, Drive`,
        },
        getStorageSizeFeature(humanSize(500 * 1024 ** 3, undefined, undefined, 0), true),
    ];
};

const { MONTHLY, YEARLY, TWO_YEARS } = CYCLE;

export const getDealBilledDescription = (cycle: CYCLE, amount: ReactElement): string | string[] | null => {
    switch (cycle) {
        case MONTHLY:
            return c('specialoffer: Offers').jt`Billed at ${amount} for the first month`;
        case YEARLY:
            return c('specialoffer: Offers').jt`Billed at ${amount} for the first year`;
        case TWO_YEARS:
            return c('specialoffer: Offers').jt`Billed at ${amount} for the first 2 years`;
        default:
            return null;
    }
};

const getDealDurationText = (cycle: CYCLE | undefined) => {
    const n = Number(cycle);

    if (n === 12) {
        return c('specialoffer: Offers').t`1 year`;
    }

    if (n === 24) {
        return c('specialoffer: Offers').t`2 years`;
    }

    return c('specialoffer: Offers').ngettext(msgid`for ${n} month`, `for ${n} months`, n);
};

export const getDealDuration = (cycle: CYCLE): ReactElement | null => {
    const freeMonths = getMonthsFree(cycle);
    return (
        <>
            {getDealDurationText(getNormalCycleFromCustomCycle(cycle))}
            {freeMonths > 0 && (
                <span className="color-success">
                    {` + `}
                    {getMonthFreeText(freeMonths)}
                </span>
            )}
        </>
    );
};

export const getRenewDescription = (
    cycle: CYCLE,
    discountedAmount: ReactElement,
    regularAmount: ReactElement,
    discount: number
): string | string[] | null => {
    switch (cycle) {
        case YEARLY:
            return c('specialoffer: Offers')
                .jt`Renews after 1 year at a discounted price of ${discountedAmount} instead of ${regularAmount} (${discount}% discount)`;
        case TWO_YEARS:
            return c('specialoffer: Offers')
                .jt`Renews after 2 years at a discounted price of ${discountedAmount} instead of ${regularAmount} (${discount}% discount)`;
        default:
            return null;
    }
};
