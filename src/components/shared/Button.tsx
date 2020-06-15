import styled from 'styled-components';

export const Button = styled.button.attrs({
  // style: (props) => props.customStyle || {},
})`
  border-radius: 3px;
  background-color: #12aab3;
  color: #ffffff;
  line-height: 0.75;
  padding: 10px 16px;
  border: none;
  outline: none;
  margin-right: 8px;
  cursor: pointer;
`;
