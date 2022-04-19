import React from 'react';
import './Background.css';

const Background = () => {
  return (
    <div id="background-container">
      <div id="animation">
        <div className="dangle-container">
          <div id="star1"></div>
          <div id="star2"></div>
          <div id="moon"></div>
          <div id="star3"></div>
          <div id="star4"></div>
        </div>
      </div>
    </div>
  );
};

export default Background;