import type { IGetPlaiceholderReturn } from 'plaiceholder';

export type ImagePlaciceholderProps = {
  blurDataURL: IGetPlaiceholderReturn['base64'] | null;
  src: string;
};
