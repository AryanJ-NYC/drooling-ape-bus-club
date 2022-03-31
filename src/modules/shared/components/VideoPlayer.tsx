import React from 'react';
// @ts-expect-error
import { Player } from 'video-react';
import '../../../../node_modules/video-react/dist/video-react.css';

export const VideoPlayer: React.FC<{ src: string }> = ({ src }) => {
  return (
    <>
      <Player fluid playsInline src={src} />
      <style global jsx>{`
        .video-react-fluid,
        video {
          height: 100% !important;
        }
      `}</style>
    </>
  );
};
