import { Property } from '#store/properties/types';
import { User } from '#store/users/types';
import { Checklist } from '#views/Checklists/types';
import { Job } from '#views/Jobs/NewListView/types';
import React, { FC } from 'react';
import styled from 'styled-components';

export type NewFilter = {
  label: string;
  content: JSX.Element | (() => JSX.Element);
  onApply: () => void;
};

export type NewFilterProp = {
  filters: NewFilter[];
  onReset: () => void;
  activeCount: number;
};

export type ExtraColumn = {
  header: string;
  template: (item: Checklist | Job | User, index: number) => JSX.Element;
};

interface ListViewProps {
  properties: Property[];
  data: Checklist[] | Job[] | User[];
  beforeColumns?: ExtraColumn[];
  afterColumns?: ExtraColumn[];
}

const Wrapper = styled.div.attrs({})`
  overflow: hidden;
  height: 100%;

  .flex-1 {
    flex: 1 !important;
  }

  .list-header {
    background-color: #dadada;
    display: flex;
    min-height: 48px;
  }

  .list-body {
    overflow: auto;
    max-height: calc(100% - 48px);
  }

  .list-card {
    display: flex;
    flex: 1;
    background-color: #f4f4f4;

    :hover {
      background-color: #eeeeee;
    }
  }

  .list-header-columns {
    flex: 1;
    margin: 8px;
    font-size: 14px;
    color: #000000;
    font-weight: bold;
    letter-spacing: 0.16px;
    line-height: 1.14;
    display: flex;
    overflow: hidden;
    align-items: center;

    :first-child {
      flex: 1.25;
    }
  }

  .list-card-columns {
    flex: 1;
    font-size: 14px;
    letter-spacing: 0.16px;
    line-height: 1.14;
    color: #000000;
    margin: 16px 8px;
    display: flex;
    overflow: hidden;
    align-items: center;
    word-break: break-all;

    :first-child {
      flex: 1.25;
    }
  }

  .list-title {
    display: flex;
    text-transform: capitalize;

    :hover {
      color: #1d84ff;
      cursor: pointer;
    }
  }

  .title-group {
    display: flex;
    flex-direction: column;
  }

  .list-code {
    padding-bottom: 4px;
    font-size: 14px;
    line-height: 14px;
    color: #333333;
  }

  .resetOption {
    cursor: pointer;
    color: #1d84ff;
    font-size: 11px;
    font-weight: 600;
    font-style: italic;
  }

  .user-thumb {
    width: 34px;
    height: 34px;
    border-radius: 17px;
    border: solid 1.5px #fff;
    align-items: center;
    background-color: #f7f9fa;
    justify-content: center;
    display: flex;
    color: #1d84ff;
    margin-right: -5px;
    font-size: 13px;
    cursor: pointer;
  }
`;

export const NewListView: FC<ListViewProps> = ({
  properties,
  data,
  beforeColumns,
  afterColumns,
}) => {
  return (
    <Wrapper>
      <div className="list-header">
        {beforeColumns &&
          beforeColumns.length &&
          beforeColumns.map((beforeColumn, idx) => (
            <div
              key={`beforeColumn_${beforeColumn.header}-${idx}`}
              className="list-header-columns"
            >
              {beforeColumn.header}
            </div>
          ))}
        {properties.map((el, idx) => (
          <div
            key={`property_${el.id}-${idx}`}
            className="list-header-columns"
            // style={{ flex: 0.7 }}
          >
            {el.placeHolder}
          </div>
        ))}
        {afterColumns &&
          afterColumns.length &&
          afterColumns.map((afterColumn, idx) => (
            <div
              key={`afterColumn_${afterColumn.header}-${idx}`}
              className={`list-header-columns ${
                !afterColumn.header ? 'flex-1' : ''
              }`}
            >
              {afterColumn.header}
            </div>
          ))}
      </div>
      <div className="list-body">
        {(data as Array<Checklist | Job>).map((el, index) => (
          <div key={`list_el_${el.id}-${index}`} className="list-card">
            {beforeColumns &&
              beforeColumns.length &&
              beforeColumns.map((beforeColumn) =>
                beforeColumn.template(el, index),
              )}
            {properties.map((property) => (
              <div
                key={`${el.id}_property_${property.id}`}
                className="list-card-columns"
                // style={{ flex: 0.7 }}
              >
                {el.properties &&
                property &&
                property.name &&
                el.properties[property.name]
                  ? el.properties[property.name]
                  : '-N/A-'}
              </div>
            ))}
            {afterColumns &&
              afterColumns.length &&
              afterColumns.map((afterColumn) =>
                afterColumn.template(el, index),
              )}
          </div>
        ))}
      </div>
    </Wrapper>
  );
};
