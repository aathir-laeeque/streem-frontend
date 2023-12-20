import { openOverlayAction } from '#components/OverlayContainer/actions';
import { OverlayNames } from '#components/OverlayContainer/types';
import { useTypedSelector } from '#store';
import { toggleIsDrawerOpen } from '#store/extras/action';
import { JOB_STATES } from '#types';
import { getParameterContent } from '#utils/parameterUtils';
import { FiberManualRecord, KeyboardArrowDown, KeyboardArrowUp, Menu } from '@material-ui/icons';
import React, { FC, useState } from 'react';
import { useDispatch } from 'react-redux';
import JobHeaderButtons from './Buttons';
import JobHeaderWrapper, { LabelValueRow } from './styles';
import { navigate } from '@reach/router';
import KeyboardArrowLeftOutlinedIcon from '@material-ui/icons/KeyboardArrowLeftOutlined';

const JobHeader: FC = () => {
  const dispatch = useDispatch();
  const {
    job: {
      processCode,
      processName,
      state,
      id: jobId,
      showVerificationBanner,
      cjfValues,
      parameters,
      code,
      isInboxView,
    },
    auth: { userId },
  } = useTypedSelector((state) => state);

  const [isInfoExpanded, setInfoExpanded] = useState(false);

  if (!state) return null;

  return (
    <JobHeaderWrapper isInfoExpanded={isInfoExpanded}>
      <div className="main-header">
        <div className="drawer-toggle" onClick={() => dispatch(toggleIsDrawerOpen())}>
          <Menu />
        </div>
        <div className="job-primary-header">
          <div style={{ display: 'flex', gap: '8px' }}>
            <KeyboardArrowLeftOutlinedIcon
              style={{ cursor: 'pointer' }}
              onClick={() => {
                if (isInboxView) {
                  navigate('/inbox');
                } else {
                  navigate('/jobs');
                }
              }}
            />
            <div>
              <div className="checklist-name">{processName}</div>
              <div className="job-state">
                <FiberManualRecord
                  className="icon"
                  style={{
                    fontSize: '8px',
                    marginRight: '8px',
                    color: JOB_STATES[state].color,
                  }}
                />
                <div>{JOB_STATES[state].title}</div>
              </div>
            </div>
          </div>
          <JobHeaderButtons />
        </div>
        <div className="expand-job-meta in-active" onClick={() => setInfoExpanded((prev) => !prev)}>
          <KeyboardArrowDown />
        </div>
      </div>
      {showVerificationBanner && (
        <div className="verification-banner">
          This Job has some Parameters Pending Verification by you &nbsp;
          <span
            onClick={() => {
              dispatch(
                openOverlayAction({
                  type: OverlayNames.JOB_VERIFICATION,
                  props: {
                    jobId,
                    userId: userId,
                    redirectedFromBanner: true,
                  },
                }),
              );
            }}
          >
            View Them
          </span>
        </div>
      )}
      <div className="job-info">
        <div className="content">
          <div className="meta-content">
            <h4>Process Information</h4>
            <LabelValueRow style={{ paddingBottom: 16, borderBottom: '1px solid #E0E0E0' }}>
              {[
                { label: 'Process Name', value: processName },
                { label: 'Process ID', value: processCode },
              ].map(({ label, value }) => (
                <div className="info-item" key={label}>
                  <label className="info-item-label">{label}</label>
                  <span className="info-item-value">{value}</span>
                </div>
              ))}
            </LabelValueRow>
            <h4>Job Information</h4>
            <LabelValueRow>
              <div className="info-item" key={'Job ID'}>
                <label className="info-item-label">Job ID</label>
                <span className="info-item-value">{code}</span>
              </div>
              {cjfValues?.map((parameterId) => {
                const parameter = parameters.get(parameterId)!;
                // parameter response is an array of responses and in case of CJF there will always be only one response.
                const cjfParameter = { ...parameter, response: parameter.response[0] };
                const value = getParameterContent(cjfParameter);
                return !parameter.response[0].hidden ? (
                  <div className="info-item" key={parameter.label}>
                    <label className="info-item-label">{parameter.label}</label>
                    <span className="info-item-value" title={value}>
                      {value}
                    </span>
                  </div>
                ) : null;
              })}
            </LabelValueRow>
          </div>
          <div className="expand-job-meta" onClick={() => setInfoExpanded((prev) => !prev)}>
            <KeyboardArrowUp />
          </div>
        </div>
      </div>
    </JobHeaderWrapper>
  );
};

export default JobHeader;
