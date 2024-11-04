import { type FC } from 'react';

import { c } from 'ttag';

import { useNotifications } from '@proton/components';
import {
    EmailVerifyModal,
    SECONDS_BEFORE_RESEND,
    getInitialCountdown,
} from '@proton/pass/components/Layout/Modal/EmailVerifyModal';
import { useRequest } from '@proton/pass/hooks/useActionRequest';
import { useCountdown } from '@proton/pass/hooks/useCountdown';
import { PassErrorCode } from '@proton/pass/lib/api/errors';
import { resendVerifyMailbox, validateMailbox } from '@proton/pass/store/actions';
import type { UserMailboxOutput } from '@proton/pass/types';
import { prop } from '@proton/pass/utils/fp/lens';
import { pipe } from '@proton/pass/utils/fp/pipe';

type Props = {
    onClose: () => void;
    onSubmit: (mailbox: UserMailboxOutput) => void;
    onRemove: (mailboxID: number) => void;
    email: string;
    mailboxID: number;
    sentAt?: number;
};

export const MailboxVerifyModal: FC<Props> = ({ onClose, email, mailboxID, onSubmit, onRemove, sentAt }) => {
    const [remaining, countdown] = useCountdown(getInitialCountdown(sentAt));
    const { createNotification } = useNotifications();

    const verify = useRequest(validateMailbox, {
        onSuccess: pipe(prop('data'), onSubmit, onClose),
        onFailure: ({ data }) => {
            if (data.code === PassErrorCode.NOT_ALLOWED) {
                onRemove(mailboxID);
                onClose();
            }
        },
    });

    const resend = useRequest(resendVerifyMailbox, {
        onSuccess: () => {
            createNotification({ text: c('Info').t`Verification code sent.`, type: 'success' });
            countdown.start(SECONDS_BEFORE_RESEND);
        },
        onFailure: () => countdown.cancel(),
    });

    return (
        <EmailVerifyModal
            email={email}
            onClose={onClose}
            onResend={() => resend.dispatch(mailboxID)}
            onSubmit={(code) => verify.dispatch({ mailboxID, code })}
            remaining={remaining}
            resendLoading={resend.loading}
            submitLoading={verify.loading}
        />
    );
};
