import styled, { css } from 'styled-components';

export const Wrapper = styled.div`
  .activity {
    display: grid;

    ${(props) =>
      props.isEditing
        ? css`
            grid-template-areas: 'position-control activity-content activity-icons';
            grid-template-columns: 24px 1fr 24px;
            grid-column-gap: 16px;
          `
        : css`
            grid-template-areas: 'activity-content';
            grid-template-columns: 1fr;
            grid-column-gap: 16px;
          `}

    margin-bottom: 24px;

    :first-child {
      margin-top: 24px;

      .arrow-up {
        visibility: hidden;
      }
    }

    :last-child {
      .arrow-down {
        visibility: hidden;
      }
    }

    &-position-control {
      grid-area: position-control;
    }

    &-content {
      grid-area: activity-content;

      border: 1px solid transparent;
      border-radius: 4px;
      box-shadow: 0 1px 5px 0 rgba(0, 0, 0, 0.12),
        0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 3px 1px -2px rgba(0, 0, 0, 0.2);
      padding: 16px;

      &.active {
        border-color: #1d84ff;
      }
    }

    &-icons {
      grid-area: activity-icons;
    }
  }
`;
