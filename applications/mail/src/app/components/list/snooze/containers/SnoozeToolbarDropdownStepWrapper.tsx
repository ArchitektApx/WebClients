import { MouseEvent, useMemo } from 'react';

import { useUser } from '@proton/components/hooks';

import { useGetElementsFromIDs } from 'proton-mail/hooks/mailbox/useElements';

import useSnooze, { SNOOZE_DURATION } from '../../../../hooks/actions/useSnooze';
import SnoozeCustomTime from '../components/SnoozeCustomTime';
import SnoozeDurationSelection from '../components/SnoozeDurationSelection';

export const SnoozeToolbarDropdownStepWrapperProps = { className: 'max-w24e' };

interface Props {
    onClose: () => void;
    onLock: (lock: boolean) => void;
    selectedIDs: string[];
    displayUpsellModal: () => void;
}

const SnoozeToolbarDropdownStepWrapper = ({ onClose, onLock, selectedIDs, displayUpsellModal }: Props) => {
    const [{ hasPaidMail }] = useUser();
    const getElementsFromIDs = useGetElementsFromIDs();
    const elements = useMemo(() => getElementsFromIDs(selectedIDs), [selectedIDs]);

    const { canUnsnooze, snooze, handleCustomClick, snoozeState, unsnooze, handleClose } = useSnooze();

    const handleSnooze = (event: MouseEvent, duration: SNOOZE_DURATION, snoozeTime?: Date) => {
        event.stopPropagation();
        snooze({ elements: elements, duration, snoozeTime: snoozeTime });
        onClose();
    };

    const handleCustom = (event: MouseEvent) => {
        event.stopPropagation();
        if (hasPaidMail) {
            handleCustomClick();
            return;
        }
        onClose();
        displayUpsellModal();
    };

    const handleUnsnoozeClick = (event: MouseEvent) => {
        event.stopPropagation();
        unsnooze(elements);
        onClose();
    };

    const closeDropdown = () => {
        handleClose();
        onClose();
    };

    return (
        <>
            {snoozeState === 'snooze-selection' && (
                <SnoozeDurationSelection
                    handleUnsnoozeClick={handleUnsnoozeClick}
                    handleCustomClick={handleCustom}
                    handleSnooze={handleSnooze}
                    canUnsnooze={canUnsnooze}
                />
            )}
            {snoozeState === 'custom-snooze' && (
                <SnoozeCustomTime handleSnooze={handleSnooze} onClose={closeDropdown} onLock={onLock} />
            )}
        </>
    );
};

export default SnoozeToolbarDropdownStepWrapper;
