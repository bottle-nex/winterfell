import { ClientDocsPanel, GettingStartedSubContent, OverviewSubContent } from '../types/docs-types';
import { IconType } from 'react-icons';
import {
    HiOutlineInformationCircle,
    HiOutlineRocketLaunch,
    HiOutlineBeaker,
    HiOutlineCog6Tooth,
    HiOutlineCodeBracket,
    HiOutlinePencilSquare,
    HiOutlineWrenchScrewdriver,
    HiOutlineCloudArrowUp,
    HiOutlineArrowDownTray,
} from 'react-icons/hi2';

export interface SidebarContent {
    title: string;
    type: ClientDocsPanel;
    subSections?: {
        id: string;
        label: string;
    }[];
    icon?: IconType;
    children?: SidebarContent[];
}

export const contents: SidebarContent[] = [
    {
        title: 'Overview',
        type: ClientDocsPanel.OVERVIEW,
        subSections: [
            { id: OverviewSubContent.AI_CONTRACTS, label: 'AI Contracts' },
            { id: OverviewSubContent.SMART_EDITOR, label: 'Smart Editor' },
            { id: OverviewSubContent.ONE_CLICK_DEPLOYMENT, label: 'One Click Deployment' },
        ],
        icon: HiOutlineInformationCircle,
    },
    {
        title: 'Getting Started',
        type: ClientDocsPanel.GETTING_STARTED,
        subSections: [
            { id: GettingStartedSubContent.ROOT_WORKSPACE, label: 'Root Workspace' },
            { id: GettingStartedSubContent.PLAYGROUND_WORKSPACE, label: 'Playground Workspace' },
        ],
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
