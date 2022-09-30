import { BaseModal, Checkbox, Button, TextInput } from '#components';
import { Search, Clear } from '@material-ui/icons';
import { debounce } from 'lodash';
import React, { FC, useState } from 'react';
import styled from 'styled-components';
import { CommonOverlayProps } from './types';

const Wrapper = styled.div`
  .modal {
    width: calc(100vw - 40vw);
    padding: 0;

    &-body {
      padding: 0 !important;

      .body {
        display: flex;

        .section {
          flex-direction: column;
          display: flex;
          flex: 1;
          padding: 16px 16px 0;

          &-left {
            border-right: 1px solid #000;
          }

          &-list {
            margin-top: 16px;
            padding: 16px;
            max-height: 60vh;
            overflow: auto;

            .checkbox-input {
              padding-block: 16px 8px;
              border-top: 1px solid #d9d9d9;

              :first-child {
                border-top: none;
                padding-top: 0;
              }

              .container {
                text-align: left;
                font-size: 14px;
                color: #000;
              }

              .checkmark {
                border-radius: 0px;
                border-color: #333;
                background-color: #fff;
                border-width: 2px;
              }

              .container input:checked ~ .checkmark {
                background-color: #1d84ff;
                border: none;
              }

              .container input:disabled ~ .checkmark {
                background-color: #eeeeee;
                border: none;
              }
            }
          }
        }
      }
    }

    &-footer {
      justify-content: space-between;
    }
  }
`;

type Column = {
  id: string;
  label: string;
};

type Props = {
  columns: Column[];
  unSelectedColumnIds: Record<string, boolean>;
  onColumnSelection: (unSelectedColumnIds: Record<string, boolean>) => void;
};

const ConfigureColumnsModal: FC<CommonOverlayProps<Props>> = ({
  closeAllOverlays,
  closeOverlay,
  props: { columns, unSelectedColumnIds = {}, onColumnSelection },
}) => {
  const [unSelectedIds, setUnSelectedIds] = useState(unSelectedColumnIds);
  const [searchQuery, setSearchQuery] = useState('');

  const onPrimary = () => {
    closeOverlay();
    onColumnSelection(unSelectedIds);
  };

  const onRemoveAll = () => {
    setUnSelectedIds(
      columns.reduce<Record<string, boolean>>((acc, column) => {
        acc[column.id] = true;
        return acc;
      }, {}),
    );
  };

  return (
    <Wrapper>
      <BaseModal
        closeAllModals={closeAllOverlays}
        closeModal={closeOverlay}
        title="Configure Columns"
        secondaryText="Cancel"
        primaryText="OK"
        onSecondary={closeOverlay}
        onPrimary={onPrimary}
        modalFooterOptions={
          <Button variant="textOnly" onClick={onRemoveAll}>
            Remove All Columns
          </Button>
        }
      >
        <div className="body">
          <div className="section section-left">
            <TextInput
              BeforeElement={Search}
              AfterElement={Clear}
              afterElementClass="clear"
              afterElementWithoutError
              defaultValue={searchQuery}
              name="search-filter"
              onChange={debounce(({ value }) => setSearchQuery(value), 500)}
              placeholder="Search column name"
              autoComplete="off"
            />
            <div className="section-list">
              {columns.map((column) => {
                if (
                  searchQuery &&
                  column.label.toLowerCase().search(searchQuery.toLowerCase()) === -1
                )
                  return null;
                return (
                  <Checkbox
                    key={column.id}
                    checked={!unSelectedIds?.[column.id]}
                    label={column.label}
                    onClick={() => {
                      const _unSelectedIds = { ...unSelectedIds };
                      if (_unSelectedIds?.[column.id]) {
                        delete _unSelectedIds[column.id];
                      } else {
                        _unSelectedIds[column.id] = true;
                      }
                      setUnSelectedIds(_unSelectedIds);
                    }}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </BaseModal>
    </Wrapper>
  );
};

export default ConfigureColumnsModal;
