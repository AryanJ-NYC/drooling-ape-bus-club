import multer from 'multer';
import { NextApiRequest, NextApiResponse } from 'next';
import nextConnect from 'next-connect';
import TelegramBot from 'node-telegram-bot-api';

const token = process.env.TELEGRAM_SUBMISSION_CHANNEL_TOKEN;
const bot = new TelegramBot(token);

const upload = multer();
const middleware = upload.single('file');

const apiRouter = nextConnect<NextApiRequest & { file: Express.Multer.File }, NextApiResponse>({
  onNoMatch(_, res) {
    res.status(405).end();
  },
})
  .use(middleware)
  .post(async (req, res) => {
    const isGif = req.file.mimetype === 'image/gif';
    const send = isGif ? bot.sendAnimation.bind(bot) : bot.sendPhoto.bind(bot);
    try {
      const { apeName, contact } = req.body;
      await Promise.all([
        send(process.env.TELEGRAM_SUBMISSION_CHANNEL_ID, req.file.buffer, {
          caption: `${contact} has submitted ${apeName}`,
        }),
        fetch('https://hook.integromat.com/8mix5hofy439qpeozryd6megg1edasni', {
          body: JSON.stringify({ apeName, contact }),
          headers: { 'content-type': 'application/json' },
          method: 'POST',
        }),
      ]);
      return res.status(200).end();
    } catch (e) {
      console.error(e);
      return res.status(400).end();
    }
  });

export const config = {
  api: {
    bodyParser: false,
  },
};

export default apiRouter;
