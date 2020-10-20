import styled from 'styled-components';

const ActivityWrapper = styled.div.attrs({
  className: 'activity',
})`
  border-bottom: 1px dashed #dadada;
  padding: 32px;
  position: relative;

  :last-child {
    border-bottom: none;
  }

  #delete {
    position: absolute;
    right: 32px;
    top: 32px;
    z-index: 1;
  }
`;

const ChecklistWrapper = styled.div.attrs({
  className: 'activity-checklist',
})`
  .checklist-list {
    list-style-type: none;
    margin: 0;
    margin-top: 16px;
    padding: 0;

    &-item {
      align-items: center;
      display: flex;

      .input {
        #before-icon {
          color: #000000;
        }
      }

      #remove-item {
        margin-left: 16px;
      }
    }
  }
`;

const MediaWrapper = styled.div.attrs({
  className: 'activity-media',
})`
  display: flex;
  margin-top: 24px;

  .card {
    align-items: center;
    background-color: #f4f4f4;
    border: 1px dashed #dadada;
    border-radius: 4px;
    cursor: not-allowed;
    display: flex;
    flex: 1;
    flex-direction: column;
    justify-content: center;
    margin-right: 24px;
    padding: 24px;

    :last-child {
      margin-right: 0;
    }

    > .icon {
      font-size: 48px;
      cursor: not-allowed;
    }

    span {
      color: #999999;
      font-size: 14px;
      margin-top: 8px;
    }
  }
`;

const MultiSelectWrapper = styled.div.attrs({
  className: 'activity-multiselect',
})`
  .options-list {
    list-style-type: none;
    margin: 0;
    margin-top: 8px;
    padding: 0;

    &-item {
      align-items: center;
      display: flex;

      .input {
        #before-icon {
          color: #000000;
        }
      }

      #remove-item {
        margin-left: 16px;
      }
    }
  }
`;

const ParameterWrapper = styled.div.attrs({
  className: 'activity-parameter',
})`
  display: flex;
  flex-direction: column;

  > .input {
    :not(:first-child) {
      margin-top: 16px;
    }
  }

  .select {
    margin-top: 16px;
  }

  .between-values {
    align-items: center;
    display: flex;
    margin-top: 16px;

    span {
      margin: 24px 12px 0;
    }
  }
`;

const SignatureWrapper = styled.div.attrs({
  className: 'activity-signature',
})`
  align-items: center;
  background-color: #fafafa;
  border: 1px dashed #bababa;
  border-radius: 4px;
  cursor: not-allowed;
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-top: 24px;
  padding: 80px;

  > .icon {
    font-size: 48px;
    margin-bottom: 8px;
    cursor: not-allowed;
  }
`;

const TextboxWrapper = styled.div.attrs({
  className: 'activity-textbox',
})`
  label {
    color: #000000;
    display: block;
    font-size: 12px;
    margin-bottom: 12px;
  }

  .textbox {
    align-items: center;
    background-color: #fafafa;
    border-radius: 4px;
    color: #999999;
    cursor: not-allowed;
    display: flex;
    justify-content: center;
    padding: 90px;
  }
`;

const YesNoWrapper = styled.div.attrs({
  className: 'activity-yes-no',
})`
  display: flex;
  flex-direction: column;

  .options-container {
    display: flex;
    margin-top: 12px;

    > .input {
      :first-child {
        margin-right: 24px;

        .input-wrapper {
          border-bottom-color: #5aa700;
          background-color: #e1fec0;

          :focus-within {
            border-color: #5aa700;
          }
        }
      }

      :last-child {
        .input-wrapper {
          border-bottom-color: #ff6b6b;
          background-color: #ffebeb;

          :focus-within {
            border-color: #ff6b6b;
          }
        }
      }
    }
  }
`;

const InstructionWrapper = styled.div.attrs({
  className: 'activity-instruction',
})``;

const MaterialWrapper = styled.div.attrs({
  className: 'activity-material',
})`
  display: flex;
  flex-direction: column;

  .material-list {
    counter-reset: item;
    list-style-type: none;
    margin: 0;
    margin-top: 16px;
    padding: 0;

    &-item {
      align-items: center;
      display: flex;
      list-style-position: inside;
      margin-bottom: 8px;

      :last-child {
        margin-bottom: 0;
      }

      &::before {
        color: #000000;
        content: counter(item) ' ';
        counter-increment: item;
        font-size: 14px;
        margin-right: 12px;
      }

      .image-wrapper {
        align-items: center;
        background-color: #f4f4f4;
        cursor: pointer;
        display: flex;
        justify-content: center;
        margin-right: 12px;
        padding: 8px;

        &.default {
          height: 56px;
          width: 56px;
        }

        .image {
          height: 40px;
          width: 40px;
        }
      }

      .input {
        margin-right: 12px;
      }

      .quantity-control {
        align-items: center;
        background-color: #f4f4f4;
        display: flex;

        span {
          border: 1px solid transparent;
          border-bottom-color: #bababa;
          padding: 10px;
          text-align: center;
          width: 50px;
        }
      }

      #remove-item {
        margin-left: 12px;
      }
    }
  }
`;

export {
  ActivityWrapper,
  ChecklistWrapper,
  MediaWrapper,
  MultiSelectWrapper,
  ParameterWrapper,
  SignatureWrapper,
  TextboxWrapper,
  YesNoWrapper,
  InstructionWrapper,
  MaterialWrapper,
};
