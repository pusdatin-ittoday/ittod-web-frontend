import React from "react";
import { motion as Motion } from "motion/react";
import { Link } from "react-router-dom";
import { tapPress } from "../../lib/motion";

const variantStyles = {
  "yellow-solid":
    "bg-yellow-neo text-black border-[3px] border-black shadow-[5px_5px_0_#111] hover:shadow-[7px_7px_0_#111]",
  "indigo-solid":
    "bg-indigo-neo text-white border-[3px] border-black shadow-[5px_5px_0_#111] hover:shadow-[7px_7px_0_#111]",
  "dark-solid":
    "bg-dark-neo text-white border-[3px] border-black shadow-[5px_5px_0_#111] hover:shadow-[7px_7px_0_#111]",
  outline:
    "bg-white text-black border-[3px] border-black shadow-[5px_5px_0_#111] hover:shadow-[7px_7px_0_#111]",
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
    "inline-flex cursor-pointer items-center justify-center gap-2 px-6 py-3 font-inter text-sm font-black uppercase tracking-wide transition-shadow duration-150 active:shadow-none";
  const widthClass = fullWidth ? "w-full" : "";
  const disabledClass = disabled
    ? "pointer-events-none cursor-not-allowed opacity-50"
    : "";
  const classes = `${baseStyles} ${variantStyles[variant] || variantStyles["yellow-solid"]} ${widthClass} ${disabledClass} ${className}`;

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
