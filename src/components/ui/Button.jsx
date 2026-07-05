import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Tombol reusable Neo-Brutalisme.
 * Varian: yellow-solid (default), indigo-solid, outline, dark-solid
 */
const variantStyles = {
  'yellow-solid':
    'bg-yellow-neo text-black border-2 border-black shadow-[4px_4px_0px_#000] hover:shadow-[6px_6px_0px_#000] hover:translate-x-[-2px] hover:translate-y-[-2px]',
  'indigo-solid':
    'bg-indigo-neo text-white border-2 border-black shadow-[4px_4px_0px_#000] hover:shadow-[6px_6px_0px_#000] hover:translate-x-[-2px] hover:translate-y-[-2px]',
  'dark-solid':
    'bg-dark-neo text-white border-2 border-black shadow-[4px_4px_0px_#000] hover:shadow-[6px_6px_0px_#000] hover:translate-x-[-2px] hover:translate-y-[-2px]',
  outline:
    'bg-white text-black border-2 border-black shadow-[4px_4px_0px_#000] hover:shadow-[6px_6px_0px_#000] hover:translate-x-[-2px] hover:translate-y-[-2px]',
};

const Button = ({
  variant = 'yellow-solid',
  icon,
  children,
  href,
  onClick,
  fullWidth = false,
  className = '',
  type = 'button',
  disabled = false,
  ...rest
}) => {
  const baseStyles =
    'inline-flex items-center justify-center gap-2 px-6 py-3 font-inter font-bold text-base rounded-md transition-all duration-200 cursor-pointer';
  const widthClass = fullWidth ? 'w-full' : '';
  const disabledClass = disabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : '';
  const classes = `${baseStyles} ${variantStyles[variant] || variantStyles['yellow-solid']} ${widthClass} ${disabledClass} ${className}`;

  // If href is provided, render as Link
  if (href) {
    return (
      <Link to={href} className={classes} {...rest}>
        {icon && <span className="text-lg">{icon}</span>}
        {children}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} className={classes} disabled={disabled} {...rest}>
      {icon && <span className="text-lg">{icon}</span>}
      {children}
    </button>
  );
};

export default Button;
