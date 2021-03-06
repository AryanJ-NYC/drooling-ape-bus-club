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

  async getApeByName(assetName: string) {
    const query = /* groq */ `*[_type == 'ape' && name == $name] {
      ...,
      artists[] -> {
        name,
        webpage
      },
    }[0]`;
    const ape: Ape = await this.fetch(query, { name: assetName });
    return ape;
  }

  async getApeNames() {
    const apesQuery = /* groq */ `*[_type == 'ape'] {
      name
    }`;
    const apes: Pick<Ape, 'name'>[] = await this.fetch(apesQuery);
    return apes;
  }

  async getApes() {
    const apesQuery = /* groq */ `*[_type == 'ape'] | order(order asc) {
      ...,
      artists[] -> {
        name,
        webpage
      },
      "series": *[_type=='series' && references(^._id)] {
        series
      }[0].series
    }`;
    const apes: (Ape & { series: number })[] = await this.fetch(apesQuery);
    return apes;
  }

  async getAllApesGroupedBySeries() {
    const query = /* groq */ `*[_type == 'series'] | order(series asc) {
      apes[] -> { imageUrl }
    }`;
    const apes: { apes: [{ imageUrl: Ape['imageUrl'] }] }[] = await this.fetch(query);
    return apes;
  }

  async getApesBySeries(seriesNumber: string): Promise<Ape[]> {
    const seriesNo = Number(seriesNumber);
    if (isNaN(seriesNo)) throw new Error('seriesNumber is not a number');
    const apesQuery = /* groq */ `*[_type == 'series' && series == $seriesNumber] | order(series asc) {
      apes[] -> {
        ...,
        artists[] -> {
          name,
          webpage
        }
      }
    }[0].apes`;
    const apes = await this.fetch(apesQuery, { seriesNumber: seriesNo });
    return apes;
  }

  urlForImageSource(source: SanityImageSource) {
    return this.builder.image(source);
  }
}
