import { NextApiRequest, NextApiResponse } from 'next';

import { imageToText } from '../../lib/image-to-text';
import { ImageCaptionResult } from '../../lib/models/image-caption';

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

export default async function handler(req: NextApiRequest, res: NextApiResponse<ImageCaptionResult | string>) {
  //await runMiddleware(req, res, cors);

  if (req.method === 'GET') {
    const { describeURL = 'https://moderatorsampleimages.blob.core.windows.net/samples/sample16.png' } = req.query;

    // Analyze URL image
    console.log('Analyzing URL image to describe...', describeURL);

    try {
      const result = await imageToText(Array.isArray(describeURL) ? describeURL[0] : describeURL);
      res.status(200).json(result);
    } catch (e) {
      res.status(500);
      res.statusMessage = e.message;
      res.end();
      return;
    }
  } else {
    res.status(405);
    res.end();
    return;
  }
}
