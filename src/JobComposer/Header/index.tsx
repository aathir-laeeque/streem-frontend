import { MandatoryParameter } from '#JobComposer/checklist.types';
import { TargetEntityType } from '#PrototypeComposer/checklist.types';
import { useTypedSelector } from '#store';
import { toggleIsDrawerOpen } from '#store/extras/action';
import { Users } from '#store/users/types';
import { apiGetAllUsersAssignedToJob } from '#utils/apiUrls';
import { request } from '#utils/request';
import { usePrevious } from '#utils/usePrevious';
import {
  AssignedJobStates,
  CompletedJobStates,
  Job,
  JobStateEnum,
} from '#views/Jobs/ListView/types';
import { FiberManualRecord, KeyboardArrowDown, KeyboardArrowUp, Menu } from '@material-ui/icons';
import React, { FC, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import JobHeaderButtons from './JobHeaderButtons';
import Wrapper, { LabelValueRow } from './styles';

const Header: FC<{
  infoExpanded: [boolean, React.Dispatch<React.SetStateAction<boolean>>];
  overviewOpen: [boolean, React.Dispatch<React.SetStateAction<boolean>>];
}> = ({ infoExpanded, overviewOpen }) => {
  const dispatch = useDispatch();
  const [isInfoExpanded, setInfoExpanded] = infoExpanded;
  const [assignedUsers, setAssignedUsers] = useState<Users | undefined>(undefined);
  const [isLoggedInUserAssigned, setIsLoggedInUserAssigned] = useState(false);
  const {
    composer: { jobState, data },
    auth: { profile },
  } = useTypedSelector((state) => state);
  const { id: jobId, checklist } = (data as Job) ?? {};
  const prevJobState = usePrevious(jobState);
  const getAssignments = async () => {
    if (jobId) {
      const response: { data: Users; errors: { message: string }[] } = await request(
        'GET',
        apiGetAllUsersAssignedToJob(jobId),
      );
      if (response.data) {
        setAssignedUsers(response.data);
        setIsLoggedInUserAssigned(response.data.some((user) => user.id === profile?.id));
      } else {
        console.error('error came in fetch assigned users from component :: ', response.errors);
      }
    }
  };

  useEffect(() => {
    getAssignments();
  }, [jobId]);

  useEffect(() => {
    if (prevJobState === JobStateEnum.UNASSIGNED && jobState === JobStateEnum.ASSIGNED)
      getAssignments();
  }, [jobState]);

  const content = (parameter: any) => {
    let contentString;

    switch (parameter.type) {
      case MandatoryParameter.SHOULD_BE:
      case MandatoryParameter.MULTI_LINE:
      case MandatoryParameter.SINGLE_LINE:
      case MandatoryParameter.NUMBER:
      case MandatoryParameter.DATE:
      case MandatoryParameter.DATE_TIME:
        contentString = parameter.response.value;
        break;
      case MandatoryParameter.YES_NO:
        contentString = contentDetails(parameter);
        break;
      case MandatoryParameter.SINGLE_SELECT:
        contentString = contentDetails(parameter);
        break;
      case MandatoryParameter.RESOURCE:
        contentString = parameter.response.choices.reduce(
          (acc: any, currChoice: any) =>
            (acc = `${currChoice.objectDisplayName} (ID: ${currChoice.objectExternalId})`),
          '',
        );
        break;

      case MandatoryParameter.MULTI_RESOURCE:
        contentString = parameter?.response?.choices
          .reduce(
            (acc: any, currChoice: any) =>
              (acc =
                acc + `${currChoice.objectDisplayName} (ID: ${currChoice.objectExternalId})\n`),
            '',
          )
          ?.split('\n')
          ?.map((str: any) => <p>{str}</p>);
        break;
      case MandatoryParameter.MULTISELECT:
        contentString = contentDetails(parameter);
        break;
      default:
        return;
    }

    return contentString;
  };

  const contentDetails = ({ data, response }: any) => {
    let detailList: any[] = [];
    data.forEach((currData: any) => {
      if (response.choices[currData.id] === 'SELECTED') {
        return detailList.push(`${currData.name}${response.reason ? ` :${response.reason}` : ''}`);
      }
    });
    return detailList.join(', ');
  };

  const isInboxView = location.pathname.split('/')[1] === 'inbox';
  const isJobBlocked = jobState === AssignedJobStates.BLOCKED;
  const isJobStarted = jobState === AssignedJobStates.IN_PROGRESS;
  const isJobCompleted = jobState === CompletedJobStates.COMPLETED;
  const isCompletedWithException = jobState === CompletedJobStates.COMPLETED_WITH_EXCEPTION;

  const jobStateTitle = isJobCompleted
    ? 'Completed'
    : isCompletedWithException
    ? 'Completed with Exception'
    : isJobBlocked
    ? 'Approval Pending'
    : isJobStarted
    ? 'Started'
    : 'Not Started';

  return (
    <Wrapper isInfoExpanded={isInfoExpanded} style={{ zIndex: 2 }}>
      <div className="main-header">
        <div className="drawer-toggle" onClick={() => dispatch(toggleIsDrawerOpen())}>
          <Menu />
        </div>
        <div className="job-primary-header">
          <div>
            <div className="checklist-name">{checklist?.name}</div>
            <div className="job-state">
              <FiberManualRecord
                className="icon"
                style={{
                  fontSize: '8px',
                  marginRight: '8px',
                  color: isJobCompleted ? '#5aa700' : isJobStarted ? '#1d84ff' : '#f7b500',
                }}
              />
              <div>{jobStateTitle}</div>
            </div>
          </div>
          <JobHeaderButtons
            jobData={data}
            jobState={jobState}
            isInboxView={isInboxView}
            isLoggedInUserAssigned={isLoggedInUserAssigned}
            profile={profile}
            overviewOpen={overviewOpen}
          />
        </div>
        <div className="expand-job-meta" onClick={() => setInfoExpanded((prev) => !prev)}>
          {isInfoExpanded ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
        </div>
      </div>
      <div className="job-info">
        <div className="content">
          <h4>Process Information</h4>
          <LabelValueRow style={{ paddingBottom: 16, borderBottom: '1px solid #E0E0E0' }}>
            {[
              { label: 'Checklist Name', value: data?.checklist.name },
              { label: 'Checklist ID', value: data?.checklist.code },
            ].map(({ label, value }) => (
              <div className="info-item" key={label}>
                <label className="info-item-label">{label}</label>
                <span className="info-item-value">{value}</span>
              </div>
            ))}
          </LabelValueRow>
          {data?.parameterValues?.length > 0 && (
            <>
              <h4>Job Information</h4>
              <LabelValueRow>
                <div className="info-item" key={'Job ID'}>
                  <label className="info-item-label">Job ID</label>
                  <span className="info-item-value">{data?.code}</span>
                </div>
                {(data?.parameterValues || [])
                  .reduce((acc: any, parameter: any) => {
                    if (parameter.targetEntityType === TargetEntityType.PROCESS) {
                      acc.push({
                        label: parameter.label,
                        value: content(parameter),
                      });
                    }
                    return acc;
                  }, [])
                  .map(({ label, value }) => (
                    <div className="info-item" key={label}>
                      <label className="info-item-label">{label}</label>
                      <span className="info-item-value">{value}</span>
                    </div>
                  ))}
              </LabelValueRow>
            </>
          )}
        </div>
      </div>
    </Wrapper>
  );
};

export default Header;
