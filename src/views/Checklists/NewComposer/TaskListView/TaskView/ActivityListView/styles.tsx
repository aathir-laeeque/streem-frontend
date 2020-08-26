import styled, { css } from 'styled-components';

export const Wrapper = styled.div`
  .activity {
    border-bottom: 1px dashed #dadada;
    padding: 32px;

    :last-child {
      border-bottom: none;
      padding-bottom: 0;
    }

    &-content {
      grid-area: activity-content;

      .optional {
        font-size: 14px;
        line-height: 1.43;
        letter-spacing: 0.16px;
        margin-bottom: 16px;
        color: #999999;
      }
    }
  }
`;
