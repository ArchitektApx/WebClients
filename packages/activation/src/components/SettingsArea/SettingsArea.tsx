import { c } from 'ttag';

import { Loader, type SettingsAreaConfig } from '@proton/components';
import SettingsParagraph from '@proton/components/containers/account/SettingsParagraph';
import SettingsSectionWide from '@proton/components/containers/account/SettingsSectionWide';
import PrivateMainSettingsArea, {
    PrivateMainSettingsAreaBase,
} from '@proton/components/containers/layout/PrivateMainSettingsArea';
import { FeatureCode, useFeature } from '@proton/features';
import type { APP_NAMES } from '@proton/shared/lib/constants';
import { BRAND_NAME, MAIL_APP_NAME } from '@proton/shared/lib/constants';

import type { EasySwitchFeatureFlag } from '../../interface';
import EasySwitchStoreProvider from '../../logic/StoreProvider';
import ReportsTable from '../ReportsTable/ReportsTable';
import GmailForwarding from './GmailForwarding';
import ProviderCards from './ProviderCards/ProviderCards';

interface Props {
    config: SettingsAreaConfig;
    app: APP_NAMES;
}

const SettingsArea = ({ config, app }: Props) => {
    const { loading } = useFeature<EasySwitchFeatureFlag>(FeatureCode.EasySwitch);

    if (loading) {
        return (
            <PrivateMainSettingsAreaBase title={config.text} description={config.description}>
                <Loader size="medium" className="py-14 text-center" />
            </PrivateMainSettingsAreaBase>
        );
    }

    return (
        <EasySwitchStoreProvider>
            <PrivateMainSettingsArea config={config}>
                <SettingsSectionWide>
                    <SettingsParagraph data-testid="SettingsArea:forwardSection">
                        {c('Info').t`Forward incoming mail from another account to your secure ${MAIL_APP_NAME} inbox.`}
                    </SettingsParagraph>
                    <GmailForwarding />
                </SettingsSectionWide>
                <SettingsSectionWide>
                    <SettingsParagraph>
                        {c('Info')
                            .t`Import your emails, calendars, and contacts from another service to ${BRAND_NAME}.`}
                    </SettingsParagraph>
                    <ProviderCards app={app} />
                </SettingsSectionWide>
                <SettingsSectionWide>
                    <ReportsTable />
                </SettingsSectionWide>
            </PrivateMainSettingsArea>
        </EasySwitchStoreProvider>
    );
};

export default SettingsArea;
