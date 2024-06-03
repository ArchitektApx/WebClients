import { useFlag } from '@unleash/proxy-client-react';
import { format, fromUnixTime } from 'date-fns';
import { c } from 'ttag';

import { ButtonLike } from '@proton/atoms/Button';
import {
    Icon,
    ModalProps,
    ModalTwo,
    ModalTwoContent,
    ModalTwoFooter,
    ModalTwoHeader,
    SettingsLink,
    StripedItem,
    StripedList,
} from '@proton/components/components';
import { FeatureCode } from '@proton/components/containers/features';
import { useFeature, useSubscription } from '@proton/components/hooks';
import subscriptionEnding from '@proton/styles/assets/img/illustrations/subscription_ending.svg';

import { getReminderPageConfig } from '../b2cCancellationFlow/reminderPageConfig';
import { ReminderFlag, markRemindersAsSeen } from './cancellationReminderHelper';

const CancellationReminderModal = (props: ModalProps) => {
    const [subscription, subscriptionLoading] = useSubscription();
    const newCancellationPolicy = useFlag('ExtendCancellationProcess');
    const { feature, update } = useFeature<ReminderFlag>(FeatureCode.AutoDowngradeReminder);

    const config = getReminderPageConfig({ subscription, newCancellationPolicy });

    const markAsSeen = () => {
        if (!feature?.Value || Array.isArray(feature.Value)) {
            return;
        }

        const newValue = markRemindersAsSeen(feature.Value);
        update(newValue);
        props?.onClose?.();
    };

    if (!subscription || subscriptionLoading) {
        return;
    }

    const formattedEndDate = format(fromUnixTime(subscription.PeriodEnd), 'PP');

    return (
        <ModalTwo {...props} onClose={markAsSeen}>
            <ModalTwoHeader />
            <ModalTwoContent>
                <section className="flex justify-center mb-4">
                    <img src={subscriptionEnding} alt="" className="mb-4" />
                    <p className="m-0 text-2xl text-bold">{c('Cancellation reminder')
                        .t`Your subscription is ending soon`}</p>
                    <p className="m-0 color-weak">{c('Cancellation reminder')
                        .t`Reactivate by ${formattedEndDate} to keep these features:`}</p>
                </section>
                <StripedList className="my-0" alternate="odd">
                    {config?.features.features.map(({ icon, text }) => (
                        <StripedItem key={text} left={<Icon name={icon} className="color-primary" />}>
                            {text}
                        </StripedItem>
                    ))}
                </StripedList>
            </ModalTwoContent>
            <ModalTwoFooter>
                <ButtonLike
                    as={SettingsLink}
                    path="/dashboard#your-subscriptions"
                    target="_blank"
                    fullWidth
                    color="norm"
                    onClick={markAsSeen}
                >{c('Cancellation reminder').t`Reactivate subscription`}</ButtonLike>
            </ModalTwoFooter>
        </ModalTwo>
    );
};

export default CancellationReminderModal;
