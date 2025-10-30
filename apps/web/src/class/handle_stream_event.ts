// import { useBuilderChatStore } from '../store/code/useBuilderChatStore';
// import { useCodeEditor } from '../store/code/useCodeEditor';
// import { Message } from '../types/prisma-types';
// import {
//     FILE_STRUCTURE_TYPES,
//     FileContent,
//     PHASE_TYPES,
//     STAGE,
//     StreamEvent,
// } from '../types/stream_event_types';

// export default class StreamEventProcessor {
//     public static process(event: StreamEvent) {
//         const { parseFileStructure, deleteFile } = useCodeEditor.getState();
//         const { upsertMessage, setPhase, setCurrentFileEditing } = useBuilderChatStore.getState();

//         switch (event.type) {
//             case PHASE_TYPES.STARTING:
//                 if (event.systemMessage) {
//                     upsertMessage(event.systemMessage);
//                 }
//                 break;

//             case STAGE.CONTEXT:
//                 if ('llmMessage' in event.data) {
//                     upsertMessage(event.data.llmMessage as Message);
//                 }
//                 break;

//             case STAGE.PLANNING:
//             case STAGE.GENERATING_CODE:
//             case STAGE.BUILDING:
//             case STAGE.CREATING_FILES:
//             case STAGE.FINALIZING:
//                 if (event.systemMessage) {
//                     upsertMessage(event.systemMessage);
//                 }
//                 break;

//             case PHASE_TYPES.THINKING:
//             case PHASE_TYPES.GENERATING:
//             case PHASE_TYPES.BUILDING:
//             case PHASE_TYPES.CREATING_FILES:
//             case PHASE_TYPES.COMPLETE:
//                 setPhase(event.type);
//                 break;

//             case PHASE_TYPES.DELETING:
//                 setPhase(event.type);
//                 break;

//             case FILE_STRUCTURE_TYPES.EDITING_FILE:
//                 setPhase(event.type);
//                 if ('file' in event.data) {
//                     if ('phase' in event.data && event.data.phase === 'deleting') {
//                         deleteFile(event.data.file as string);
//                     } else {
//                         setCurrentFileEditing(event.data.file as string);
//                     }
//                 }
//                 break;

//             case PHASE_TYPES.ERROR:
//                 console.error('LLM Error:', event.data);
//                 break;

//             case STAGE.END: {
//                 let code;

//                 if ('data' in event.data && event.data.data) {
//                     code = event.data.data;
//                 } else if (Array.isArray(event.data)) {
//                     code = event.data;
//                 } else {
//                     code = event.data;
//                 }

//                 console.log('STAGE.END received, code:', code);

//                 if (code && Array.isArray(code)) {
//                     parseFileStructure(code);
//                 } else {
//                     console.error('Invalid code structure:', code);
//                 }
//                 break;
//             }

//             default:
//                 break;
//         }
//     }
// }
