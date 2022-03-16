import React from 'react';
// @ts-expect-error
import { Player } from 'video-react';
import '../../../../node_modules/video-react/dist/video-react.css';

export const VideoPlayer: React.FC<{ src: string }> = ({ src }) => {
  return (
    <div>
      <Player fluid playsInline src={src} />
    </div>
  );
};
