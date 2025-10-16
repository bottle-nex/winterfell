import { env } from "../configs/env.config";
import { k8s_config } from "../configs/kubernetes.config";
import { CreatePodRequest, PodInfo } from "../types/k8_types";
import PodTemplate from "../utils/pod-templates";

export default class PodService {
  private namespace: string = env.ORCHESTRATOR_K8_NAMESPACE;

  public async create_pod(req: CreatePodRequest) {
    try {
      const pod_template = PodTemplate.getAnchorPodTemplate(
        req.userId,
        req.sessionId,
        req.projectName,
      );

      console.log("creaiting pod for : ", req.userId);

      const response = await k8s_config.core_api.createNamespacedPod({
        namespace: this.namespace,
        body: pod_template,
      });

      const pod_info: PodInfo = {
        podName: response.metadata?.name!,
        userId: req.userId,
        sessionId: req.sessionId,
        status: "pending",
        createdAt: new Date(),
        namespace: this.namespace,
      };
    } catch (err) {
      console.log("error creating pod : ", err);
      throw err;
    }
  }
}
