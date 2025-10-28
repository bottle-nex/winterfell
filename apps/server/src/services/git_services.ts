import axios from 'axios';
import { FileContent } from '../types/github_worker_queue_types';
import { Octokit, RestEndpointMethodTypes } from '@octokit/rest';

export async function get_s3_codebase(contractId: string): Promise<FileContent> {
    const response = await axios.get(
        `${process.env.SERVER_CLOUDFRONT_DOMAIN}/${contractId}/resource`,
    );
    return response.data;
}

export async function get_github_owner(github_access_token: string) {
    const ocktokit = new Octokit({ auth: github_access_token });
    const response: RestEndpointMethodTypes['users']['getAuthenticated']['response'] =
        await ocktokit.users.getAuthenticated();

    const owner = response.data.login;
    return owner;
}
