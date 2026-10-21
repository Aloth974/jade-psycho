"use client";

import React from 'react';

import './inked-modal.scss';
import ModalButton from '../modal-button/modal-button';

type Phase = 'closed' | 'opening' | 'open' | 'closing';

// Time for the ink sprite to cover the screen before the dialog appears
const OPENING_MS = 600;
// Length of the reverse ink animation (see .closing in inked-modal.scss)
const CLOSING_MS = 800;

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export default function InkedModal({ buttonText, children, title }: Readonly<{
  buttonText: string;
  children: React.ReactNode;
  title: string;
}>) {
  const titleId = React.useId();
  const dialogRef = React.useRef<HTMLDialogElement>(null);
  const timerRef = React.useRef<number>();
  const [phase, setPhase] = React.useState<Phase>('closed');

  React.useEffect(() => () => window.clearTimeout(timerRef.current), []);

  const showDialog = () => {
    if (!dialogRef.current?.open) {
      dialogRef.current?.showModal();
    }
    setPhase('open');
  };

  const hideDialog = () => {
    dialogRef.current?.close();
    setPhase('closed');
  };

  const handleOpen = () => {
    if (phase !== 'closed') {
      return;
    }
    if (prefersReducedMotion()) {
      showDialog();
      return;
    }
    setPhase('opening');
    timerRef.current = window.setTimeout(showDialog, OPENING_MS);
  };

  const handleClose = () => {
    if (phase !== 'open') {
      return;
    }
    if (prefersReducedMotion()) {
      hideDialog();
      return;
    }
    setPhase('closing');
    timerRef.current = window.setTimeout(hideDialog, CLOSING_MS);
  };

  // Escape: run our closing animation instead of the browser's instant close
  const handleCancel = (event: React.SyntheticEvent<HTMLDialogElement>) => {
    event.preventDefault();
    handleClose();
  };

  // The browser can still close the dialog on its own (e.g. a repeated Escape)
  const handleDialogClose = () => {
    window.clearTimeout(timerRef.current);
    setPhase('closed');
  };

  const layerClass = {
    closed: '',
    opening: ' visible opening',
    open: ' visible opening',
    closing: ' visible closing',
  }[phase];

  return (
    <>
      <ModalButton onClick={handleOpen} aria-haspopup="dialog">
        {buttonText}
      </ModalButton>

      <dialog
        ref={dialogRef}
        className={`cd-modal${phase === 'closing' ? ' closing' : ''}`}
        aria-labelledby={titleId}
        onCancel={handleCancel}
        onClose={handleDialogClose}
      >
        <button type="button" className="modal-close" aria-label="Fermer" onClick={handleClose} />
        <div className="modal-content">
          <h2 id={titleId}>
            {title}
          </h2>
          <div className="modal-content-text">
            {children}
          </div>
        </div>
      </dialog>

      <div className={`cd-transition-layer${layerClass}`} aria-hidden="true">
        <div className="bg-layer" />
      </div>
    </>
  );
}
