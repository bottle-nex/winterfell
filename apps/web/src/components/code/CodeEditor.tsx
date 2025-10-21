'use client';

import { JSX, useCallback } from 'react';
import { Editor, Monaco } from '@monaco-editor/react';
import Filetree from './Filetree';
import { useCodeEditor } from '@/src/store/code/useCodeEditor';
import StatusBar from './StatusBar';

export default function CodeEditor(): JSX.Element {
    const handleEditorWillMount = useCallback((monaco: Monaco) => {
        monaco.editor.defineTheme('clean-dark', {
            base: 'vs-dark',
            inherit: true,
            rules: [
                { token: '', foreground: 'D9D9D9', background: '1d1e21' },
                { token: 'identifier', foreground: 'EAEAEA' },
                { token: 'delimiter', foreground: '9CA3AF' },
                { token: 'white', foreground: 'EAEAEA' },

                { token: 'comment', foreground: '7D8590', fontStyle: 'italic' },
                { token: 'comment.doc', foreground: '7D8590', fontStyle: 'italic' },

                { token: 'keyword', foreground: '82AAFF', fontStyle: 'bold' },
                { token: 'keyword.control', foreground: '82AAFF' },
                { token: 'keyword.operator', foreground: 'F78C6C' },
                { token: 'storage', foreground: '82AAFF', fontStyle: 'bold' },
                { token: 'modifier', foreground: '7B9EFF' },

                { token: 'variable', foreground: 'D9D9D9' },
                { token: 'variable.predefined', foreground: 'FFB86C' },
                { token: 'variable.parameter', foreground: 'B2B2B2' },

                { token: 'function', foreground: '7DF9FF' },
                { token: 'function.name', foreground: '80CFFF' },
                { token: 'function.call', foreground: '80CFFF' },
                { token: 'support.function', foreground: '7DF9FF' },

                { token: 'type.identifier', foreground: 'A5D6FF' },
                { token: 'type', foreground: 'B3E5FC' },
                { token: 'class.name', foreground: 'B388FF', fontStyle: 'bold' },
                { token: 'interface.name', foreground: '8BE9FD' },
                { token: 'namespace', foreground: 'B39DDB' },

                { token: 'string', foreground: 'C3E88D' },
                { token: 'string.key.json', foreground: 'FFCB6B' },
                { token: 'string.value.json', foreground: 'C3E88D' },
                { token: 'string.template', foreground: 'F1FA8C' },
                { token: 'string.escape', foreground: 'FFD580' },

                { token: 'number', foreground: 'F78C6C' },
                { token: 'constant.numeric', foreground: 'F78C6C' },
                { token: 'constant.language.boolean', foreground: 'FF5370' },
                { token: 'constant.language.null', foreground: 'FF5370' },
                { token: 'constant', foreground: 'FFCB6B' },

                { token: 'operator', foreground: 'F78C6C' },
                { token: 'delimiter.bracket', foreground: 'AAB2BF' },
                { token: 'delimiter.parenthesis', foreground: 'AAB2BF' },
                { token: 'delimiter.square', foreground: 'AAB2BF' },
                { token: 'delimiter.curly', foreground: 'AAB2BF' },

                { token: 'tag', foreground: 'FF5370' },
                { token: 'tag.name', foreground: 'FF6E6E' },
                { token: 'meta.tag', foreground: 'FF6E6E' },
                { token: 'attribute.name', foreground: 'FFB86C' },
                { token: 'attribute.value', foreground: 'C3E88D' },

                { token: 'key', foreground: 'FFCB6B' },
                { token: 'property.name', foreground: 'FFCB6B' },

                { token: 'support.type.property-name', foreground: 'B4E1FF' },
                { token: 'support.constant.color', foreground: 'F78C6C' },
                { token: 'entity.name.tag.css', foreground: '82AAFF' },
                { token: 'keyword.other.unit', foreground: 'FFCB6B' },

                { token: 'invalid', foreground: 'FFFFFF', background: 'FF5555' },
                { token: 'error', foreground: 'FF5555' },
                { token: 'warning', foreground: 'F1FA8C' },
            ],
            colors: {
                'editor.background': '#1d1e21',
                'editor.foreground': '#EAEAEA',
                'editorCursor.foreground': '#FFFFFF',
                'editor.lineHighlightBackground': '#2A2B2E',
                'editorLineNumber.foreground': '#56575A',
                'editorLineNumber.activeForeground': '#B0B0B0',
                'editor.selectionBackground': '#3E4452',
                'editor.inactiveSelectionBackground': '#2F3033',
                'editorIndentGuide.background': '#2A2B2D',
                'editorIndentGuide.activeBackground': '#4B4B4B',
                'editorGutter.background': '#1d1e21',
                'editorWhitespace.foreground': '#2F3236',
                'scrollbarSlider.background': '#2F3033',
                'scrollbarSlider.hoverBackground': '#3A3B3F',
                'scrollbarSlider.activeBackground': '#4A4B4F',
            },
        });
    }, []);

    const { currentCode } = useCodeEditor();
    return (
        <div className="flex min-h-0 h-full">
            <Filetree />
            <Editor
                height="100%"
                language={'rust'}
                beforeMount={handleEditorWillMount}
                theme="clean-dark"
                options={{
                    readOnly: true,
                }}
                value={currentCode}
            />
            <StatusBar />
        </div>
    );
}
