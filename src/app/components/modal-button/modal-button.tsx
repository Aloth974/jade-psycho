"use client";

import React from 'react';

import './modal-button.scss';

export default function ModalButton({ children, className, type = 'button', ...restProps }: Readonly<React.ComponentPropsWithoutRef<'button'>>) {
  return (
    <button type={type} className={['modal-button', className].filter(Boolean).join(' ')} {...restProps}>
      {children}
    </button>
  );
}
