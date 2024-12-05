"use client";

import React from 'react';

import './modal-button.scss';

export default function ModalButton({ children, className, ...restProps }: Readonly<{
  children: React.ReactNode;
  className: string;
  [x: string]: unknown;
}>) {
  return (
    <a href="#0" className={`modal-button ${className}`} {...restProps}>
      {children}
    </a>
  );
}
