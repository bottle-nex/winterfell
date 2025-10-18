<<<<<<< HEAD
import { ConfigurationOptions, V1Pod } from '@kubernetes/client-node';

export default class PodTemplate {
   public static getAnchorPodTemplate(userId: string, sessionId: string, projectName?: string) {
      const podName: string = this.get_pod_template(userId, sessionId);
=======
import { V1Pod } from '@kubernetes/client-node';

export default class PodTemplate {
   public static get_anchor_pod_template(userId: string, sessionId: string, projectName?: string) {
      const podName: string = this.get_pod_name(userId, sessionId);
>>>>>>> v2
      const template: V1Pod = {
         apiVersion: 'v1',
         kind: 'Pod',
         metadata: {
            name: podName,
            labels: {
               app: 'sharks-anchor',
               userId: userId,
               sessionId: sessionId,
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
<<<<<<< HEAD
                  image: 'anjan-figure-out-image-name',
                  command: ['/bin/bash'],
=======
                  image: 'nginx',
                  command: ['/bin/sh'],
>>>>>>> v2
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
                        value: sessionId,
                     },
                     {
                        name: 'RUST_BACKTRACE',
                        value: '1',
                     },
                  ],
                  resources: {
                     requests: {
                        memory: '1Gi',
                        cpu: '500m',
                     },
                     limits: {
                        memory: '2Gi',
                        cpu: '1000m',
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

<<<<<<< HEAD
   private static get_pod_template(userId: string, sessionId: string) {
=======
   public static get_pod_name(userId: string, sessionId: string) {
>>>>>>> v2
      return `anchor-pod-template-${userId}-${sessionId}`.toLowerCase().substring(0, 63);
   }
}
