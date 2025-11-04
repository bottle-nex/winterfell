import KubernetesConfig from '../configs/kubernetes.config';
import ServerToOrchestratorQueue from '../queue/worker_queue';
import JobTracker from './job_tracker';
import PodService from './pod.services';
import RedisPublisher from './redis.publisher';

export let pod_service: PodService;
export let k8s_config: KubernetesConfig;
export let server_orchestrator_queue: ServerToOrchestratorQueue;
export let publisher: RedisPublisher;
export let job_tracker: JobTracker;

export function init_services() {
   k8s_config = new KubernetesConfig();
   pod_service = new PodService();
   job_tracker = new JobTracker();
   server_orchestrator_queue = new ServerToOrchestratorQueue('server-to-orchestrator');
   publisher = new RedisPublisher();
}
