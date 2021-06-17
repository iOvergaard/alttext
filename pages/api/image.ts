import Cors from 'cors';
import { NextApiRequest, NextApiResponse } from 'next';

import { imageToText, imageToTextBinary } from '../../lib/image-to-text';
import { ImageCaption } from '../../lib/models/image-caption';
import { runMiddleware } from '../../lib/run-middleware';

const cors = Cors({
    methods: ['GET', 'POST', 'HEAD']
});

export default async function handler(req: NextApiRequest, res: NextApiResponse<ImageCaption | string>) {
    await runMiddleware(req, res, cors);

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
    }

    else if (req.method === 'POST') {
        const { file } = req.body;

        try {
            caption = await imageToTextBinary(file);
        } catch (e) {
            errorMsg = e.message;
        }
    }

    return caption ? res.status(200).json(caption) : res.status(407).send('Something went wrong trying to contact the API (' + errorMsg + ')')
};