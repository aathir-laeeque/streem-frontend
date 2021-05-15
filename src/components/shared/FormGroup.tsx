import { TextInput, Role } from '#components';
import Select, { StylesConfig } from 'react-select';
import { v4 as uuidv4 } from 'uuid';
import CheckCircle from '@material-ui/icons/CheckCircle';
import React from 'react';
import styled from 'styled-components';
import { RoleProps } from './Role';
import { makeStyles } from '@material-ui/core/styles';
import Radio, { RadioProps } from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';

type FormInput = {
  type: 'text' | 'password' | 'checkbox' | 'role' | 'error-container' | 'radio';
  props: Record<any, any>;
};

export type FormGroupProps = {
  inputs: FormInput[];
};

const Wrapper = styled.div.attrs({
  className: 'form-group',
})`
  display: flex;
  flex-direction: column;
  padding: 24px 16px;

  > div {
    margin-bottom: 32px;

    :last-child {
      margin-bottom: unset;
    }
  }

  .custom-select__multi-value--is-disabled {
    ::before {
      content: '';
      border-radius: 50%;
      border: 2px solid;
      width: 0.5px;
      height: 0.5px;
      top: 11px;
      position: absolute;
      left: 2px;
    }
  }

  .label {
    align-items: center;
    color: #161616;
    display: flex;
    font-size: 14px;
    justify-content: flex-start;
    letter-spacing: 0.16px;
    line-height: 1.29;
    margin-bottom: 8px;
  }

  .error-container {
    display: flex;
    flex-wrap: wrap;
    flex-direction: column;
    padding: 0px 2px;
    margin-top: -12px;

    > div {
      display: flex;
      flex: 1;
      font-size: 12px;
      letter-spacing: 0.32px;
      color: #000000;
      line-height: 16px;
      align-items: center;
      margin-top: 10px;

      :first-child {
        margin-top: 0px;
      }

      .indicator {
        font-size: 20px;
        line-height: 16px;
        margin-right: 9px;
        color: #5aa700;
      }
    }
  }

  .MuiFormControlLabel-label {
    font-family: inherit;
    font-size: 14px;
    font-weight: bold;
    line-height: 1.14;
    letter-spacing: 0.16px;
    color: #333333;
  }

  .radio-desc {
    font-size: 14px;
    line-height: 1.14;
    letter-spacing: 0.16px;
    color: #666666;
    margin: 0 0 24px 24px;
  }

  .custom-select__multi-value--is-disabled {
    ::before {
      top: unset;
    }
  }
`;

export const selectStyles: StylesConfig = {
  control: (styles, { isDisabled }) => ({
    ...styles,
    backgroundColor: isDisabled ? 'transparent' : '#f4f4f4',
    border: 'none',
    borderBottom: isDisabled ? 'none' : '1px solid #bababa',
    borderRadius: 'none',
    boxShadow: 'none',
    cursor: isDisabled ? 'not-allowed' : 'pointer',
    padding: '0.2vh',
    minHeight: 'auto',
  }),

  valueContainer: (styles, { isDisabled }) => ({
    ...styles,
    flexDirection: isDisabled ? 'column' : styles.flexDirection,
    alignItems: isDisabled ? 'flex-start' : styles.alignItems,
  }),

  multiValue: (styles, { isDisabled }) => ({
    ...styles,
    backgroundColor: isDisabled ? 'transparent' : styles.backgroundColor,
  }),

  multiValueLabel: (styles, { isDisabled }) => ({
    ...styles,
    marginTop: isDisabled ? '-7px' : 'unset',
  }),

  multiValueRemove: (styles, { isDisabled }) => ({
    ...styles,
    display: isDisabled ? 'none' : styles.display,
  }),

  indicatorsContainer: (styles, { isDisabled }) => ({
    ...styles,
    display: isDisabled ? 'none' : styles.display,
  }),

  option: (styles, { isFocused, isSelected }) => ({
    ...styles,
    backgroundColor: isSelected || isFocused ? '#dadada' : '#f4f4f4',
    borderBottom: '1px solid #bababa',
    color: '#000000',
    cursor: 'pointer',
    padding: '10px 16px',
  }),
};

