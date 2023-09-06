export const customSelectStyles = {
  control: (styles, { isDisabled }) => ({
    ...styles,
    backgroundColor: '#fff',
    border: '1px solid #E0E0E0',
    borderRadius: 'none',
    boxShadow: 'none',
    cursor: isDisabled ? 'not-allowed' : 'pointer',
    padding: '2.7px 8px',
  }),

  option: (styles, { isFocused, isSelected }) => ({
    ...styles,
    backgroundColor: isSelected || isFocused ? '#dadada' : '#f4f4f4',
    borderBottom: '1px solid #bababa',
    color: '#000000',
    cursor: 'pointer',
    padding: '10px 16px',
  }),

  menu: (provided) => ({
    ...provided,
    zIndex: 2,
  }),
};
