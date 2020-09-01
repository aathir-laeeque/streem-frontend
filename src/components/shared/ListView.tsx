import { Properties } from '#store/properties/types';
import { ArrowDropDown, Search } from '@material-ui/icons';
import React, { FC, useEffect, useRef } from 'react';
import { Checklist } from '#views/Checklists/types';
import { Users } from '#store/users/types';
import { Job } from '#views/Jobs/types';
import styled from 'styled-components';

import { Button, FlatButton } from './Button';

// TODO Either make it horizontal scrollable or remove the commented section and table styles.

interface ListViewProps {
  primaryButtonText: string;
  onPrimaryClick?: () => void;
  properties: Properties;
  data: Checklist[] | Job[] | Users;
  fetchData: (page: number, size: number) => void;
  isLast: boolean;
  currentPage: number;
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

  .list-header {
    display: flex;
    padding: 13px 0px 13px 0px;
    border-bottom: 1px solid #999999;
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
    height: calc(100% - 88px);
  }

  .list-card {
    border-bottom: 1px solid #dadada;
    height: 80px;
    display: flex;
  }

  .list-header-columns {
    flex: 1;
    font-size: 12px;
    color: #999999;
    font-weight: bold;
    letter-spacing: 1px;
    padding: 0 4px;
    overflow-wrap: anywhere;
    display: flex;
    align-items: center;

    :first-child {
      width: 30%;
      flex: initial;
    }
  }

  .list-card-columns {
    flex: 1;
    font-size: 14px;
    color: #666666;
    padding: 0 4px;
    font-weight: 600;
    overflow-wrap: anywhere;
    display: flex;
    align-items: center;

    :first-child {
      width: 30%;
      flex: initial;
    }
  }

  .list-title {
    font-size: 20px;
    font-weight: 600;
    color: #1d84ff;
    cursor: pointer;
  }

  .title-group {
    display: flex;
    margin-top: -10px;
    flex-direction: column;
  }

  .list-code {
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

  .table-td {
    white-space: nowrap;
    min-width: 150px;
    font-size: 14px;
    color: #666666;
    padding: 0 4px;
    font-weight: 600;
  }

  .table {
  }

  .table-tr {
  }

  .table-th {
    font-size: 12px;
    color: #999999;
    font-weight: bold;
    letter-spacing: 1px;
    padding: 0 4px;
  }

  .table-thead {
    border-bottom: 1px solid #999999;
    padding: 13px 0px 13px 0px;
  }

  .table-tbody {
    tr {
      border-bottom: 1px solid #dadada;
      height: 80px;
    }
  }
`;

export const ListView: FC<ListViewProps> = ({
  primaryButtonText,
  onPrimaryClick = () => console.log('clicked'),
  properties,
  data,
  fetchData,
  isLast,
  currentPage,
  beforeColumns,
  afterColumns,
}) => {
  const scroller = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (scroller && scroller.current) {
      const div = scroller.current;
      div.addEventListener('scroll', handleOnScroll);
      return () => {
        div.removeEventListener('scroll', handleOnScroll);
      };
    }
  }, [isLast]);

  const handleOnScroll = (e: Record<string, any>) => {
    if (scroller && scroller.current && e.target) {
      if (
        e.target.scrollTop + e.target.clientHeight >= e.target.scrollHeight &&
        !isLast
      ) {
        fetchData(currentPage + 1, 10);
      }
    }
  };

  return (
    <Wrapper>
      <div style={{ height: '100%' }}>
        <div className="list-options">
          <FlatButton>
            Filters <ArrowDropDown style={{ fontSize: 20, color: '#1d84ff' }} />
          </FlatButton>
          <div className="searchboxwrapper">
            <input className="searchbox" type="text" placeholder="Search" />
            <Search className="searchsubmit" />
          </div>
          <span className="resetOption">Reset</span>
          <Button
            style={{ marginLeft: `auto`, marginRight: 0 }}
            onClick={onPrimaryClick}
          >
            {primaryButtonText}
          </Button>
        </div>
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
          {properties.map((el, index) => (
            <div key={index} className="list-header-columns">
              {el.name}
            </div>
          ))}
          {afterColumns &&
            afterColumns.length &&
            afterColumns.map((afterColumn) => (
              <div
                key={`beforeColumn_${afterColumn.header}`}
                className="list-header-columns"
              >
                {afterColumn.header}
              </div>
            ))}
        </div>
        <div className="list-body" ref={scroller}>
          {(data as Array<Checklist | Job>).map((el, index) => (
            <div key={`list_el_${el.id}`} className="list-card">
              {beforeColumns &&
                beforeColumns.length &&
                beforeColumns.map((beforeColumn) =>
                  beforeColumn.template(el, index),
                )}
              {properties.map((property, propertyIndex) => (
                <div key={propertyIndex} className="list-card-columns">
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
      </div>
      {/* <table className="table">
        <thead className="table-thead">
          <tr className="table-tr">
            {properties.map((el, index) => (
              <th key={index} className="table-th">
                {el.name}
              </th>
            ))}
            {properties.map((el, index) => (
              <th key={index} className="table-th">
                {el.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="table-tbody">
          {(data as Array<Checklist | Job>).map((el, index) => (
            <tr className="table-tr" key={`list_el_${el.id}`}>
              {properties.map((property, propertyIndex) => (
                <td key={propertyIndex} className="table-td">
                  The following style rules collapse the table borders and align
                  the table header text to left.
                </td>
              ))}
              {properties.map((property, propertyIndex) => (
                <td key={propertyIndex} className="table-td">
                  The following style rules collapse the table borders and align
                  the table header text to left.
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table> */}
    </Wrapper>
  );
};
