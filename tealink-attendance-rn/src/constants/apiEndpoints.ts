export type APIEndpoint = 'WORKER_AUTH' | 'PLUCKED_QUANTITY' | 'PLUCKED_QUANTITY_LOCATION' | 'UPDATE_WORKER_IMAGE' | 'NON_PLUCKING_AUTH';

const apiEndpoints = {
    WORKER_AUTH: '/app/log-worker-authentication.json',
    NON_PLUCKING_AUTH: '/app/log-worker-nonplucking.json',
    PLUCKED_QUANTITY: '/app/log-worker-plucking.json',
    PLUCKED_QUANTITY_LOCATION: '/app/log-plucking-location.json',
    UPDATE_WORKER_IMAGE: '/app/upload-image.json',
};

export default apiEndpoints;
