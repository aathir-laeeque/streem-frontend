import styled from 'styled-components';

interface ButtonProps {
  type?: string;
}

export const Button = styled.button.attrs<ButtonProps>(
  ({ type, disabled = false }) => ({
    // style: (props) => props.customStyle || {},
    disabled,
    type: type ? type : 'button',
  }),
)<ButtonProps>`
  border-radius: 3px;
  background-color: #12aab3;
  color: #ffffff;
  line-height: 0.75;
  padding: 10px 16px;
  border: none;
  outline: none;
  margin-right: 8px;
  cursor: pointer;
  :disabled {
    opacity: 0.4;
    cursor: unset;
  }
`;

export const FlatButton = styled.button.attrs({
  // style: (props) => props.customStyle || {},
})`
  border-radius: 3px;
  background-color: #fff;
  border: 1px solid #12aab3;
  color: #12aab3;
  display: flex;
  align-items: center;
  line-height: 0.75;
  cursor: pointer;
  padding: 5px 8px 5px 16px;
  outline: none;
  font-size: 14px;
  margin-right: 16px;
`;
