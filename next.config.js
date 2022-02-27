/** @type {import('next').NextConfig} */
// eslint-disable-next-line
const Yup = require('yup');
// eslint-disable-next-line
const { withPlaiceholder } = require('@plaiceholder/next');

const envVariablesValidationSchema = Yup.object({
  telegramSubmissionChannelApiKey: Yup.string().required(),
  telegramSubmissionChannelId: Yup.string().required(),
});
envVariablesValidationSchema.validateSync({
  telegramSubmissionChannelApiKey: process.env.TELEGRAM_SUBMISSION_CHANNEL_TOKEN,
  telegramSubmissionChannelId: process.env.TELEGRAM_SUBMISSION_CHANNEL_ID,
});

module.exports = withPlaiceholder({
  i18n: {
    locales: ['en'],
    defaultLocale: 'en',
  },
  images: {
    domains: [
      'arweave.net',
      'atlirntiuj5mbh2gj4k3xmxxncqo5bjwh7inye3ax4xwmrfxcztq.arweave.net',
      'frhost.co.uk',
      'hosting.photobucket.com',
      'media.istockphoto.com',
      'nbeiplrqgsrkubuxayv6mo4av3cj3muqjzytpwy7gzgaputyeaua.arweave.net',
      'imgur.com',
      'i.imgur.com',
      'bafybeiehde5nbh6dmkgyjgw4kehugctxd7uzt7g53taydebksiblb6tkhm.ipfs.dweb.link',
      'xchain.io',
    ],
  },
  reactStrictMode: true,
});
