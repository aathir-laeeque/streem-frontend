import { Properties } from '#store/properties/types';
import { ArrowDropDown, Search } from '@material-ui/icons';
import NestedMenuItem from '#components/shared/NestedMenuItem';
import Menu from '@material-ui/core/Menu';
import React, { FC, useState } from 'react';
import { SessionActivity } from '#views/UserAccess/ListView/SessionActivity/types';
import { Checklist } from '#views/Checklists/types';
import { User } from '#store/users/types';
import { Job } from '#views/Jobs/NewListView/types';
import styled from 'styled-components';
import { Button, FlatButton } from './Button';

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

interface ListViewProps {
  properties: Properties;
  data:
    | Checklist[]
    | Job[]
    | User[]
    | Record<string, string | SessionActivity[]>[];
  beforeColumns?: {
    header: string;
    template: (item: any, index: number) => JSX.Element;
  }[];
  afterColumns?: {
    header: string;
    template: (item: any, index: number) => JSX.Element;
  }[];
}

const Wrapper = styled.div.attrs({})`
  height: inherit;

  .flex-1 {
    flex: 1 !important;
  }

  .list-header {
    background-color: #dadada;
    display: flex;
  }

  .list-options {
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);
    display: flex;
    padding: 8px 16px;
    align-items: center;
    border-top: 1px solid #dadada;
  }

  .list-body {
    overflow-x: auto;
    overflow-y: auto;
    height: 330px;
    max-height: 500px;
  }

  .list-card {
    border-bottom: 1px solid #dadada;
    display: flex;
    background-color: #f4f4f4;
  }

  .list-header-columns {
    flex: 2;
    font-size: 14px;
    color: #000000;
    flex-wrap: wrap;
    font-weight: bold;
    letter-spacing: 0.16px;
    line-height: 1.29;
    padding: 24px 16px;
    overflow-wrap: anywhere;
    display: flex;
    align-items: center;
    justify-content: flex-start;
  }

  .list-card-columns {
    flex: 2;
    flex-wrap: wrap;
    font-size: 14px;
    color: #000000;
    padding: 24px 16px;
    overflow-wrap: anywhere;
    display: flex;
    align-items: center;
  }

  .list-title {
    align-items: center;
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

  .searchboxwrapper {
    position: relative;
    margin-right: 16px;
  }

  .searchbox {
    border: none;
    border-bottom: 1px solid #999999;
    outline: none;
    font-size: 13px;
    font-family: 'Open Sans', sans-serif;
    font-weight: lighter;
    color: #999999;
    width: 180px;
    height: 29px;
    background: #fff;
    padding-left: 10px;
  }

  .searchsubmit {
    width: 14px;
    height: 29px;
    position: absolute;
    top: 0;
    right: 0;
    background: #fff;
    border: none;
    border-bottom: 1px solid #999999;
    color: #999999;
    cursor: pointer;
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
          beforeColumns.map((beforeColumn) => (
            <div
              key={`beforeColumn_${beforeColumn.header}`}
              className="list-header-columns"
            >
              {beforeColumn.header}
            </div>
          ))}
        {properties.map((el) => (
          <div key={`property_${el.id}`} className="list-header-columns">
            {el.name}
          </div>
        ))}
        {afterColumns &&
          afterColumns.length &&
          afterColumns.map((afterColumn) => (
            <div
              key={`afterColumn_${afterColumn.header}`}
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
          <div key={`list_el_${el.id}`} className="list-card">
            {beforeColumns &&
              beforeColumns.length &&
              beforeColumns.map((beforeColumn) =>
                beforeColumn.template(el, index),
              )}
            {properties.map((property) => (
              <div
                key={`${el.id}_property_${property.id}`}
                className="list-card-columns"
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
