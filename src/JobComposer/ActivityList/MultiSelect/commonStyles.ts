export const customSelectStyles = {
  control: (styles, { isDisabled }) => ({
    ...styles,
    backgroundColor: '#f4f4f4',
    border: 'none',
    borderBottom: '1px solid #bababa',
    borderRadius: 'none',
    boxShadow: 'none',
    cursor: isDisabled ? 'not-allowed' : 'pointer',
    padding: '8px',
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
