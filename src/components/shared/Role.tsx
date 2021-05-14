import { StyledRadio } from '#components';
import { PermissionType, RoleType } from '#views/UserAccess/types';
import { FormControlLabel, RadioGroup } from '@material-ui/core';
import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';
import CheckIcon from '@material-ui/icons/Check';
import React, { FC, useState } from 'react';
import styled from 'styled-components';

export interface RoleProps {
  id: string;
  permissions: PermissionType[];
  roles: RoleType[];
  selected?: RoleType[];
  label: string;
  placeHolder: string;
  disabled?: boolean;
  error?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const Wrapper = styled.div.attrs({})`
  flex: 1;

  .role-wrapper {
    position: relative;
    display: flex;
    flex-direction: column;
    flex: 1;
    background-color: #fff;
    opacity: 1;

    > label {
      font-size: 8px;
      color: #999999;
      font-weight: 600;
      padding: 4px;
    }

    .MuiAccordion-root {
      box-shadow: unset;

      .MuiAccordionSummary-root {
        padding: 16px 0px;
        min-height: unset;
      }

      .MuiIconButton-root {
        padding: 2px 12px;
      }

      .MuiAccordionSummary-content {
        margin: 0px;
      }

      .MuiAccordionDetails-root {
        padding: 0px;
        flex-direction: column;

        .permission-group {
          display: flex;
          flex: 1;
          flex-direction: column-reverse;
        }

        .permission-group-text {
          color: #333;
          font-size: 14px;
          font-weight: bold;
          padding: 10px 0px;
        }

        .permission {
          display: flex;
          flex-wrap: wrap;
        }

        .permission-text {
          font-size: 12px;
          font-weight: 300;
          color: #666;
          width: 50%;
          padding: 4px;
        }

        .permission-details {
          .permission-title {
            font-size: 12px;
            line-height: 0;
            font-weight: 300;
            color: #666;
            flex: 0.3;
            align-items: center;
            display: flex;
          }

          display: flex;
          flex: 1;
          padding: 4px 0px;
        }

        .permission-text::before {
          content: '	• 	';
          margin: 0px 15px 0px 6px;
          color: #666666;
        }
      }
    }

    .check-section {
      display: flex;
      flex: 1;
      justify-content: space-between;
    }

    .bordered {
      border-bottom: 1px dashed #dadada;
    }

    .check-group {
      display: flex;
      flex: 1;
      justify-content: center;
      align-items: center;

      .checkmark {
        border-radius: 0px;
        border-color: #333;
        background-color: #fff;
        border-width: 2px;

        :after {
          left: 4px;
          top: 1px;
          width: 4px;
          height: 7px;
        }
      }

      .container {
        color: #333;
        input:checked ~ .checkmark {
          background-color: #1d84ff;
          border: 2px solid #1d84ff;
        }
      }

      .MuiFormGroup-root {
        flex-direction: row;
        flex: 1;
        justify-content: space-around;

        .MuiFormControlLabel-label {
          font-weight: normal;
        }
      }
    }

    .input {
      flex: 1;
      font-size: 16px;
      padding: 4px 8px;
      color: #666666;
      border: none;
      outline: none;
      background-color: transparent;
      ::-webkit-input-placeholder {
        color: #999999;
      }
      :-moz-placeholder {
        color: #999999;
      }
      ::-moz-placeholder {
        color: #999999;
      }
      :-ms-input-placeholder {
        color: #999999;
      }
    }

    .input.disabled {
      color: #333;
    }

    .actions {
      color: #1d84ff;
      font-size: 16px;
      white-space: nowrap;
      padding: 0px 20px 0px 0px;
      display: flex;
      align-items: center;
    }
  }

  .role-wrapper.active {
    border: none;
    border-bottom: 2px solid #1d84ff;
    border-bottom-left-radius: 0px;
    border-bottom-right-radius: 0px;
    opacity: 1;

    > label {
      color: #1d84ff;
    }
  }

  .role-wrapper.error {
    border: none;
    border-bottom: 2px solid #ff6b6b;
    border-bottom-left-radius: 0px;
    border-bottom-right-radius: 0px;
    opacity: 1;

    > label {
      color: #ff6b6b;
    }
  }

  .role-wrapper.disabled {
    border: none !important;
    opacity: 1 !important;
    padding-top: 0px;
  }

  .icon {
    font-size: 16px;
    color: #bababa;
  }

  .icon.success {
    color: #5aa700;
    font-size: 16px;
  }
`;

export const Role: FC<RoleProps> = ({
  label,
  placeHolder,
  selected,
  permissions,
  roles,
  disabled = false,
  id,
  error,
  onChange,
}) => {
  const [isActive, setIsActive] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const onFocus = (): void => {
    setIsActive(true);
  };

  const onBlur = (): void => {
    setIsActive(false);
  };

  const onToggle = (_: unknown, expanded: boolean): void => {
    setIsExpanded(expanded);
  };

  const getArrowIcon = (isOpen: boolean) => (
    <>
      <div className="actions">Permissions</div>
      {isOpen ? (
        <ArrowDropUpIcon style={{ color: '#1d84ff' }} />
      ) : (
        <ArrowDropDownIcon style={{ color: '#1d84ff' }} />
      )}
    </>
  );

  return (
    <Wrapper>
      <div
        className={`role-wrapper ${isActive ? 'active' : ''}
          ${error ? 'error' : ''}
          ${disabled ? 'disabled' : ''}`}
      >
        {label && <label>{label}</label>}
        <div>
          <Accordion onChange={onToggle}>
            <AccordionSummary
              aria-controls="panel1a-content"
              id="panel1a-header"
              expandIcon={false}
            >
              {disabled && (
                <>
                  <input
                    className={`input disabled`}
                    style={{ textTransform: 'capitalize' }}
                    value={placeHolder}
                    onFocus={onFocus}
                    onBlur={onBlur}
                    disabled={disabled}
                  />
                  {getArrowIcon(isExpanded)}
                </>
              )}
              {!disabled && (
                <div className="check-group">
                  <div
                    style={{ display: 'flex', flex: 0.3, alignItems: 'center' }}
                  >
                    {getArrowIcon(isExpanded)}
                  </div>
                  <div
                    className="check-group"
                    onClick={(e) => e.stopPropagation()}
                    style={{ cursor: 'auto' }}
                  >
                    <RadioGroup
                      id={id}
                      name={id}
                      onChange={onChange}
                      defaultValue={selected?.[0]?.id}
                    >
                      {roles.map((role) => {
                        if (role.id === roles[0].id) return null;
                        return (
                          <FormControlLabel
                            control={<StyledRadio />}
                            key={role.id.toString()}
                            label={role.name}
                            value={role.id}
                          />
                        );
                      })}
                    </RadioGroup>
                  </div>
                </div>
              )}
            </AccordionSummary>
            <AccordionDetails>
              {disabled
                ? permissions.map((permissionGroup) => {
                    let permissionGroupName = '';
                    return (
                      <div
                        key={`${permissionGroup.id}`}
                        className="permission-group"
                      >
                        <div className="permission">
                          {permissionGroup.permissions.map((permission) => {
                            if (selected?.[0]?.permissions?.[permission]) {
                              permissionGroupName = permissionGroup.name;
                              return (
                                <span
                                  className="permission-text"
                                  key={`${permission}`}
                                >
                                  {permission}
                                </span>
                              );
                            }
                          })}
                        </div>
                        {permissionGroupName && (
                          <div className="permission-group-text">
                            {permissionGroup.name}
                          </div>
                        )}
                      </div>
                    );
                  })
                : permissions.map((permissionGroup) => {
                    return (
                      <div
                        key={`${permissionGroup.id}`}
                        className="permission-group"
                      >
                        <div
                          className="permission"
                          style={{ flexDirection: 'column' }}
                        >
                          {permissionGroup.permissions.map((permission) => {
                            return (
                              <div
                                className="permission-details"
                                key={`${permission}`}
                              >
                                <div className="permission-title">
                                  {permission}
                                </div>
                                <div className="check-group bordered">
                                  {roles.map((role) => {
                                    if (role.id === roles[0].id) return null;
                                    return (
                                      <div
                                        key={`${permission}_${role.id}`}
                                        className="check-group"
                                      >
                                        {role.permissions[permission] ? (
                                          <CheckIcon className="icon success" />
                                        ) : (
                                          '-'
                                        )}
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                        <div className="permission-group-text">
                          {permissionGroup.name}
                        </div>
                      </div>
                    );
                  })}
            </AccordionDetails>
          </Accordion>
        </div>
      </div>
    </Wrapper>
  );
};
