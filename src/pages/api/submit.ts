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
    await bot.sendPhoto(process.env.TELEGRAM_SUBMISSION_CHANNEL_ID, req.file.buffer, {
      caption: `${req.body.contact} has submitted ${req.body.apeName}`,
    });
    res.status(200).end();
  }
);

export const config = {
  api: {
    bodyParser: false,
  },
};

export default apiRouter;
