import React from 'react';

export const PokéballLoader: React.FC = () => (
  <div className="flex items-center justify-center p-8">
    <div className="pokeball-loader">
      <div className="pokeball">
        <div className="pokeball-top"></div>
        <div className="pokeball-bottom"></div>
        <div className="pokeball-center">
          <div className="pokeball-button"></div>
        </div>
      </div>
    </div>
  </div>
);
