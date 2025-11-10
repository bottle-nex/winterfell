import { CoreV1Api } from "@kubernetes/client-node";
import podTemplate from "./templates.kubernetes";
import { kubernetes_services } from "..";
import { env } from "../configs/configs.env";

export default class KubernetesManager {
  private core_api: CoreV1Api = kubernetes_services.kubernetes_client.core_api;

  public async create_pod(
    pod_name: string,
    job_id: string,
    contract_id: string,
    user_id: string,
    command: string,
    code_snapshot_url: string,
  ) {
    try {
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
      console.log("response is : ", response);
    } catch (err) {
      console.error("error in creating pod : ", err);
    }
  }

  public async delete_pod(pod_name: string): Promise<{ success: boolean }> {
    try {
      const response = await this.core_api.deleteNamespacedPod({
        namespace: env.KUBERNETES_NAMESPACE,
        name: pod_name,
      });
      return { success: true };
    } catch (err) {
      return { success: false };
      console.error("error in deleting the pod : ", err);
    }
  }
}
