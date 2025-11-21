import { CoreV1Api } from "@kubernetes/client-node";
import podTemplate from "./template.kubernetes";
import { kubernetes_services } from "..";
import { env } from "../configs/configs.env";
import { PodServices } from "../services/pod.services";

export default class KubernetesManager {
  private core_api: CoreV1Api = kubernetes_services.kubernetes_client.core_api;

  public async create_pod(
    job_id: string,
    user_id: string,
    contract_id: string,
    command: string,
    code_snapshot_url: string,
  ) {
    try {
      const pod_name = PodServices.get_pod_name(user_id, contract_id);
      const pod_template = podTemplate({
        pod_name,
        job_id,
        contract_id,
        user_id,
        command,
        code_snapshot_url,
      });

      const response = await this.core_api.createNamespacedPod({
        namespace: env.KUBERNETES_NAMESPACE,
        body: pod_template,
      });

      console.log('pod name is: ', response.metadata?.name);
      return pod_name;

    } catch (err) {
      console.error("error in creating pod : ", err);
    }
  }

  public async delete_pod(pod_name: string): Promise<{ success: boolean }> {
    try {
      await this.core_api.deleteNamespacedPod({
        namespace: env.KUBERNETES_NAMESPACE,
        name: pod_name,
      }
      );

      return { success: true };
    } catch (err) {
      console.error("error in deleting the pod : ", err);
      return { success: false };
    }
  }

  public async get_pod_status(user_id: string, contract_id: string): Promise<{ success: boolean, pod_status?: string }> {
    try {
      const pod_name = await PodServices.get_pod_name(user_id, contract_id);
      const pod = await this.core_api.readNamespacedPod({
        namespace: env.KUBERNETES_NAMESPACE,
        name: pod_name,
      });

      const pod_status = pod.status?.phase;

      return { success: true, pod_status };
    } catch (error) {
      console.error('Failed to fetch pod status');
      return { success: false };
    }
  }

  public async wait_for_pod_running(user_id: string, contract_id: string) {
    try {
      const pod_name = PodServices.get_pod_name(user_id, contract_id);
      const pod = await this.core_api.readNamespacedPod({
        namespace: env.KUBERNETES_NAMESPACE,
        name: pod_name,
      });

      const pod_status = pod.status?.phase;
      while (pod_status != 'Running') {

      }
    } catch (error) {

    }
  }

  // private async run_command_in_pod(user_id: string, contract_id: string) {
  //   const pod_name = PodServices.get_pod_name(user_id, contract_id);

  //   try {
  //     const pod = await this.core_api.readNamespacedPod({
  //       namespace: env.KUBERNETES_NAMESPACE,
  //       name: pod_name,
  //     });
  //   } catch (err) {
      
  //   }

  // }
}
