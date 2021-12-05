import React from 'react';

export const ApeGrid: React.FC = (props) => {
  return (
    <div
      {...props}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 px-16 py-8 bg-gray-50"
    />
  );
};
