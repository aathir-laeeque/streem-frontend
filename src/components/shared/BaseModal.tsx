import { Button, FlatButton } from '#components';
import { Close } from '@material-ui/icons';
import React, { FC, ReactNode, useRef } from 'react';
import styled from 'styled-components';

interface BaseModalProps {
  closeAllModals: () => void;
  closeModal: () => void;
  title?: string;
  primaryText?: string;
  secondaryText?: string;
  onPrimary?: () => void;
  onSecondary?: () => void;
  children: ReactNode;
  modalFooterOptions?: ReactNode;
  showHeader?: boolean;
  showFooter?: boolean;
  showPrimary?: boolean;
  showSecondary?: boolean;
  isRound?: boolean;
}

const Wrapper = styled.div.attrs({})`
  #modal-container {
    position: fixed;
    display: table;
    height: 100%;
    width: 100%;
    top: 0;
    left: 0;
    transform: scale(0);
    z-index: 1;
    &.openup {
      transform: scale(1);
      .modal-background {
        background: rgba(0, 0, 0, 0);
        animation: fadeIn 0.5s cubic-bezier(0.165, 0.84, 0.44, 1) forwards;
        .modal {
          opacity: 0;
          animation: scaleUp 0.5s cubic-bezier(0.165, 0.84, 0.44, 1) forwards;
        }
      }

      &.out {
        animation: quickScaleDown 0s 0.5s linear forwards;
        .modal-background {
          animation: fadeOut 0.5s cubic-bezier(0.165, 0.84, 0.44, 1) forwards;
          .modal {
            animation: scaleDown 0.5s cubic-bezier(0.165, 0.84, 0.44, 1)
              forwards;
          }
        }
      }
    }

    .modal-background {
      display: table-cell;
      background: rgba(0, 0, 0, 0.8);
      text-align: center;
      vertical-align: middle;
      .modal {
        width: 450px;
        background: white;
        display: inline-block;
        border-radius: 3px;
        font-weight: 300;
        position: relative;
        border-radius: 16px;
        overflow: hidden;
        min-width: 600px;
        max-height: calc(100vh - 40vh);
        max-width: calc(100vw - 40vw);
        box-shadow: 0 1px 10px 0 rgba(0, 0, 0, 0.12),
          0 4px 5px 0 rgba(0, 0, 0, 0.14), 0 2px 4px -1px rgba(0, 0, 0, 0.2);
        h2 {
          font-size: 20px;
          font-weight: 600;
          color: #666666;
          line-height: 20px;
          margin: 0;
        }
        .modal-header {
          display: flex;
          align-items: center;
          padding: 14px;
          border-bottom: 1px solid rgba(0, 0, 0, 0.32);
          justify-content: space-between;
        }
        .modal-footer {
          display: flex;
          align-items: center;
          padding: 14px;
          border-top: 1px solid rgba(0, 0, 0, 0.32);
        }
        .modal-footer-options {
          display: flex;
          justify-content: flex-start;
        }
        .modal-footer-buttons {
          display: flex;
          flex: 1;
          justify-content: flex-end;
        }
        .modal-body {
          padding: 15px 15px 22px 15px;
        }
      }
    }
  }

  @keyframes fadeIn {
    0% {
      background: rgba(0, 0, 0, 0);
    }
    100% {
      background: rgba(0, 0, 0, 0.3);
    }
  }

  @keyframes fadeOut {
    0% {
      background: rgba(0, 0, 0, 0.3);
    }
    100% {
      background: rgba(0, 0, 0, 0);
    }
  }

  @keyframes scaleUp {
    0% {
      transform: scale(0.8) translateY(1000px);
      opacity: 0;
    }
    100% {
      transform: scale(1) translateY(0px);
      opacity: 1;
    }
  }

  @keyframes scaleDown {
    0% {
      transform: scale(1) translateY(0px);
      opacity: 1;
    }
    100% {
      transform: scale(0.8) translateY(1000px);
      opacity: 0;
    }
  }

  @keyframes quickScaleDown {
    0% {
      transform: scale(1);
    }
    99.9% {
      transform: scale(1);
    }
    100% {
      transform: scale(0);
    }
  }
`;

export const BaseModal: FC<BaseModalProps> = ({
  onPrimary = () => false,
  onSecondary = () => false,
  children,
  modalFooterOptions,
  title,
  primaryText,
  secondaryText,
  closeModal,
  showPrimary = true,
  showSecondary = true,
  showHeader = true,
  showFooter = true,
  isRound = true,
}) => {
  const modalContainer = useRef<HTMLDivElement | null>(null);

  const onBaseModalContainerClick = (toExecute: () => void) => {
    if (modalContainer && modalContainer.current) {
      modalContainer.current.classList.add('out');
    }
    setTimeout(() => {
      toExecute();
    }, 500);
  };

  return (
    <Wrapper>
      <div id="modal-container" ref={modalContainer} className="openup">
        <div className="modal-background">
          <div
            className="modal"
            style={{ borderRadius: isRound ? '16px' : '4px' }}
          >
            {showHeader && (
              <div className="modal-header">
                <h2>{title}</h2>
                <Close
                  style={{ cursor: `pointer`, fontSize: 20 }}
                  onClick={() => onBaseModalContainerClick(closeModal)}
                />
              </div>
            )}
            <div className="modal-body">{children}</div>
            {showFooter && (
              <div className="modal-footer">
                {modalFooterOptions && (
                  <div className="modal-footer-options">
                    {modalFooterOptions}
                  </div>
                )}
                <div className="modal-footer-buttons">
                  {showSecondary && (
                    <FlatButton
                      style={{ padding: `5px 16px`, fontWeight: 600 }}
                      onClick={() => onBaseModalContainerClick(onSecondary)}
                    >
                      {secondaryText}
                    </FlatButton>
                  )}
                  {showPrimary && (
                    <Button
                      style={{ marginRight: 0, fontWeight: 600 }}
                      onClick={() => onBaseModalContainerClick(onPrimary)}
                    >
                      {primaryText}
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Wrapper>
  );
};
