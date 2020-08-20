import styled from 'styled-components';

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;

  > .new-form-field {
    margin-bottom: 16px;

    :last-child {
      margin-bottom: 0;
    }
  }

  .is-between-values {
    display: flex;
    align-items: center;

    > .new-form-field {
      flex: 1;
    }
  }
`;

export const customSelectStyles = {
  control: (styles) => ({
    ...styles,
    backgroundColor: '#f4f4f4',
    border: 'none',
    borderBottom: '1px solid #bababa',
    borderRadius: 'none',
    boxShadow: 'none',
    padding: '8px',
  }),
  option: (styles, { data, isDisabled, isFocused, isSelected }) => ({
    ...styles,
    backgroundColor: isSelected ? '#dadada' : '#f4f4f4',
    padding: '10px 16px',
    borderBottom: '1px solid #bababa',
    color: '#000000',
  }),
  menu: (styles) => ({ ...styles, padding: 0, margin: 0 }),
};
