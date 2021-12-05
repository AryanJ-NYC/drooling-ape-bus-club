import Sanity from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';
import type { SanityImageSource } from '@sanity/image-url/lib/types/types';
import type { Ape } from './types';

export class SanityClient extends Sanity {
  static projectId = 'chdhdteo';
  builder: ReturnType<typeof imageUrlBuilder>;

  constructor() {
    const projectDetails = {
      projectId: SanityClient.projectId,
      dataset: 'production',
      useCdn: true,
    };
    super(projectDetails);
    this.builder = imageUrlBuilder(projectDetails);
  }

  async getApes() {
    const apesQuery = /* groq */ `*[_type == 'ape'] | order(order asc) {
      ...,
      artists[] -> {
        name,
        webpage
      }
    }`;
    const apes: Ape[] = await this.fetch(apesQuery);
    return apes;
  }

  async getApesBySeries(seriesNumber: string) {
    const seriesNo = Number(seriesNumber);
    if (isNaN(seriesNo)) throw new Error('seriesNumber is not a number');
    const apesQuery = /* groq */ `*[_type == 'ape' && series == $seriesNumber] | order(order asc) {
      ...,
      artists[] -> {
        name,
        webpage
      }
    }`;
    const apes: Ape[] = await this.fetch(apesQuery, { seriesNumber: seriesNo });
    return apes;
  }

  urlForImageSource(source: SanityImageSource) {
    return this.builder.image(source);
  }
}
