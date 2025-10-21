import ObjectStore from '../class/object_store';
import ContentGenerator from '../controllers/gen/content_generator';
import RazorpayGateway from '../payments/razorpay';

export let contentGenerator: ContentGenerator;
export let objectStore: ObjectStore;
export let razorpay: RazorpayGateway;

export default function init_services() {
    contentGenerator = new ContentGenerator();
    objectStore = new ObjectStore();
    razorpay = new RazorpayGateway();
}
