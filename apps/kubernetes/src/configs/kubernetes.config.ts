import * as k8s from '@kubernetes/client-node';
import { Writable } from 'stream';

export default class KubernetesConfig {
   public kc: k8s.KubeConfig;
   public core_api: k8s.CoreV1Api;
   public apps_api: k8s.AppsV1Api;
   public exec: k8s.Exec;
   public log: k8s.Log;

   constructor() {
      this.kc = new k8s.KubeConfig();
      this.kc.loadFromDefault();
      this.core_api = this.kc.makeApiClient(k8s.CoreV1Api);
      this.apps_api = this.kc.makeApiClient(k8s.AppsV1Api);
      this.exec = new k8s.Exec(this.kc);
      this.log = new k8s.Log(this.kc);
   }

   public async exec_command_in_pod(params: {
      namespace: string;
      pod_name: string;
      container_name: string;
      command: string[];
      onData?: (chunk: string) => void;
   }): Promise<{ stdout: string; stderr: string }> {
      const { namespace, pod_name, command, container_name, onData } = params;

      if (!pod_name || !namespace) {
         throw new Error('pod name / namespace is required');
      }

      return new Promise((resolve, reject) => {
         let stdout_data = '';
         let stderr_data = '';

         const stdout_stream = new Writable({
            write(chunk, _encoding, callback) {
               const str_chunk = chunk.toString();
               stdout_data += str_chunk;
               if (onData) onData(str_chunk);
               callback();
            },
         });

         const stderr_stream = new Writable({
            write(chunk, _encoding, callback) {
               const str_chunk = chunk.toString();
               stderr_data += str_chunk;
               if (onData) onData(str_chunk);
               callback();
            },
         });

         this.exec.exec(
            namespace,
            pod_name,
            container_name,
            command,
            stdout_stream,
            stderr_stream,
            null,
            false,
            (status: any) => {
               if (status.status === 'Success') {
                  resolve({
                     stdout: stdout_data,
                     stderr: stderr_data,
                  });
               } else {
                  reject(
                     new Error(`Exec failed: ${status.message || stderr_data || 'Unknown error'}`),
                  );
               }
            },
         );
      });
   }

   public async stream_pod_logs(params: {
      namespace: string;
      pod_name: string;
      container_name?: string;
      onData: (chunk: string) => void;
      onError?: (err: any) => void;
      tailLines?: number;
   }): Promise<void> {
      const { namespace, pod_name, container_name, onData, onError, tailLines } = params;

      const logStream = new Writable({
         write(chunk, _encoding, callback) {
            onData(chunk.toString());
            callback();
         },
      });

      const logOptions: k8s.LogOptions = {
         follow: true,
         tailLines: tailLines,
         timestamps: false,
      };

      // Add container name if provided
      if (container_name) {
         (logOptions as any).container = container_name;
      }

      return new Promise<void>((resolve, reject) => {
         this.log
            .log(namespace, pod_name, container_name || '', logStream, logOptions)
            .then(() => {
               // The log method resolves when stream ends
               resolve();
            })
            .catch((err) => {
               if (onError) onError(err);
               reject(err);
            });
      });
   }
}
