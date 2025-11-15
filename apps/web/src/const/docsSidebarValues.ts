import { ClientDocsPanel } from '../types/docs-types';
import { IconType } from 'react-icons';
import { 
    HiOutlineDocumentText, 
    HiOutlineInformationCircle,
    HiOutlineLightBulb,
    HiOutlineRocketLaunch,
    HiOutlineBeaker,
    HiOutlineCog6Tooth,
    HiOutlineCodeBracket,
    HiOutlinePencilSquare,
    HiOutlineWrenchScrewdriver,
    HiOutlineCloudArrowUp,
    HiOutlineArrowDownTray
} from "react-icons/hi2";

export interface SidebarContent {
    title: string;
    type: ClientDocsPanel;
    icon?: IconType;
    children?: SidebarContent[];
}

export const contents: SidebarContent[] = [
    {
        title: 'CONTENTS',
        type: ClientDocsPanel.OVERVIEW,
        icon: HiOutlineDocumentText,
    },
    {
        title: 'Overview',
        type: ClientDocsPanel.OVERVIEW,
        icon: HiOutlineInformationCircle,
    },
    {
        title: 'How it works',
        type: ClientDocsPanel.HOW_IT_WORKS,
        icon: HiOutlineLightBulb,
    },
    {
        title: 'Getting Started',
        type: ClientDocsPanel.GETTING_STARTED,
        icon: HiOutlineRocketLaunch,
    },
    {
        title: 'Sandbox env',
        type: ClientDocsPanel.SANDBOX,
        icon: HiOutlineBeaker,
        children: [
            {
                title: 'Introduction',
                type: ClientDocsPanel.SANDBOX_INTRO,
                icon: HiOutlineInformationCircle,
            },
            {
                title: 'Configuration',
                type: ClientDocsPanel.SANDBOX_CONFIGURATION,
                icon: HiOutlineCog6Tooth,
            },
            {
                title: 'Usage Examples',
                type: ClientDocsPanel.SANDBOX_USAGE,
                icon: HiOutlineCodeBracket,
            },
        ],
    },
    {
        title: 'Editing & Understanding',
        type: ClientDocsPanel.EDITING_AND_UNDERSTANDING,
        icon: HiOutlinePencilSquare,
    },
    {
        title: 'Building & Testing',
        type: ClientDocsPanel.BUILDING_AND_TESTING,
        icon: HiOutlineWrenchScrewdriver,
    },
    {
        title: 'Deployment',
        type: ClientDocsPanel.DEPLOYMENT,
        icon: HiOutlineCloudArrowUp,
    },
    {
        title: 'Exporting',
        type: ClientDocsPanel.EXPORTING,
        icon: HiOutlineArrowDownTray,
    },
];