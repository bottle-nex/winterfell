import ContentGenerator from '../controllers/gen/ContentGenerator';

export let contentGenerator: ContentGenerator;

export default function init_services() {
    contentGenerator = new ContentGenerator();
}
