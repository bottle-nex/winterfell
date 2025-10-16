import * as k8s from "@kubernetes/client-node";

export default class KubernetesConfig {
  private static instance: KubernetesConfig;
  public kc: k8s.KubeConfig;
  public core_api: k8s.CoreV1Api;
  public apps_api: k8s.AppsV1Api;
  public exec: k8s.Exec;

  private constructor() {
    this.kc = new k8s.KubeConfig();
    this.kc.loadFromCluster();
    this.core_api = this.kc.makeApiClient(k8s.CoreV1Api);
    this.apps_api = this.kc.makeApiClient(k8s.AppsV1Api);
    this.exec = new k8s.Exec(this.kc);
  }

  public static get_instance() {
    if (!KubernetesConfig.instance) {
      KubernetesConfig.instance = new KubernetesConfig();
    }
    return KubernetesConfig.instance;
  }
}

export const k8s_config = KubernetesConfig.get_instance();
