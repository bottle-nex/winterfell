const helpResponse = `
WINTER COMMANDS:
clear              Clear the terminal
--help             Show available commands
--commands         Show winterfell commands
--platform         Show platform details
--hotkeys          Show hot keys/ shortcuts
`;

const hotKeysResponse = `
HOT KEYS:
Ctrl + Shift + ~           Switch Terminal Tabs
Ctrl + Shift + d           Toggle shell
`;

const platformResponse = `
PLATFORM DETAILS:
portal              Winterfell
version             1.0.0
shell               winter
`;

const commandsResponse = `
SHELL COMMANDS:
winter build                to build the contract
winter test                 to run the test file


PREMIUM(+) SHELL COMMANDS:
winter deploy --devnet      to deploy the contract on devnet
winter deploy --mainnet     to deploy the contract on mainnet
`;

// instead of using winter deploy cmds like this use them like this
// winter deploy --network devnet
// winter deploy --network mainnet
// winter deploy --network <custom-network>

// const winterfellBuildResponse = ``;

export enum COMMAND {
    CLEAR = 'clear',
    HELP = '--help',
    HOT_KEYS = '--hotkeys',
    PLATFORM = '--platform',
    COMMANDS = '--commands',
    WINTERFELL_BUILD = 'winter build',
    WINTERFELL_TEST = 'winter test',
    WINTERFELL_DEPLOY_DEVNET = 'winter deploy --devnet',
    WINTERFELL_DEPLOY_MAINNET = 'winter deploy --mainnet',
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
