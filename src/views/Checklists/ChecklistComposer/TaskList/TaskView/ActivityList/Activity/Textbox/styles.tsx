import styled from 'styled-components';

export const Wrapper = styled.div.attrs({})`
  textarea {
    border: 1px solid #e5e5e5 !important;
    margin-top: 5px;
  }
  textarea::-webkit-input-placeholder {
    text-align: center;
    line-height: 74px;
    color: #a8a8a8;
  }
  textarea:-moz-placeholder {
    text-align: center;
    line-height: 74px;
    color: #a8a8a8;
  }
  textarea::-moz-placeholder {
    text-align: center;
    line-height: 74px;
    color: #a8a8a8;
  }
  textarea:-ms-input-placeholder {
    text-align: center;
    line-height: 74px;
    color: #a8a8a8;
  }
`;
