import React from 'react';

export const PageLayout: React.FC = ({ children }) => {
  return (
    <div>
      <header className="bg-pink-50 px-16 py-4">
        <a href="https://t.me/drooling_ape_bus_club" target="_blank" rel="noopener noreferrer">
          Join Us on Telegram
        </a>
      </header>
      {children}
    </div>
  );
};