const useStyles = makeStyles({
  root: {
    '&:hover': {
      backgroundColor: 'transparent',
    },
  },
  icon: {
    borderRadius: '50%',
    width: 16,
    height: 16,
    boxShadow:
      'inset 0 0 0 1px rgba(16,22,26,.2), inset 0 -1px 0 rgba(16,22,26,.1)',
    backgroundColor: '#f5f8fa',
    backgroundImage:
      'linear-gradient(180deg,hsla(0,0%,100%,.8),hsla(0,0%,100%,0))',
    '$root.Mui-focusVisible &': {
      outline: '2px auto rgba(19,124,189,.6)',
      outlineOffset: 2,
    },
    'input:hover ~ &': {
      backgroundColor: '#ebf1f5',
    },
    'input:disabled ~ &': {
      boxShadow: 'none',
      background: 'rgba(206,217,224,.5)',
    },
  },
  checkedIcon: {
    borderRadius: '50%',
    width: 16,
    height: 16,
    boxShadow:
      'inset 0 0 0 1px rgba(16,22,26,.2), inset 0 -1px 0 rgba(16,22,26,.1)',
    backgroundColor: '#1d84ff',
    backgroundImage:
      'linear-gradient(180deg,hsla(0,0%,100%,.1),hsla(0,0%,100%,0))',
    '&:before': {
      display: 'block',
      width: 16,
      height: 16,
      backgroundImage: 'radial-gradient(#fff,#fff 28%,transparent 32%)',
      content: '""',
    },
    '$root.Mui-focusVisible &': {
      outline: '2px auto rgba(19,124,189,.6)',
      outlineOffset: 2,
    },
    'input:hover ~ &': {
      backgroundColor: '#1d84ff',
    },
  },
});

export function StyledRadio(props: RadioProps) {
  const classes = useStyles();

  return (
    <Radio
      className={classes.root}
      disableRipple
      color="default"
      checkedIcon={<span className={classes.checkedIcon} />}
      icon={<span className={classes.icon} />}
      {...props}
    />
  );
}

export const FormGroup = ({ inputs }: FormGroupProps) => {
  return (
    <Wrapper>
      {inputs.map(({ type, props }) => {
        switch (type) {
          case 'error-container':
            return (
              <div key={uuidv4()} className="error-container">
                {Object.keys(props?.messages).map(
                  (item): JSX.Element => (
                    <div key={`${item}`}>
                      <CheckCircle
                        className="indicator"
                        style={
                          props?.errorsTypes?.includes(item)
                            ? { color: '#bababa' }
                            : {}
                        }
                      />
                      {props?.messages?.[item]}
                    </div>
                  ),
                )}
              </div>
            );
          case 'password':
          case 'text':
            return (
              <TextInput
                key={props.id}
                type={type}
                {...props}
                // autoComplete="new-password"
              />
            );
          case 'checkbox':
            return (
              <div key={props.id}>
                {props?.label && <label className="label">{props.label}</label>}
                <Select
                  classNamePrefix="custom-select"
                  styles={selectStyles}
                  {...props}
                />
              </div>
            );
          case 'role':
            return <Role key={props.id} {...(props as RoleProps)} />;
          case 'radio':
            return (
              <RadioGroup key={props.groupProps.id} {...props.groupProps}>
                {props.items.map((item: any) => (
                  <>
                    <FormControlLabel control={<StyledRadio />} {...item} />
                    <span className="radio-desc">{item.desc}</span>
                  </>
                ))}
              </RadioGroup>
            );
          default:
            return null;
        }
      })}
    </Wrapper>
  );
};
