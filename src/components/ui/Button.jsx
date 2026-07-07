import React from "react";
import { motion as Motion } from "motion/react";
import { Link } from "react-router-dom";
import { tapPress } from "../../lib/motion";

/**
 * Tombol reusable Neo-Brutalisme.
 * Varian: yellow-solid (default), indigo-solid, outline, dark-solid
 */
const variantStyles = {
  "yellow-solid":
    "bg-yellow-neo text-black border-[3px] border-black shadow-[5px_5px_0_#111] hover:shadow-[7px_7px_0_#111] hover:-translate-x-0.5 hover:-translate-y-0.5",
  "indigo-solid":
    "bg-indigo-neo text-white border-[3px] border-black shadow-[5px_5px_0_#111] hover:shadow-[7px_7px_0_#111] hover:-translate-x-0.5 hover:-translate-y-0.5",
  "dark-solid":
    "bg-dark-neo text-white border-[3px] border-black shadow-[5px_5px_0_#111] hover:shadow-[7px_7px_0_#111] hover:-translate-x-0.5 hover:-translate-y-0.5",
  outline:
    "bg-white text-black border-[3px] border-black shadow-[5px_5px_0_#111] hover:shadow-[7px_7px_0_#111] hover:-translate-x-0.5 hover:-translate-y-0.5",
};

const MotionLink = Motion.create(Link);

const Button = ({
  variant = "yellow-solid",
  icon,
  children,
  href,
  onClick,
  fullWidth = false,
  className = "",
  type = "button",
  disabled = false,
  ...rest
}) => {
  const baseStyles =
    "inline-flex items-center justify-center gap-2 px-6 py-3 font-inter font-black text-sm uppercase tracking-wide transition-all duration-150 cursor-pointer active:translate-x-1 active:translate-y-1 active:shadow-none";
  const widthClass = fullWidth ? "w-full" : "";
  const disabledClass = disabled
    ? "opacity-50 cursor-not-allowed pointer-events-none"
    : "";
  const classes = `${baseStyles} ${variantStyles[variant] || variantStyles["yellow-solid"]} ${widthClass} ${disabledClass} ${className}`;

  // If href is provided, render as Link
  if (href) {
    return (
      <MotionLink
        to={href}
        className={classes}
        whileHover={{ x: -3, y: -3 }}
        whileTap={tapPress}
        {...rest}
      >
        {icon && <span className="text-lg">{icon}</span>}
        {children}
      </MotionLink>
    );
  }

  return (
    <Motion.button
      type={type}
      onClick={onClick}
      className={classes}
      disabled={disabled}
      whileHover={disabled ? undefined : { x: -3, y: -3 }}
      whileTap={disabled ? undefined : tapPress}
      {...rest}
    >
      {icon && <span className="text-lg">{icon}</span>}
      {children}
    </Motion.button>
  );
};

export default Button;
