import Sanity from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';
import type { SanityImageSource } from '@sanity/image-url/lib/types/types';

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
    const apesQuery = /* groq */ `*[_type == 'ape'] { image }`;
    const blogPosts = await this.fetch(apesQuery);
    return blogPosts;
  }

  urlForImageSource(source: SanityImageSource) {
    return this.builder.image(source);
  }
}
