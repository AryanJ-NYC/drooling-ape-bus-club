import React from 'react';

export const ApeImage: React.FC<Props> = (props) => {
  return <img {...props} className="bg-pink-50 rounded-t-md w-full" />;
};

type Props = React.DetailedHTMLProps<React.ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement>;
