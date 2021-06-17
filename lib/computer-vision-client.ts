import { ComputerVisionClient } from '@azure/cognitiveservices-computervision';
import { ApiKeyCredentials } from '@azure/ms-rest-js';

const key = process.env.API_KEY;
const endpoint = process.env.API_ENDPOINT;

if (!key || !endpoint) {
  throw new Error('You must specify a key & endpoint');
}

const computerVisionClient = new ComputerVisionClient(new ApiKeyCredentials({ inHeader: { 'Ocp-Apim-Subscription-Key': key } }), endpoint);

export default computerVisionClient;
