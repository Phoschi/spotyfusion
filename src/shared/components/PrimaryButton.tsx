// src/shared/components/PrimaryButton.tsx
import type { ButtonHTMLAttributes, PropsWithChildren } from "react";
import React from "react";

type PrimaryButtonProps = PropsWithChildren<
  ButtonHTMLAttributes<HTMLButtonElement>
> & {
  fullWidth?: boolean;
};

const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  children,
  fullWidth = false,
  className = "",
  ...buttonProps
}) => {
  return (
    <button
      {...buttonProps}
      className={`primary-button ${fullWidth ? "primary-button--full" : ""} ${className}`}
    >
      {children}
    </button>
  );
};

export default PrimaryButton;
