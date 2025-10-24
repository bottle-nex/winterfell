export function get_files(contractId: string) {
    return `${process.env.SERVER_CLOUDFRONT_DOMAIN}/${contractId}/resource`;
}