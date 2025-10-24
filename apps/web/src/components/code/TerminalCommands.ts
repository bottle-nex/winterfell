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
WINTERFELL SHELL COMMANDS:
winterfell build                to build the contract
winterfell test                 to run the test file


PREMIUM FEATURES:
winterfell deploy --devnet      to deploy the contract on devnet
winterfell deploy --mainnet     to deploy the contract on mainnet
`;

export enum COMMAND {
    CLEAR = 'clear',
    HELP = '--help',
    HOT_KEYS = '--hotkeys',
    PLATFORM = '--platform',
    COMMANDS = '--commands',
}

export const CommandResponse: Record<COMMAND, string> = {
    [COMMAND.CLEAR]: 'no clear action',
    [COMMAND.HELP]: helpResponse,
    [COMMAND.HOT_KEYS]: hotKeysResponse,
    [COMMAND.PLATFORM]: platformResponse,
    [COMMAND.COMMANDS]: commandsResponse,
};
