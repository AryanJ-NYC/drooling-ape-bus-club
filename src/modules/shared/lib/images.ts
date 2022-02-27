import { getPlaiceholder } from 'plaiceholder';
import { ImagePlaceholderProps } from '../../../modules/types';

export const getImageProps = async (imageUrl: string): Promise<ImagePlaceholderProps> => {
  if (imageUrl.endsWith('.mp4')) {
    return { src: imageUrl, blurDataURL: null };
  }
  const { img, base64: blurDataURL } = await getPlaiceholder(imageUrl);
  return { ...img, blurDataURL };
};
