import Image, { ImageProps } from 'next/image';
import React from 'react';

export const ApeImage: React.FC<ImageProps> = (props) => {
  return (
    <div className="flex h-full w-full aspect-square">
      <Image {...props} alt={props.alt} className="bg-pink-50 rounded-t-md" placeholder="blur" />
    </div>
  );
};
