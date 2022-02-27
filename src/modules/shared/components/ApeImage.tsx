import Image, { ImageProps } from 'next/image';
import React from 'react';

export const ApeImage: React.FC<ImageProps> = (props) => {
  return <Image {...props} className="bg-pink-50 rounded-t-md w-full" placeholder="blur" />;
};
