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
      'bafybeiehde5nbh6dmkgyjgw4kehugctxd7uzt7g53taydebksiblb6tkhm.ipfs.dweb.link',
      'c6nohcoz2inpvnpmbr43wjgg73njuhzqsyzmm2sh56gut7eot7qq.arweave.net',
      'mipsqn6qjx75perzz6vswkh7syyvzujfcwf6yrpzgbmiw5ookaaa.arweave.net',
      'nbeiplrqgsrkubuxayv6mo4av3cj3muqjzytpwy7gzgaputyeaua.arweave.net',
      'frhost.co.uk',
      'hosting.photobucket.com',
      'media.istockphoto.com',
      'imgur.com',
      'i.imgur.com',
      'xchain.io',
    ],
  },
  reactStrictMode: true,
});
