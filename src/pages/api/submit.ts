import multer from 'multer';
import { NextApiRequest, NextApiResponse } from 'next';
import nextConnect from 'next-connect';
import TelegramBot from 'node-telegram-bot-api';

const token = process.env.TELEGRAM_SUBMISSION_CHANNEL_TOKEN;
const bot = new TelegramBot(token);

const upload = multer();
const middleware = upload.single('file');

const apiRouter = nextConnect({
  onNoMatch(_, res: NextApiResponse) {
    res.status(405).end();
  },
});
apiRouter.use(middleware);
apiRouter.post(
  async (req: NextApiRequest & { file: Express.Multer.File }, res: NextApiResponse) => {
    const isGif = req.file.mimetype === 'image/gif';
    const send = isGif ? bot.sendAnimation.bind(bot) : bot.sendPhoto.bind(bot);
    try {
      await send(process.env.TELEGRAM_SUBMISSION_CHANNEL_ID, req.file.buffer, {
        caption: `${req.body.contact} has submitted ${req.body.apeName}`,
      });
      return res.status(200).end();
    } catch (e) {
      console.error(e);
      return res.status(400).end();
    }
  }
);

export const config = {
  api: {
    bodyParser: false,
  },
};

export default apiRouter;
