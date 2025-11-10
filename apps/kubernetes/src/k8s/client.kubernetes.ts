import { CoreApi, CoreV1Api, KubeConfig } from "@kubernetes/client-node";

export default class KubernetesClient {
  public core_api: CoreV1Api;
  public kube_config: KubeConfig;

  constructor() {
    this.kube_config = new KubeConfig();
    this.kube_config.loadFromDefault();
    this.core_api = this.kube_config.makeApiClient(CoreV1Api);
  }
}
