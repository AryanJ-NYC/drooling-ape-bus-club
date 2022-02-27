import type { IGetPlaiceholderReturn } from 'plaiceholder';

export type ImagePlaceholderProps = {
  blurDataURL: IGetPlaiceholderReturn['base64'] | null;
  src: string;
};
