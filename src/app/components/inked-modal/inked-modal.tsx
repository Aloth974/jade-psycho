"use client";

import React from 'react';

import './inked-modal.scss';
import ModalButton from '../modal-button/modal-button';

export default function InkPage({ buttonClassName, buttonText, children }: Readonly<{
  buttonClassName: string;
  buttonText: string;
  children: React.ReactNode;
}>) {
  const [layerDimensions, setLayerDimensions] = React.useState({ height: '0px', width: '0px' });
  const [isTransitioning, setTransitioning] = React.useState(false);
  const [isClosing, setClosing] = React.useState(false);
  const [modalOpened, setModalOpened] = React.useState(false);
  const [resize, setResize] = React.useState(false);

  const frameProportion = 1.78; //png frame aspect ratio
  const frames = 25; //number of png frames

  const handleOpen = () => {
    setTransitioning(true);
    setTimeout(function () {
      setModalOpened(true);
    }, 600);
  };

  const handleClose = () => {
    setClosing(true);
    setModalOpened(false);
    // transitionBackground.one('webkitAnimationEnd oanimationend msAnimationEnd animationend', function () {
    //   transitionLayer.removeClass('closing opening visible');
    //   transitionBackground.off('webkitAnimationEnd oanimationend msAnimationEnd animationend');
    // });

    setTimeout(function () {
      setClosing(false);
      setTransitioning(false);
      setModalOpened(false);
    }, 600);
  };

  function updateLayerDimensions() {
    let layerHeight, layerWidth;

    if (window.innerWidth / window.innerHeight > frameProportion) {
      layerWidth = window.innerWidth;
      layerHeight = layerWidth / frameProportion;
    } else {
      layerHeight = window.innerHeight * 1.2;
      layerWidth = layerHeight * frameProportion;
    }

    setLayerDimensions({ height: `${layerHeight}px`, width: `${layerWidth * frames}px` })

    setResize(false);
  }

  React.useEffect(() => {
    updateLayerDimensions();

    const resizeCallback = () => {
      if (!resize) {
        setResize(true);
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        (!window.requestAnimationFrame) ? setTimeout(updateLayerDimensions, 300) : window.requestAnimationFrame(updateLayerDimensions);
      }
    };

    window.addEventListener('resize', resizeCallback);
    setResize(false);

    return window.removeEventListener('resize', resizeCallback);
  }, [resize, setResize]);

  return (
    <>
      <div className="cd-main-content">
        <div className="center">
          <ModalButton className={buttonClassName} onClick={handleOpen}>
            {buttonText}
          </ModalButton>
        </div>
      </div>

      <div className={`cd-modal${modalOpened ? ' visible' : ''}`}>
        <div className="modal-content">
          {children}
        </div>

        <a href="#0" className="modal-close" onClick={handleClose}>Close</a>
      </div>

      <div className={`cd-transition-layer${isTransitioning ? ' visible opening' : ''}${isClosing ? ' closing' : ''}`}>
        <div className="bg-layer" style={layerDimensions}></div>
      </div>
    </>
  );
}
