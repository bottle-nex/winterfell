import KubernetesConfig from '../configs/kubernetes.config';
import ServerToOrchestratorQueue from '../queue/worker_queue';
import PodService from './pod.services';

export let pod_service: PodService;
export let k8s_config: KubernetesConfig;
export let server_orchestrator_queue: ServerToOrchestratorQueue;

export function init_services() {
   k8s_config = new KubernetesConfig();
   pod_service = new PodService();
   server_orchestrator_queue = new ServerToOrchestratorQueue('server-to-orchestrator');
}
