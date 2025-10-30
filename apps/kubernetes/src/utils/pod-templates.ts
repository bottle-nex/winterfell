import { V1Pod } from '@kubernetes/client-node';

export default class PodTemplate {
   public static get_anchor_pod_template(userId: string, contractId: string, projectName?: string) {
      const podName: string = this.get_pod_name(userId, contractId);
      const template: V1Pod = {
         apiVersion: 'v1',
         kind: 'Pod',
         metadata: {
            name: podName,
            labels: {
               app: 'sharks-anchor',
               userId: userId,
               sessionId: contractId,
               type: 'development-pod',
            },
            annotations: {
               createdAt: new Date().toISOString(),
               ...(projectName && { projectName: projectName }),
            },
         },
         spec: {
            restartPolicy: 'Never',
            containers: [
               {
                  name: 'anchor-dev',
                  image: 'winterfellhub/winterfell-base:latest',
                  command: ['/bin/sh'],
                  args: ['-c', 'tail -f /dev/null'],
                  stdin: true,
                  tty: true,
                  workingDir: '/workspace',
                  env: [
                     {
                        name: 'USER_ID',
                        value: userId,
                     },
                     {
                        name: 'SESSION_ID',
                        value: contractId,
                     },
                     {
                        name: 'RUST_BACKTRACE',
                        value: '1',
                     },
                  ],
                  resources: {
                     requests: {
                        memory: '2Gi', // Increased from 1Gi
                        cpu: '1000m', // Increased from 500m (1 core)
                     },
                     limits: {
                        memory: '4Gi', // Increased from 2Gi
                        cpu: '2000m', // Increased from 1000m (2 cores)
                     },
                  },
                  volumeMounts: [
                     {
                        name: 'workspace',
                        mountPath: '/workspace',
                     },
                  ],
               },
            ],
            volumes: [
               {
                  name: 'workspace',
                  emptyDir: {},
               },
            ],
         },
      };
      return template;
   }

   public static get_pod_name(userId: string, contractId: string): string {
      let name = `anchor-pod-template-${userId}-${contractId}`.toLowerCase();
      if (name.length > 63) {
         name = name.substring(0, 63);
      }
      name = name.replace(/-+$/, '');

      if (name.length === 0) {
         throw new Error('Generated pod name is empty');
      }

      return name;
   }
}
