const helpResponse = `
AVAILABLE COMMANDS:
clear              Clear the terminal
--help             Show available commands
--commands         Show winterfell commands
--platform         Show platform details
--hotkeys          Show hot keys/ shortcuts
`;

const hotKeysResponse = `
HOT KEYS:
Ctrl/ Cmd + S          Switch Terminal Tabs
Ctrl/ Cmd + K          Toggle shell
`;

const platformResponse = `
PLATFORM DETAILS:
portal              Winterfell
version             1.0.0
shell               winterfell
`;

const commandsResponse = `
SHELL COMMANDS:
winterfell build                to build the contract
winterfell test                 to run the test file


PREMIUM(+) SHELL COMMANDS:
winterfell deploy --devnet      to deploy the contract on devnet
winterfell deploy --mainnet     to deploy the contract on mainnet
`;

const winterfellBuildResponse = ``;

export enum COMMAND {
    CLEAR = 'clear',
    HELP = '--help',
    HOT_KEYS = '--hotkeys',
    PLATFORM = '--platform',
    COMMANDS = '--commands',
    WINTERFELL_BUILD = 'winterfell build',
    WINTERFELL_TEST = 'winterfell test',
    WINTERFELL_DEPLOY_DEVNET = 'winterfell deploy --devnet',
    WINTERFELL_DEPLOY_MAINNET = 'winterfell deploy --mainnet',
}

export const CommandResponse: Record<COMMAND, string> = {
    [COMMAND.CLEAR]: 'no clear action',
    [COMMAND.HELP]: helpResponse,
    [COMMAND.HOT_KEYS]: hotKeysResponse,
    [COMMAND.PLATFORM]: platformResponse,
    [COMMAND.COMMANDS]: commandsResponse,
    [COMMAND.WINTERFELL_BUILD]: `sure I'll start building your contract`,
    [COMMAND.WINTERFELL_TEST]: `sure I'll start testing you contract`,
    [COMMAND.WINTERFELL_DEPLOY_DEVNET]: `sure I'll start deploying your contract to devnet`,
    [COMMAND.WINTERFELL_DEPLOY_MAINNET]: `sure I'll start deploying you contract to mainnet`,
};
