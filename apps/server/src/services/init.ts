import ObjectStore from '../class/object_store';
import ContentGenerator from '../controllers/gen/content_generator';
import RazorpayGateway from '../payments/razorpay';
import ServerToOrchestratorQueue from '../queue/loader_queue';

export let contentGenerator: ContentGenerator;
export let objectStore: ObjectStore;
export let razorpay: RazorpayGateway;
export let server_orchestrator_queue: ServerToOrchestratorQueue;

export default function init_services() {
    contentGenerator = new ContentGenerator();
    objectStore = new ObjectStore();
    razorpay = new RazorpayGateway();
    server_orchestrator_queue = new ServerToOrchestratorQueue('server-to-orchestrator');
}
