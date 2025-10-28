const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export const API_URL = BACKEND_URL + '/api/v1';
export const SIGNIN_URL = API_URL + '/sign-in';

export const CHAT_URL = API_URL + '/new';

// subscription
export const SUBSCRIPTION_URL = API_URL + '/subscription';
export const CREATE_ORDER_URL = SUBSCRIPTION_URL + '/create-order';
export const UPDATE_URL = SUBSCRIPTION_URL + '/update';
export const GET_PLAN_URL = SUBSCRIPTION_URL + '/get-plan';

export const FILES_URL = API_URL + '/files';
export const SYNC_FILES_URL = FILES_URL + '/sync';
export const RUN_COMMAND_URL = API_URL + '/contract/run-command';

export const EXPORT_CONTRACT_URL = API_URL + '/contract/export';
