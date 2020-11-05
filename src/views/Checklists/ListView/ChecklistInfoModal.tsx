import { Avatar, BaseModal, Textarea } from '#components';
import { CommonOverlayProps } from '#components/OverlayContainer/types';
import { apiGetChecklistInfo } from '#utils/apiUrls';
import { request } from '#utils/request';
import { getFullName } from '#utils/stringUtils';
import { formatDateTime } from '#utils/timeUtils';
import { isEmpty, noop } from 'lodash';
import React, { FC, useEffect, useState } from 'react';
import styled from 'styled-components';

import { Checklist } from '../types';

const Wrapper = styled.div`
  .modal {
    min-width: 800px !important;
    width: 800px !important;
    max-height: 600px;
    height: 600px;
    /* overflow: auto !important; */
  }

  .modal-body {
    padding: 0 !important;
    height: inherit;
    display: grid;
    grid-template-areas: 'header' 'body';
    grid-template-rows: 92px 1fr;
  }

  .close-icon {
    top: 24px !important;
    right: 32px !important;
  }

  .header {
    grid-area: header;
    align-items: flex-start;
    border-bottom: 1px solid #eeeeee;
    display: flex;
    flex-direction: column;
    padding: 24px;
    justify-content: space-between;

    label {
      font-size: 12px;
      font-weight: normal;
      color: #000000;
    }

    span {
      font-size: 20px;
      font-weight: bold;
      color: #000000;
    }
  }

  .body {
    grid-area: body;
    padding: 24px;
    /* height: inherit; */
    overflow: auto;

    section {
      align-items: flex-start;
      border-bottom: 1px solid #eeeeee;
      display: flex;
      flex-direction: column;
      margin-top: 24px;

      :first-child {
        margin-top: 0;
      }

      :last-child {
        border: none;
      }

      label {
        color: #333333;
        font-size: 14px;
        font-weight: bold;
        margin-bottom: 16px;
      }

      > div {
        display: flex;
        width: 100%;
      }

      .column {
        border-right: 1px solid #eeeeee;
        display: flex;
        flex: 1;
        flex-direction: column;
        margin-bottom: 24px;
        padding-left: 18px;

        :last-child {
          border-right: 0;
        }

        :first-child {
          padding-left: 0;
        }

        &-label {
          color: #999999;
          font-size: 14px;
          font-weight: normal;
          margin-bottom: 16px;
          text-align: left;
        }
      }
    }

    .owner {
      display: flex;
      margin-bottom: 16px;

      &-details {
        align-items: flex-start;
        display: flex;
        flex-direction: column;
        margin-left: 16px;

        .owner-id {
          color: #666666;
          font-size: 10px;
          font-weight: 600;
        }

        .owner-name {
          color: #666666;
          font-size: 18px;
        }
      }
    }

    .authors {
      .secondary-authors {
        display: flex;
      }

      .creation-date {
        text-align: left;
      }
    }

    .signing {
      .column:first-child {
        flex: 2;
      }
      .signed-as {
        font-size: 14px;
        color: #000000;
        margin: 13px 0;
        padding: 2px 4px;
        text-align: left;
      }

      .state {
        font-size: 12px;
        color: #5aa700;
        padding: 2px 4px;
        background-color: #e1fec0;
        margin: 13px 0;
        width: max-content;
      }

      .date {
        font-size: 14px;
        color: #000000;
        margin: 13px 0;
        padding: 2px 4px;
        text-align: left;
      }
    }

    .release {
      .column {
        :first-child {
          flex: 2;
        }
      }
      .state {
        font-size: 12px;
        color: #5aa700;
        padding: 2px 4px;
        background-color: #e1fec0;
        margin: 13px 0;
        width: max-content;
      }

      .date {
        text-align: left;
      }
    }

    .revision {
      .column {
        flex: 4;

        :first-child {
          flex: 1;
        }

        :last-child {
          flex: 8;
        }

        div {
          text-align: left;
        }
      }
    }

    .description {
      textarea {
        :disabled {
          background-color: transparent;
          padding: 0;
        }

        :active,
        :focus {
          border: none;
        }
      }
    }
  }
`;

type ChecklistInfoModalProps = {
  checklist: Checklist;
};

