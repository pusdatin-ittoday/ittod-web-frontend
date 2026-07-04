import React from 'react';

/**
 * Card Neo-Brutalisme reusable.
 * Border tebal + offset shadow hitam — bisa dipakai di mana saja.
 */
const SectionCard = ({ children, className = '', hover = true, ...rest }) => {
  const hoverClass = hover ? 'card-brutal' : 'card-brutal-no-hover';
  return (
    <div className={`${hoverClass} rounded-lg p-6 ${className}`} {...rest}>
      {children}
    </div>
  );
};

export default SectionCard;
