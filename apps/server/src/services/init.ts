import ObjectStore from '../class/object_store';
import ContentGenerator from '../controllers/gen/content_generator';

export let contentGenerator: ContentGenerator;
export let objectStore: ObjectStore;

export default function init_services() {
    contentGenerator = new ContentGenerator();
    objectStore = new ObjectStore();
}
