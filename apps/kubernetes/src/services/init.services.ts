import KubernetesClient from "../k8s/client.kubernetes";
import KubernetesManager from "../k8s/manager.kubernetes";
import RedisQueue from "../queue/queue.redis";

export default class Services {
  public kubernetes_client: KubernetesClient;
  public kubernetes_manager: KubernetesManager;
  public redis_queue: RedisQueue;

  constructor() {
    this.kubernetes_client = new KubernetesClient();
    this.kubernetes_manager = new KubernetesManager();
    this.redis_queue = new RedisQueue("socket-to-orchestrator");
  }
}
