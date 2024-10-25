import { usePaymentStatus } from '@proton/account/paymentStatus/hooks';
import { useUser } from '@proton/account/user/hooks';
import { usePlans, useSubscription } from '@proton/components/hooks';

import { useCurrencies } from './useCurrencies';

export const useAutomaticCurrency = () => {
    const { getPreferredCurrency } = useCurrencies();
    const [user, userLoading] = useUser();
    const [subscription, subscriptionLoading] = useSubscription();
    const [plans, plansLoading] = usePlans();
    const [status, statusLoading] = usePaymentStatus();

    const loading = userLoading || subscriptionLoading || plansLoading || statusLoading;

    const currency = getPreferredCurrency({
        user,
        plans: plans?.plans,
        status,
        subscription,
    });

    return [currency, loading] as const;
};
