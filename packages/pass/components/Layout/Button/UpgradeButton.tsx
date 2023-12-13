import { type VFC } from 'react';

import { c } from 'ttag';

import { Button, InlineLinkButton } from '@proton/atoms';
import { Icon } from '@proton/components/components';
import { useNavigateToUpgrade } from '@proton/pass/hooks/useNavigateToUpgrade';
import clsx from '@proton/utils/clsx';

type UpgradeButtonProps = {
    className?: string;
    inline?: boolean;
    label?: string;
};

export const UpgradeButton: VFC<UpgradeButtonProps> = ({ className, inline = false, label }) => {
    const navigateToUpgrade = useNavigateToUpgrade();
    const ButtonComponent = inline ? InlineLinkButton : Button;
    const buttonProps = { pill: true, shape: 'solid' } as const;

    return (
        <ButtonComponent
            className={clsx('items-center flex-nowrap shrink-0', inline ? 'inline-flex' : 'flex text-sm', className)}
            color="norm"
            onClick={navigateToUpgrade}
            {...(!inline && buttonProps)}
        >
            {label || c('Action').t`Upgrade`}
            <Icon className="ml-2" name="arrow-out-square" />
        </ButtonComponent>
    );
};
