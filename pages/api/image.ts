import { NextApiRequest, NextApiResponse } from 'next';

import { imageToText } from '../../lib/image-to-text';
import { ImageCaption } from '../../lib/models/image-caption';

const Cors = require('cors');

/*const cors = Cors({
  origin: '*',
  methods: ['GET', 'POST', 'HEAD']
});*/

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb'
    }
  }
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<ImageCaption | string>) {
  //await runMiddleware(req, res, cors);

  let caption: ImageCaption | null = null;
  let errorMsg = '';

  if (req.method === 'GET') {
    const { describeURL = 'https://moderatorsampleimages.blob.core.windows.net/samples/sample16.png' } = req.query;

    // Analyze URL image
    console.log('Analyzing URL image to describe...', describeURL);

    try {
      caption = await imageToText(Array.isArray(describeURL) ? describeURL[0] : describeURL);
    } catch (e) {
      errorMsg = e.message;
    }
  } else {
    res.status(405);
    res.end();
    return;
  }

  if (caption) res.status(200).json(caption);
  else {
    res.statusMessage = 'Something went wrong trying to contact the API (' + errorMsg + ')';
    res.status(500);
    res.end();
  }
}
