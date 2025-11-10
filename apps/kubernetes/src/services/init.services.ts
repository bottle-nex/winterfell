import KubernetesClient from "../k8s/client.kubernetes";
import KubernetesManager from "../k8s/manager.kubernetes";

export default class Services {
    public kubernetes_client: KubernetesClient;
    public kubernetes_manager: KubernetesManager;

    constructor() {
        this.kubernetes_client = new KubernetesClient();
        this.kubernetes_manager = new KubernetesManager();
    }
}