import styled from 'styled-components';
export const Composer = styled.div`
  background: #fff;
  box-shadow: 0 5px 8px 0 rgba(0, 0, 0, 0.1);
  height: inherit;

  .tab-title {
    font-size: 16px;
    font-weight: normal;
    color: #666666;
    cursor: pointer;
    padding: 16px 32px;
  }

  .tab-active {
    border-bottom: 2px solid #1d84ff;
    color: #1d84ff;
    font-weight: 600;
  }

  .tabs-row {
    display: flex;
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);
    margin-bottom: 8px;
  }
`;
