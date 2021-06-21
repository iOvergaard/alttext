import { DescribeImageResponse } from '@azure/cognitiveservices-computervision/esm/models';
import { HttpRequestBody } from '@azure/ms-rest-js';

import computerVisionClient from './computer-vision-client';
import { ImageCaptionResult } from './models/image-caption';

export async function imageToText(describeURL: string): Promise<ImageCaptionResult> {
  const describeImage = await computerVisionClient.describeImage(describeURL, { maxCandidates: 3 });
  return extractCaption(describeImage);
}

export async function imageToTextBinary(image: HttpRequestBody): Promise<ImageCaptionResult> {
  const describeImage = await computerVisionClient.describeImageInStream(image, { maxCandidates: 3 });
  return extractCaption(describeImage);
}

function extractCaption(describeImage: DescribeImageResponse): ImageCaptionResult {
  if (!describeImage) {
    throw new Error('Could not contact Azure API');
  }

  const captions = describeImage.captions || [];
  console.log('🚀 ~ file: image-to-text.ts ~ line 23 ~ extractCaption ~ describeImage', describeImage);

  return {
    captions: captions.map((caption) => ({ caption: caption.text, confidence: caption.confidence?.toFixed(2) ?? '0.0' })),
    tags: describeImage.tags || []
  };
}