const ChecklistInfoModal: FC<CommonOverlayProps<ChecklistInfoModalProps>> = ({
  closeAllOverlays,
  closeOverlay,
  props: { checklist } = {},
}) => {
  const [state, setState] = useState({});

  useEffect(() => {
    if (checklist) {
      (async () => {
        const { data, errors } = await request(
          'GET',
          apiGetChecklistInfo(checklist.id),
        );

        console.log('data :: ', data);

        if (data) {
          setState(data);
        } else {
          console.error('error :: ', errors);
        }
      })();
    }
  }, []);

  if (!isEmpty(state)) {
    const primaryAuthor = state?.authors?.filter((author) => author.primary)[0];
    const secondaryAuthors = state?.authors?.filter(
      (author) => !author.primary,
    );

    return (
      <Wrapper>
        <BaseModal
          closeAllModals={closeAllOverlays}
          closeModal={closeOverlay}
          showHeader={false}
          showFooter={false}
        >
          <div className="header">
            <label>Checklist Name</label>
            <span>{state?.name}</span>
          </div>
          <div className="body">
            <section className="authors">
              <label>Authoring Information</label>
              <div>
                <div className="column">
                  <label className="column-label">Checklist Owner</label>
                  <div className="owner">
                    <Avatar user={primaryAuthor ?? {}} />
                    <div className="owner-details">
                      <div className="owner-id">
                        {primaryAuthor?.employeeId}
                      </div>
                      <div className="owner-name">
                        {getFullName(primaryAuthor ?? {})}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="column">
                  <label className="column-label">Secondary Authors</label>
                  <div className="secondary-authors">
                    {secondaryAuthors?.map((author) => (
                      <Avatar user={author ?? {}} key={author?.employeeId} />
                    ))}
                  </div>
                </div>

                <div className="column">
                  <label className="column-label">Creation Date</label>
                  <div className="creation-date">
                    {formatDateTime(state?.audit?.createdAt, 'Do MMMM, YYYY')}
                  </div>
                </div>
              </div>
            </section>

            <section className="signing">
              <label>Signing Information</label>

              <div>
                <div className="column">
                  <label className="column-label">Collaborators</label>

                  {state?.signOff?.map((user) => (
                    <div className="owner" key={user.employeeId}>
                      <Avatar user={user ?? {}} />
                      <div className="owner-details">
                        <div className="owner-id">{user.employeeId}</div>
                        <div className="owner-name">
                          {getFullName(user ?? {})}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="column">
                  <label className="column-label">Signed As</label>

                  {state?.signOff?.map((user) => (
                    <div className="signed-as" key={user.employeeId}>
                      {(() => {
                        if (user.orderTree === 1) {
                          return 'Author';
                        } else if (user.orderTree === 2) {
                          return 'Reviewer';
                        } else if (user.orderTree === 3) {
                          return 'Approver';
                        }
                      })()}
                    </div>
                  ))}
                </div>

                <div className="column">
                  <label className="column-label">State</label>

                  {state?.signOff?.map((user) => (
                    <div className="state" key={user.employeeId}>
                      Complete
                    </div>
                  ))}
                </div>

                <div className="column">
                  <label className="column-label">Date</label>

                  {state?.signoff?.map((user) => (
                    <div className="date" key={user.employeeId}>
                      {formatDateTime(user?.signedAt, 'Do MMMM, YYYY')}
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <section className="release">
              <label>Released By</label>

              <div>
                <div className="column">
                  <label className="column-label">User</label>

                  <div className="owner">
                    <Avatar user={state?.release?.releaseBy ?? {}} />
                    <div className="owner-details">
                      <div className="owner-id">
                        {state?.release?.releaseBy?.employeeId}
                      </div>
                      <div className="owner-name">
                        {getFullName(state?.release?.releaseBy ?? {})}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="column">
                  <label className="column-label">State</label>
                  <div className="state">Complete</div>
                </div>

                <div className="column">
                  <label className="column-label">Date</label>

                  <div className="date">
                    {formatDateTime(state?.release?.releaseAt, 'Do MMMM, YYYY')}
                  </div>
                </div>
              </div>
            </section>

            <section className="revision">
              <label>Revision History</label>

              <div>
                <div className="column">
                  <label className="column-label">#</label>

                  {state?.versions?.map((_, index) => (
                    <div key={index}>{state?.versions?.length - index}</div>
                  ))}
                </div>

                <div className="column">
                  <label className="column-label">Checklist ID</label>

                  {state?.versions?.map((version, index) => (
                    <div key={index}>{version.id}</div>
                  ))}
                </div>

                <div className="column">
                  <label className="column-label">Depracated on</label>

                  {state?.versions?.map((version, index) => (
                    <div key={index}>
                      {version?.deprecatedAt
                        ? formatDateTime(version?.deprecatedAt, 'Do MMMM, YYYY')
                        : 'Current'}
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <section className="description">
              <label>Checklist Description</label>

              <Textarea
                defaultValue={state?.description}
                disabled
                rows={4}
                onChange={noop}
                placeholder=""
              />
            </section>
          </div>
        </BaseModal>
      </Wrapper>
    );
  } else {
    return null;
  }
};

export default ChecklistInfoModal;
