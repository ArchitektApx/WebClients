import { useMemo } from 'react';

import { c } from 'ttag';

import { InlineLinkButton } from '@proton/atoms';
import Badge from '@proton/components/components/badge/Badge';
import Icon from '@proton/components/components/icon/Icon';
import Info from '@proton/components/components/link/Info';
import StripedItem from '@proton/components/components/stripedList/StripedItem';
import { StripedList } from '@proton/components/components/stripedList/StripedList';
import clsx from '@proton/utils/clsx';

import { useDealContext } from './DealContext';

interface Props {
    isExpanded?: boolean;
    expand: () => void;
}

const DealFeatures = ({ isExpanded, expand }: Props) => {
    const { deal } = useDealContext();
    const features = useMemo(() => deal.features?.(), [deal.features]);

    if (!features?.length) {
        return null;
    }

    return (
        <div className="flex-auto w-full">
            {isExpanded && (
                <StripedList alternate="odd">
                    {features.map((feature) => (
                        <StripedItem
                            key={`${feature.name}-${feature.icon}`}
                            left={
                                !!feature.icon ? (
                                    <Icon className="color-success" name={feature.icon} size={5} />
                                ) : (
                                    <Icon className="color-success" name="checkmark" size={5} />
                                )
                            }
                        >
                            {feature.badge && <Badge type="primary">{feature.badge}</Badge>}
                            <span className={clsx(['text-left', feature.disabled && 'color-disabled'])}>
                                {feature.name}
                            </span>
                            {!!feature.tooltip && <Info buttonClass="ml-1" title={feature.tooltip} />}
                        </StripedItem>
                    ))}
                </StripedList>
            )}
            {!isExpanded && (
                <div className="w-full text-center flex">
                    <InlineLinkButton className="mx-auto offer-see-plan-features" onClick={() => expand()}>
                        <span>{c('Action').t`See plan features`}</span>
                        <Icon name="chevron-down" className="ml-2" />
                    </InlineLinkButton>
                </div>
            )}
        </div>
    );
};

export default DealFeatures;
