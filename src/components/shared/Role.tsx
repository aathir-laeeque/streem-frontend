import React, { FC, useState } from 'react';
import { Checkbox } from '#components';
import styled from 'styled-components';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';
import CheckIcon from '@material-ui/icons/Check';
import ClearIcon from '@material-ui/icons/Clear';

interface RoleProps {
  id: string;
  permissions: PermissionType[];
  roles: RoleType[];
  selected?: number;
  label: string;
  refFun?: any;
  placeHolder: string;
  disabled?: boolean;
  error?: string;
}

type PermissionType = {
  id: number;
  name: string;
  permissions: string[];
};

type RoleType = {
  id: number;
  name: string;
  permissions: Record<string, boolean>;
};

const Wrapper = styled.div.attrs({})`
  flex: 1;

  .role-wrapper {
    position: relative;
    display: flex;
    flex-direction: column;
    flex: 1;
    background-color: #fff;
    opacity: 1;
    margin-bottom: 32px;
    padding-top: 16px;

    > label {
      font-size: 8px;
      color: #999999;
      font-weight: 600;
      padding: 4px;
    }

    .MuiAccordion-root {
      box-shadow: unset;

      .MuiAccordionSummary-root {
        padding: 0px 0px 16px;
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
          color: #666666;
          font-size: 18px;
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
            font-weight: 300;
            color: #666;
            flex: 0.3;
            align-items: center;
            display: flex;
          }

          display: flex;
          flex: 1;
          height: 24px;
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
      border-bottom: 1px dashed #999999;
      opacity: 0.6;
    }

    .actions {
      color: #1d84ff;
      font-size: 16px;
      white-space: nowrap;
      padding: 0px 20px 0px 0px;
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

    .actions {
      padding: 4px 0px 0px 8px;
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

    .actions {
      padding: 4px 0px 0px 8px;
    }
  }

  .role-wrapper.disabled {
    border: none !important;
    opacity: 1 !important;
    padding-top: 0px;

    .actions {
      padding: 4px 0px 0px 8px;
    }
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
  disabled,
  refFun,
  id,
  error,
}) => {
  const [isActive, setIsActive] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const onFocus = (): void => {
    setIsActive(true);
  };

  const onBlur = (): void => {
    setIsActive(false);
  };

  const onToggle = (event: Event, expanded: boolean): void => {
    setIsExpanded(expanded);
  };

  let selectedRole: RoleType[] | null = null;
  if (selected) {
    selectedRole = roles.filter((role) => role.id === selected);
  }

  return (
    <Wrapper>
      <div
        className={`role-wrapper ${isActive ? 'active' : ''}
          ${error ? 'error' : ''}
          ${disabled ? 'disabled' : ''}`}
      >
        {disabled && <label>{label}</label>}
        <div>
          <Accordion onChange={onToggle}>
            <AccordionSummary
              aria-controls="panel1a-content"
              id="panel1a-header"
              expandIcon={disabled ? <ArrowDropDownIcon /> : false}
            >
              {disabled && (
                <>
                  <input
                    name={id}
                    className={`input ${disabled ? 'disabled' : ''}`}
                    ref={refFun}
                    placeholder={placeHolder}
                    onFocus={onFocus}
                    data-testid={id}
                    onBlur={onBlur}
                    autoComplete="off"
                    disabled={disabled || false}
                  />
                  <div className="actions">
                    {isExpanded ? 'Hide Permissions' : 'View Permissions'}
                  </div>
                </>
              )}
              {!disabled && (
                <div className="check-group">
                  <div
                    style={{ display: 'flex', flex: 0.3, alignItems: 'center' }}
                  >
                    <div className="actions">
                      {isExpanded ? 'Hide Permissions' : 'View Permissions'}
                    </div>
                    {isExpanded ? (
                      <ArrowDropUpIcon
                        style={{ color: 'rgba(0, 0, 0, 0.54)' }}
                      />
                    ) : (
                      <ArrowDropDownIcon
                        style={{ color: 'rgba(0, 0, 0, 0.54)' }}
                      />
                    )}
                  </div>
                  <div className="check-group">
                    {roles.map((role) => (
                      <div key={`${role.id}`} className="check-group">
                        <Checkbox
                          key={`${role.id}`}
                          label={role.name}
                          onClick={() => console.log('cheked')}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </AccordionSummary>
            <AccordionDetails>
              {selected
                ? permissions.map((permissionGroup) => {
                    let permissionGroupName = '';
                    return (
                      <div
                        key={`${permissionGroup.id}`}
                        className="permission-group"
                      >
                        <div className="permission">
                          {permissionGroup.permissions.map((permission) => {
                            if (
                              selectedRole &&
                              selectedRole[0].permissions[permission]
                            ) {
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
                                  {roles.map((role) => (
                                    <div
                                      key={`${permission}_${role.id}`}
                                      className="check-group"
                                    >
                                      {role.permissions[permission] ? (
                                        <CheckIcon className="icon success" />
                                      ) : (
                                        <ClearIcon className="icon" />
                                      )}
                                    </div>
                                  ))}
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
