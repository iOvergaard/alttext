import { ComputerVisionClient } from '@azure/cognitiveservices-computervision';
import { DescribeImageResponse } from '@azure/cognitiveservices-computervision/esm/models';
import { ApiKeyCredentials, HttpRequestBody } from '@azure/ms-rest-js';

import { ImageCaption } from './models/image-caption';

const key = process.env.API_KEY;
const endpoint = process.env.API_ENDPOINT;

if (!key || !endpoint) {
  throw new Error('You must specify a key & endpoint');
}

const computerVisionClient = new ComputerVisionClient(new ApiKeyCredentials({ inHeader: { 'Ocp-Apim-Subscription-Key': key } }), endpoint);

export async function imageToText(describeURL: string): Promise<ImageCaption> {
  const describeImage = await computerVisionClient.describeImage(describeURL);
  return extractCaption(describeImage);
}

export async function imageToTextBinary(image: HttpRequestBody): Promise<ImageCaption> {
  const describeImage = await computerVisionClient.describeImageInStream(image);
  return extractCaption(describeImage);
}

function extractCaption(describeImage: DescribeImageResponse) {
  if (!describeImage) {
    throw new Error('Could not contact Azure API');
  }

  const caption = describeImage.captions?.[0];

  if (!caption) {
    throw new Error('Could not find a caption');
  }

  console.log(`This may be ${caption.text} (${caption.confidence?.toFixed(2)} confidence)`);
  return { caption: caption.text, confidence: caption.confidence?.toFixed(2) ?? '0.0' };
}
