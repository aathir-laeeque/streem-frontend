import { BaseModal, Checkbox, Button, TextInput } from '#components';
import { JobLogColumnType } from '#PrototypeComposer/checklist.types';
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Search, Clear, DragIndicator } from '@material-ui/icons';
import { debounce, findIndex, orderBy } from 'lodash';
import React, { FC, useEffect, useState } from 'react';
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
          height: 70vh;

          &-left {
            border-right: 1px solid #000;

            .input {
              flex: unset;
              margin-bottom: 16px;
            }
          }

          &-list {
            margin-top: 16px;
            padding: 16px;
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

          &-right {
            overflow: auto;
            h4 {
              font-size: 14px;
              font-weight: 600;
              margin: 0;
            }
            .info {
              font-size: 12px;
              margin-block: 16px 8px;
              align-self: flex-start;
              text-align: left;
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

type Props = {
  columns: JobLogColumnType[];
  selectedColumns: JobLogColumnType[];
  onColumnSelection: (selectedColumns: JobLogColumnType[]) => void;
};

const ConfigureColumnsModal: FC<CommonOverlayProps<Props>> = ({
  closeAllOverlays,
  closeOverlay,
  props: { columns, selectedColumns, onColumnSelection },
}) => {
  const [items, setItems] = useState<JobLogColumnType[]>(
    orderBy(selectedColumns, ['orderTree'], ['asc']),
  );
  const [allItems, setAllItems] = useState<Record<string, any>>({});
  const [searchQuery, setSearchQuery] = useState('');

  const onPrimary = () => {
    closeOverlay();
    onColumnSelection(items.map((column, i) => ({ ...column, orderTree: i + 1 })));
  };

  const onRemoveAll = () => {
    Object.entries(allItems).forEach(([key, column]) => {
      setAllItems((prev) => ({
        ...prev,
        [key]: { ...prev[key], checked: false },
      }));
    });

    setItems([]);
  };

  const handleDragEnd = (e: DragEndEvent) => {
    const { active, over } = e;
    if (over && active.id !== over.id) {
      setItems((items) => {
        const oldIndex = findIndex(items, (item) => {
          if (active.id === `${item.id}_${item.triggerType}`) {
            return true;
          }
          return false;
        });
        const newIndex = findIndex(items, (item) => {
          if (over.id === `${item.id}_${item.triggerType}`) {
            return true;
          }
          return false;
        });
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const parseDataToState = () => {
    const _selectedColumns = items.reduce<Record<string, any>>((acc, column) => {
      acc[`${column.id}_${column.triggerType}`] = {
        ...column,
        checked: true,
      };
      return acc;
    }, {});

    const allColumns = columns.reduce((acc, column) => {
      if (!_selectedColumns?.[`${column.id}_${column.triggerType}`])
        acc[`${column.id}_${column.triggerType}`] = {
          ...column,
          checked: false,
        };
      return acc;
    }, _selectedColumns);

    setAllItems(allColumns);
  };

  useEffect(() => {
    parseDataToState();
  }, []);

  const sensors = useSensors(useSensor(PointerSensor));

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
              {Object.entries(allItems).map(([key, column]) => {
                if (
                  searchQuery &&
                  column.displayName.toLowerCase().search(searchQuery.toLowerCase()) === -1
                )
                  return null;
                return (
                  <Checkbox
                    key={key}
                    checked={column.checked}
                    label={column.displayName}
                    onClick={(e) => {
                      if (e.target.checked) {
                        setItems((prev) => [...prev, column]);
                      } else {
                        setItems((prev) => prev.filter((i) => `${i.id}_${i.triggerType}` !== key));
                      }
                      setAllItems((prev) => ({
                        ...prev,
                        [key]: { ...prev[key], checked: e.target.checked },
                      }));
                    }}
                  />
                );
              })}
            </div>
          </div>
          <div className="section section-right">
            <h4>Selected Columns</h4>
            <span className="info">
              You can rearrange this selected columns (Cannot edit Default columns.)
            </span>
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
              modifiers={[restrictToVerticalAxis]}
            >
              <SortableContext
                items={items.map((i) => ({ ...i, id: `${i.id}_${i.triggerType}` }))}
                strategy={verticalListSortingStrategy}
              >
                {items.map((item) => (
                  <SortableItem key={`${item.id}_${item.triggerType}`} item={item} />
                ))}
              </SortableContext>
            </DndContext>
          </div>
        </div>
      </BaseModal>
    </Wrapper>
  );
};

export default ConfigureColumnsModal;

const SortableItemWrapper = styled.div`
  display: flex;
  align-items: center;
  touch-action: none;
  background-color: #fff;

  svg {
    cursor: pointer;
  }

  .content {
    border-bottom: 1px solid #cccccc;
    display: flex;
    align-items: center;
    padding: 12px;
    flex: 1;

    svg {
      color: #999999;
      outline: none;
      margin-right: 8px;
    }
  }

  &.dragging {
    z-index: 1;
    transition: none;

    * {
      cursor: grabbing;
    }

    scale: 1.02;
    box-shadow: -1px 0 15px 0 rgba(34, 33, 81, 0.01), 0px 15px 15px 0 rgba(34, 33, 81, 0.25);

    &:focus-visible {
      box-shadow: 0 0px 10px 2px #4c9ffe;
    }
  }
`;

function SortableItem({ item }: { item: any }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: `${item.id}_${item.triggerType}`,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <SortableItemWrapper ref={setNodeRef} style={style} className={isDragging ? 'dragging' : ''}>
      <div className="content">
        <DragIndicator {...attributes} {...listeners} />
        <span>{item.displayName}</span>
      </div>
    </SortableItemWrapper>
  );
}
