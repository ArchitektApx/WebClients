import { useUser } from '@proton/account/user/hooks';
import useConfig from '@proton/components/hooks/useConfig';
import useLastSubscriptionEnd from '@proton/components/hooks/useLastSubscriptionEnd';

import useOfferFlags from '../../hooks/useOfferFlags';
import type { Operation } from '../../interface';
import config from './configuration';
import getIsEligible from './eligibility';

const useOffer = (): Operation => {
    const [user, loadingUser] = useUser();
    const protonConfig = useConfig();
    const [lastSubscriptionEnd, lastSubscriptionEndLoading] = useLastSubscriptionEnd();
    const { isActive, loading: flagsLoading } = useOfferFlags(config);
    const isLoading = flagsLoading || loadingUser || lastSubscriptionEndLoading;
    const isEligible = getIsEligible({ user, protonConfig, lastSubscriptionEnd });
    const isValid = isEligible && isActive;

    return { isValid, config, isLoading, isEligible };
};

export default useOffer;
