import * as k8s from '@kubernetes/client-node';
import { stderr } from 'process';
import { Writable } from 'stream';

export default class KubernetesConfig {
   private static instance: KubernetesConfig;
   public kc: k8s.KubeConfig;
   public core_api: k8s.CoreV1Api;
   public apps_api: k8s.AppsV1Api;
   public exec: k8s.Exec;
   public log: k8s.Log;

   private constructor() {
      this.kc = new k8s.KubeConfig();
      this.kc.loadFromDefault();
      this.core_api = this.kc.makeApiClient(k8s.CoreV1Api);
      this.apps_api = this.kc.makeApiClient(k8s.AppsV1Api);
      this.exec = new k8s.Exec(this.kc);
      this.log = new k8s.Log(this.kc);
   }

   public static get_instance() {
      if (!KubernetesConfig.instance) {
         KubernetesConfig.instance = new KubernetesConfig();
      }

      return KubernetesConfig.instance;
   }

   public async exec_command_in_pod(params: {
      namespace: string; // it is the container for all resources that the pod needs (not commands)
      pod_name: string;
      command: string[];
      container_name?: string;
   }): Promise<{ stdout: string; stderr: string }> {
      const { namespace, pod_name, command, container_name } = params;

      return new Promise((resolve, reject) => {
         let stdout_data = '';
         let stderr_data = '';

         const stdout_stream = new Writable({
            write(chunk, _encoding, callback) {
               stdout_data += chunk.toString();
               callback();
            },
         });

         const stderr_stream = new Writable({
            write(chunk, _encoding, callback) {
               stderr_data += chunk.toString();
               callback();
            },
         });

         this.exec.exec(
            namespace,
            pod_name,
            container_name!,
            command,
            stdout_stream,
            stderr_stream,
            null,
            false,

            (status: any) => {
               if (status.state === 'Success') {
                  resolve({
                     stdout: stdout_data,
                     stderr: stderr_data,
                  });
               } else {
                  reject(new Error(stderr_data));
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
      onError: (chunk: string) => void;
   }) {
      const { namespace, pod_name, container_name, onData, onError } = params;

      return new Promise<void>((resolve, reject) => {
         const stdout_stream = new Writable({
            write(chunk, _encoding, callback) {
               onData(chunk.toString());
               callback();
            },
         });

         const logOptions: k8s.LogOptions = {
            follow: true,
            tailLines: 100,
         };

         this.log
            .log(namespace, pod_name, container_name || '', stdout_stream, logOptions)
            .then(() => resolve())
            .catch((err: any) => reject(err));
      });
   }
}

export const k8s_config = KubernetesConfig.get_instance();
