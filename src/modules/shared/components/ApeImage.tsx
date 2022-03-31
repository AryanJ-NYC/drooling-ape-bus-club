import Image, { ImageProps } from 'next/image';
import React from 'react';

export const ApeImage: React.FC<ImageProps> = (props) => {
  return <Image {...props} alt={props.alt} className="w-full" layout="raw" placeholder="blur" />;
};
