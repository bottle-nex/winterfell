interface Line {
    type: 'command' | 'output';
    text: string;
}

interface TerminalTab {
    id: string;
    name: string;
    logs: Line[];
    input: string;
}
