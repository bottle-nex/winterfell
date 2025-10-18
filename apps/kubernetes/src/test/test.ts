import { FileNode, NODE } from "../types/prisma-types";

export const fileTree: FileNode[] = [
    {
        id: 'root',
        name: 'my-anchor-project',
        type: NODE.FOLDER,
        children: [
            {
                id: 'programs',
                name: 'programs',
                type: NODE.FOLDER,
                children: [
                    {
                        id: 'my_program',
                        name: 'my_program',
                        type: NODE.FOLDER,
                        children: [
                            {
                                id: 'src',
                                name: 'src',
                                type: NODE.FOLDER,
                                children: [
                                    {
                                        id: 'lib_rs',
                                        name: 'lib.rs',
                                        type: NODE.FILE,
                                        content: 'lib_rs',
                                    },
                                ],
                            },
                            {
                                id: 'cargo_toml',
                                name: 'Cargo.toml',
                                type: NODE.FILE,
                                content: 'cargo_toml',
                            },
                        ],
                    },
                ],
            },
            {
                id: 'tests',
                name: 'tests',
                type: NODE.FOLDER,
                children: [
                    {
                        id: 'my_program_test',
                        name: 'my_program.ts',
                        type: NODE.FILE,
                        content: 'my_program_ts',
                    },
                ],
            },
            {
                id: 'anchor_toml',
                name: 'Anchor.toml',
                type: NODE.FILE,
                content: 'anchor_toml',
            },
        ],
    },
]

