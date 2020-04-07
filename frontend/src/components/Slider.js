import React from 'react';
import '../styles/slider.css';

export default function Slider({pages, page, children}) {
  return (
    <div className={`slider`}>
        {children.map((child, i) => (
          <div className={"slider-pane"}  style={{transform: `translateX(-${page}00%)`}} key={i}>
            {child}
          </div>
        ))}
    </div>
  )
}
