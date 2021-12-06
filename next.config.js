/** @type {import('next').NextConfig} */
// eslint-disable-next-line
const Yup = require('yup');

const envVariablesValidationSchema = Yup.object({
  telegramSubmissionChannelApiKey: Yup.string().required(),
  telegramSubmissionChannelId: Yup.string().required(),
});
envVariablesValidationSchema.validateSync({
  telegramSubmissionChannelApiKey: process.env.TELEGRAM_SUBMISSION_CHANNEL_TOKEN,
  telegramSubmissionChannelId: process.env.TELEGRAM_SUBMISSION_CHANNEL_ID,
});

module.exports = {
  i18n: {
    locales: ['en'],
    defaultLocale: 'en',
  },
  reactStrictMode: true,
};
