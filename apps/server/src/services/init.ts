import ObjectStore from '../class/object_store';
import ContentGenerator from '../controllers/gen/content_generator';
import Rules from '../generator/tools/rules';
import RazorpayGateway from '../payments/razorpay';
import { GithubWorkerQueue } from '../queue/github_worker_queue';
import ServerToOrchestratorQueue from '../queue/queue.redis';

export let contentGenerator: ContentGenerator;
export let objectStore: ObjectStore;
export let razorpay: RazorpayGateway;
export let server_orchestrator_queue: ServerToOrchestratorQueue;
export let github_worker_queue: GithubWorkerQueue;
export let rules: Rules;

export default function init_services() {
    contentGenerator = new ContentGenerator();
    objectStore = new ObjectStore();
    razorpay = new RazorpayGateway();
    server_orchestrator_queue = new ServerToOrchestratorQueue('server-to-orchestrator');
    github_worker_queue = new GithubWorkerQueue('github-push');
    rules = new Rules('../generator/rules');
}
