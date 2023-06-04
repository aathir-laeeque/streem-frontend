import { DataTable, GeneralHeader, LoadingContainer, TabContentProps } from '#components';
import useTabs from '#components/shared/useTabs';
import { useTypedSelector } from '#store';
import { formatDateTime } from '#utils/timeUtils';
import { ViewWrapper } from '#views/Jobs/ListView/styles';
import { RouteComponentProps } from '@reach/router';
import React, { FC, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import { fetchObjectType, resetOntology } from '../actions';
import ObjectList from '../Objects/ObjectList';
// TODO change this enum to Object and have positions defined explicity
export enum FlagPositions {
  SYSTEM,
  PRIMARY,
  TITLE,
  SEARCHABLE,
  MANDATORY,
  AUTOGENERATE,
}
// TODO move this to utils & expose methods for each flag specifically.
export const getBooleanFromDecimal = (flag: number, pos: number) => {
  return ((flag >> pos) & 1) === 1;
};

const ReadOnlyGroupWrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding: 24px 16px;

  .read-only {
    display: flex;
    justify-content: space-between;
    margin-bottom: 24px;

    :last-child {
      margin-bottom: 0px;
    }

    .content {
      font-size: 14x;
      line-height: 1.14;
      color: rgba(51, 51, 51, 1);
      min-width: 150px;
      display: flex;
      align-items: flex-start;

      :last-child {
        flex: 1;
        padding-right: 20px;

        ::before {
          content: ':';
          margin-right: 24px;
        }
      }
    }
  }
`;

export const ReadOnlyGroup = ({
  items,
  ...rest
}: { items: { label: string; value: string }[] } & React.HTMLProps<HTMLDivElement>) => {
  return (
    <ReadOnlyGroupWrapper {...rest}>
      {items.map((item, index) => (
        <div className="read-only" key={index}>
          <span className="content">{item.label}</span>
          <span className="content">{item.value}</span>
        </div>
      ))}
    </ReadOnlyGroupWrapper>
  );
};

const GeneralWrapper = styled.div`
  overflow: auto;

  h4 {
    padding: 16px;
    font-size: 20px;
    font-weight: 600;
    color: #333333;
    margin: unset;
    border-bottom: solid 1px #dadada;
  }

  .view {
    background: #fff;
    margin-bottom: 24px;
  }
`;

const GeneralTabContent: FC<TabContentProps> = ({ label }) => {
  const {
    objectTypes: { active },
  } = useTypedSelector((state) => state.ontology);
  if (!active) return null;
  return (
    <GeneralWrapper>
      <div className="view">
        <h4>Basic Information</h4>
        <ReadOnlyGroup
          items={[
            {
              label: 'ID',
              value: active.externalId,
            },
            {
              label: 'Display Name',
              value: active.displayName,
            },
            {
              label: 'Plural Name',
              value: active.pluralName,
            },
            {
              label: 'Description',
              value: active.description,
            },
            {
              label: 'Added On',
              value: formatDateTime(active.createdAt, 'Do MMMM YYYY, h:mm A'),
            },
          ]}
        />
      </div>
    </GeneralWrapper>
  );
};

const PropertiesTabContent: FC<TabContentProps> = () => {
  const {
    objectTypes: { active },
  } = useTypedSelector((state) => state.ontology);
  const properties = active?.properties || [];

  return (
    <DataTable
      columns={[
        {
          id: 'displayName',
          label: 'Property Name',
          minWidth: 100,
        },
        {
          id: 'inputType',
          label: 'Input Type',
          minWidth: 100,
        },
        {
          id: 'mandatory',
          label: 'Is Mandatory?',
          minWidth: 100,
          format: (item) =>
            getBooleanFromDecimal(item.flags, FlagPositions.MANDATORY) ? 'Yes' : 'No',
        },
        {
          id: 'status',
          label: 'Status',
          minWidth: 100,
          format: (item) => 'Active',
        },
      ]}
      rows={properties}
    />
  );
};

const ObjectTypesContent = ({ id }: RouteComponentProps<{ id: string }>) => {
  const dispatch = useDispatch();
  const {
    objectTypes: { active, activeLoading },
  } = useTypedSelector((state) => state.ontology);

  useEffect(() => {
    if (id) {
      dispatch(fetchObjectType(id));
    }

    return () => {
      dispatch(resetOntology(['objectTypes', 'activeLoading']));
    };
  }, []);

  const { renderTabHeader, renderTabContent } = useTabs({
    tabs: [
      {
        label: 'Objects',
        tabContent: ObjectList,
      },
      { label: 'Basic Information', tabContent: GeneralTabContent },
      {
        label: 'Properties',
        tabContent: PropertiesTabContent,
      },
    ],
  });

  return (
    <ViewWrapper>
      <GeneralHeader heading={`Object Types - ${activeLoading ? '...' : active?.pluralName}`} />
      <div className="list-table">
        {renderTabHeader()}
        <LoadingContainer loading={activeLoading} component={<>{renderTabContent()}</>} />
      </div>
    </ViewWrapper>
  );
};

export default ObjectTypesContent;
