import { FileNode, NODE } from '../types/prisma-types';
import { promises as fs } from 'fs';
import * as path from 'path';

export async function writeFileTree(nodes: FileNode[], rootPath: string) {
   for (const node of nodes) {
      const fullPath = path.join(rootPath, node.name);

      if (node.type === NODE.FOLDER) {
         await fs.mkdir(fullPath, { recursive: true });

         if (node.children && node.children.length > 0) {
            await writeFileTree(node.children, fullPath);
         }
      } else if (node.type === NODE.FILE) {
         await fs.writeFile(fullPath, node.content || '', 'utf8');
      }
   }
}
