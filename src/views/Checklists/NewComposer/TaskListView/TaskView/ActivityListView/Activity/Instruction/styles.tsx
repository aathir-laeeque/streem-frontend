import styled, { css } from 'styled-components';

export const Wrapper = styled.div`
  .activity-header {
    color: #393939;
    font-size: 12px;
    letter-spacing: 0.32px;
    line-height: 1.33;
  }

  ${(props) =>
    !props.isEditing
      ? css`
          .activity-header {
            display: none;
          }
        `
      : null}
`;
