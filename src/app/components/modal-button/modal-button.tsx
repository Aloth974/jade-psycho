"use client";

import React from 'react';

import './modal-button.scss';

export default function ModalButton({ children, className, ...restProps }: Readonly<{
  children: React.ReactNode;
  className: string;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
  [x: string]: unknown;
}>) {
  return (
    <button className={`modal-button ${className}`} {...restProps}>
      {children}
    </button>
  );
}
