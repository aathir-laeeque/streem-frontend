import { useTypedSelector } from '#store';
import { Task } from '#views/Checklists/ChecklistComposer/TaskList/TaskView/types';
import {
  Activity,
  ActivityType,
} from '#views/Checklists/ChecklistComposer/TaskList/TaskView/ActivityList/Activity/types';
import React, { FC, ReactNode, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { PrintJobProps } from './types';
import { fetchData } from '../../../Composer/actions';
import { TaskExecutionStatus } from '../../../Composer/TaskList/types';
import { User } from '#store/users/types';
import checkmark from '#assets/images/checkmark.png';
import handIcon from '#assets/images/hand.png';
import clockIcon from '#assets/images/clock.png';
import cleenLogo from '#assets/images/cleen.png';
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  PDFViewer,
  Image,
} from '@react-pdf/renderer';
import moment from 'moment';
import { Entity, JobStatus } from '#Composer/types';

const now = moment().format('Do MMM, YYYY, h a');

const styles = StyleSheet.create({
  page: {
    backgroundColor: '#FFF',
    paddingBottom: 50,
    paddingTop: 45,
    textOverflow: 'hidden',
  },
  header: {
    backgroundColor: '#eeeeee',
    display: 'flex',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingVertical: 8,
    justifyContent: 'space-between',
    flexDirection: 'row',
    width: '100%',
    position: 'absolute',
    top: '0',
  },
  mainHeader: {
    backgroundColor: '#FFF',
    display: 'flex',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingVertical: 16,
    justifyContent: 'space-between',
    flexDirection: 'row',
    width: '100%',
    marginTop: -45,
    zIndex: 10,
  },
  footer: {
    backgroundColor: '#eeeeee',
    display: 'flex',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingVertical: 8,
    justifyContent: 'space-between',
    flexDirection: 'row',
    width: '100%',
    position: 'absolute',
    bottom: '0',
    height: 32,
  },
  footerInfo: {
    fontSize: 10,
    color: '#000000',
  },
  pageInfo: {
    width: 20,
    height: 20,
    borderRadius: 100,
    backgroundColor: '#bababa',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabLook: {
    display: 'flex',
    paddingVertical: 8,
  },
  tabLookHeader: {
    display: 'flex',
    flexDirection: 'row',
  },
  tabLookHeaderText: {
    fontSize: 12,
    color: '#ffffff',
    backgroundColor: '#000',
    minWidth: 155,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
  },
  tabLookBody: {
    display: 'flex',
    backgroundColor: '#f4f4f4',
    padding: '4px 40px 4px 0px',
  },
  content: {
    paddingHorizontal: 40,
    paddingVertical: 8,
  },
  labelInputGroupView: {
    display: 'flex',
    flexDirection: 'row',
    padding: '4px 0px',
    alignItems: 'center',
  },
  inputView: {
    borderWidth: 1,
    borderColor: '#000',
    display: 'flex',
    flex: 75,
    marginLeft: 7,
    paddingHorizontal: 8,
    paddingVertical: 4,
    minHeight: 22,
  },
  assignView: {
    display: 'flex',
    flex: 75,
    marginLeft: 7,
    paddingHorizontal: 8,
  },
  assigneInput: {
    borderWidth: 1,
    borderColor: '#000',
    paddingVertical: 4,
    paddingHorizontal: 8,
    minHeight: 20,
  },
  assigneRow: {
    flexDirection: 'row',
    display: 'flex',
    marginVertical: 4,
  },
  assigneHeading: {
    fontSize: 10,
  },
  inputLabelView: {
    display: 'flex',
    flex: 25,
    paddingLeft: 10,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  inputLabel: {
    fontSize: 12,
    color: '#666666',
  },
  flexView: {
    display: 'flex',
    flex: 1,
  },
  stageHeader: {
    paddingHorizontal: 40,
    borderBottomWidth: 1,
    borderColor: '#000',
  },
  taskView: {
    paddingTop: 8,
    paddingHorizontal: 40,
  },
  taskHeader: {
    display: 'flex',
  },
  taskTopHeader: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    display: 'flex',
    flexDirection: 'row',
    backgroundColor: '#eeeeee',
    width: '43%',
  },
  taskTopHeaderTitle: {
    fontSize: 12,
  },
  taskBottomHeader: {
    padding: 16,
    backgroundColor: '#dadada',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  taskHasTimed: {
    paddingTop: 10,
    paddingBottom: 16,
    paddingLeft: 16,
    backgroundColor: '#dadada',
    borderTopWidth: 1,
    borderTopColor: '#bababa',
  },
  taskHasStopHeader: {
    paddingVertical: 13,
    backgroundColor: '#bababa',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  taskStartTime: {
    marginLeft: 24,
  },
  taskStartDateInput: {
    fontSize: 10,
    letterSpacing: 0,
  },
  taskTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    textOverflow: 'hidden',
  },
  taskFooter: {
    display: 'flex',
    flexDirection: 'row',
    paddingVertical: 8,
    paddingTop: 16,
  },
  taskFooterInputs: {
    borderWidth: 1,
    borderColor: '#000',
    minHeight: 20,
    paddingVertical: 2,
    paddingHorizontal: 2,
  },
  taskFooterLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  text12: {
    fontSize: 12,
  },
  activityHintText: {
    color: '#666666',
    fontSize: 12,
  },
  activityView: {
    paddingVertical: 8,
    marginBottom: 8,
  },
  activitySeprator: {
    borderTopWidth: 1,
    borderTopColor: '#dadada',
    borderTopStyle: 'dashed',
  },
  materialActivityItems: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#eeeeee',
    paddingVertical: 7,
    paddingRight: 38,
  },
  checkBox: {
    width: 16,
    height: 16,
    borderWidth: 1,
    borderColor: '#000',
    marginRight: 8,
  },
  checkBoxFaded: {
    width: 16,
    height: 16,
    borderWidth: 1,
    borderColor: '#666666',
    marginHorizontal: 5,
  },
  yesNoLabel: {
    fontSize: 14,
    paddingTop: 9,
    paddingBottom: 5,
  },
  comments: {
    marginTop: 4,
    borderWidth: 1,
    borderColor: '#000',
  },
  commentsRow: {
    height: 19,
    borderBottomWidth: 1,
    borderBottomColor: '#f4f4f4',
  },
  lightInput: {
    marginHorizontal: 1,
    width: 20,
    height: 20,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
  },
});

const InputLabelGroup = ({
  label,
  value,
  full = true,
}: {
  label: string;
  value: string;
  full?: boolean;
}) => (
  <View style={styles.labelInputGroupView}>
    <View style={[styles.inputLabelView, { flex: full ? 25 : 45 }]}>
      <Text style={styles.inputLabel}>{label}</Text>
    </View>
    <View style={[styles.inputView, { flex: full ? 75 : 55 }]}>
      <Text style={styles.text12}>{value}</Text>
    </View>
  </View>
);

const ValueLabelGroup = ({
  label,
  value,
}: {
  label: string;
  value: string;
}) => (
  <View style={styles.labelInputGroupView}>
    <View style={[styles.inputLabelView, { flex: 'unset', paddingLeft: 0 }]}>
      <Text style={styles.inputLabel}>{label}</Text>
    </View>
    <View style={styles.assignView}>
      <Text style={styles.text12}>{value}</Text>
    </View>
  </View>
);

const TabLookLike = ({
  children,
  title,
}: {
  children: ReactNode;
  title: string;
}) => (
  <View style={styles.tabLook}>
    <View style={styles.tabLookHeader}>
      <Text style={styles.tabLookHeaderText}>{title}</Text>
    </View>
    <View style={styles.tabLookBody}>{children}</View>
  </View>
);

const Assigness = ({
  assignees,
  jobStatus,
}: {
  assignees: User[];
  jobStatus: string;
}) => {
  let rows = [];
  if (jobStatus === JobStatus.UNASSIGNED) {
    for (let i = 0; i < 8; i++) {
      rows.push(
        <View style={styles.assigneRow} key={`assignes_${i}`}>
          <View style={[styles.flexView, styles.assigneInput]} />

          <View
            style={[
              styles.flexView,
              styles.assigneInput,
              { margin: '0px 8px' },
            ]}
          />

          <View style={[styles.flexView, styles.assigneInput]} />
        </View>,
      );
    }
  } else {
    rows = assignees.map(({ firstName, lastName, employeeId }) => (
      <View style={styles.assigneRow} key={`assignes_${employeeId}`}>
        <View style={[styles.flexView, styles.assigneInput]}>
          <Text style={styles.text12}>{firstName}</Text>
        </View>

        <View
          style={[styles.flexView, styles.assigneInput, { margin: '0px 8px' }]}
        >
          <Text style={styles.text12}>{lastName}</Text>
        </View>

        <View style={[styles.flexView, styles.assigneInput]}>
          <Text style={styles.text12}>{employeeId}</Text>
        </View>
      </View>
    ));
  }

  return (
    <View
      style={[
        styles.labelInputGroupView,
        { alignItems: 'flex-start', marginTop: 8 },
      ]}
    >
      <View style={[styles.inputLabelView, { justifyContent: 'flex-start' }]}>
        <Text style={styles.inputLabel}>Asignees : </Text>
      </View>
      <View style={styles.assignView}>
        <View style={[styles.assigneRow, { marginTop: 0 }]}>
          <View style={styles.flexView}>
            <Text style={styles.assigneHeading}>First Name</Text>
          </View>
          <View style={[styles.flexView, { margin: '0px 8px' }]}>
            <Text style={styles.assigneHeading}>Last Name</Text>
          </View>
          <View style={styles.flexView}>
            <Text style={styles.assigneHeading}>Employee Id</Text>
          </View>
        </View>
        {rows}
      </View>
    </View>
  );
};

const MyPrintJob: FC<{ jobId: string }> = ({ jobId }) => {
  const { data } = useTypedSelector((state) => state.composer);
  const { profile } = useTypedSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    if (jobId) {
      dispatch(fetchData({ id: parseInt(jobId, 10), entity: Entity.JOB }));
    }
  }, []);

  if (!data || !profile) return null;

  const { checklist, ...jobExtras } = data;

  const activityTemplateFormatter = (
    activity: Activity,
    activityIndex: number,
  ) => {
    switch (activity.type) {
      case ActivityType.INSTRUCTION:
        return (
          <View style={{ marginTop: 8 }}>
            <View style={styles.activityView}>
              <Text style={styles.text12}>{activity.data.text}</Text>
            </View>
            <View style={styles.activitySeprator}></View>
          </View>
        );
      case ActivityType.TEXTBOX:
        const items = [];
        for (let i = 0; i < 8; i++) {
          items.push(<View style={styles.commentsRow}></View>);
        }
        return (
          <View>
            <View style={styles.activityView}>
              <Text style={styles.text12}>Write Your Comments</Text>
              <View style={styles.comments}>
                {activity.response?.value ? (
                  <Text style={styles.text12}>{activity.response?.value}</Text>
                ) : (
                  items
                )}
              </View>
            </View>
            <View style={styles.activitySeprator}></View>
          </View>
        );
      case ActivityType.SHOULDBE:
        let content = '';
        switch (activity.data.operator) {
          case 'EQUAL_TO':
            content = ` (=) Equal to ${activity.data.value} ${activity.data.uom}`;
            break;
          case 'LESS_THAN':
            content = ` (<) Less than ${activity.data.value} ${activity.data.uom}`;
            break;
          case 'IS_BETWEEN':
            content = ` (<>) In between ${activity.data.lowerValue} - ${activity.data.upperValue} ${activity.data.uom}`;
            break;
          case 'MORE_THAN':
            content = ` (>) More than ${activity.data.value} ${activity.data.uom}`;
            break;
          default:
            break;
        }
        return (
          <View>
            <View style={styles.activityView}>
              <Text
                style={styles.text12}
              >{`${activity.data.parameter} Should be${content}`}</Text>
              <Text
                style={[styles.text12, { marginTop: 11, marginBottom: 16 }]}
              >
                Write your Observed Value
              </Text>
              <View style={{ display: 'flex', flexDirection: 'row' }}>
                {activity.response?.value ? (
                  [...activity.response?.value].map((char) => (
                    <View style={styles.lightInput} key={`${char}`}>
                      <Text style={styles.text12}>{char}</Text>
                    </View>
                  ))
                ) : (
                  <>
                    <View style={styles.lightInput} />
                    <View style={styles.lightInput} />
                    <View style={styles.lightInput} />
                    <View style={styles.lightInput} />
                  </>
                )}
                <View
                  style={{
                    width: 2,
                    height: 18,
                    marginHorizontal: 1,
                    borderBottomWidth: 1,
                    borderBottomColor: '#000',
                  }}
                />
                <View style={styles.lightInput} />
                <View style={styles.lightInput} />
              </View>
            </View>
            <View style={styles.activitySeprator}></View>
          </View>
        );
      case ActivityType.CHECKLIST:
        return (
          <View>
            <View style={styles.activityView}>
              <View
                style={[
                  styles.materialActivityItems,
                  {
                    justifyContent: 'flex-start',
                    borderBottomWidth: 0,
                    paddingTop: 2,
                  },
                ]}
                wrap={false}
              >
                <Text style={styles.activityHintText}>
                  Check all the iteams. E.g. -
                </Text>
                <Image
                  src={checkmark}
                  style={{ height: '16px', marginHorizontal: 5 }}
                />
                <Text style={styles.activityHintText}>
                  1.0% v/v Hempton Solution
                </Text>
              </View>
              {activity.data.map((item) => (
                <View
                  wrap={false}
                  key={`${item.id}`}
                  style={[
                    styles.materialActivityItems,
                    { justifyContent: 'flex-start', borderBottomWidth: 0 },
                  ]}
                >
                  {activity.response?.choices &&
                  activity.response?.choices[item.id] === 'SELECTED' ? (
                    <Image
                      src={checkmark}
                      style={{ height: '16px', marginHorizontal: 5 }}
                    />
                  ) : (
                    <View style={styles.checkBox} />
                  )}
                  <Text style={styles.text12}>{item.name}</Text>
                </View>
              ))}
            </View>
            <View style={styles.activitySeprator}></View>
          </View>
        );
      case ActivityType.MULTISELECT:
        return (
          <View>
            <View style={styles.activityView}>
              <View
                style={[
                  styles.materialActivityItems,
                  {
                    justifyContent: 'flex-start',
                    borderBottomWidth: 0,
                    paddingTop: 2,
                  },
                ]}
                wrap={false}
              >
                <Text style={styles.activityHintText}>
                  You can select multiple iteams . E.g. -
                </Text>
                <Image
                  src={checkmark}
                  style={{ height: '16px', marginHorizontal: 5 }}
                />
                <Text style={styles.activityHintText}>
                  1.0% v/v Hempton Solution
                </Text>
              </View>
              {activity.data.map((item) => (
                <View
                  key={`${item.id}`}
                  style={[
                    styles.materialActivityItems,
                    { justifyContent: 'flex-start', borderBottomWidth: 0 },
                  ]}
                  wrap={false}
                >
                  {activity.response?.choices &&
                  activity.response?.choices[item.id] === 'SELECTED' ? (
                    <Image
                      src={checkmark}
                      style={{ height: '16px', marginHorizontal: 5 }}
                    />
                  ) : (
                    <View style={styles.checkBox} />
                  )}
                  <Text style={styles.text12}>{item.name}</Text>
                </View>
              ))}
            </View>
            <View style={styles.activitySeprator}></View>
          </View>
        );
      case ActivityType.YESNO:
        return (
          <View>
            <View style={styles.activityView}>
              <View
                style={[
                  styles.materialActivityItems,
                  {
                    justifyContent: 'flex-start',
                    borderBottomWidth: 0,
                    paddingTop: 2,
                  },
                ]}
                wrap={false}
              >
                <Text style={styles.activityHintText}>
                  Check either one option E.g. -
                </Text>
                <Image
                  src={checkmark}
                  style={{ height: '16px', marginHorizontal: 5 }}
                />
                <Text style={styles.activityHintText}>or</Text>
                <View style={styles.checkBoxFaded} />
              </View>
              <Text style={styles.yesNoLabel}>{activity.label}</Text>
              <View
                style={[
                  styles.materialActivityItems,
                  {
                    justifyContent: 'flex-start',
                    borderBottomWidth: 0,
                  },
                ]}
                wrap={false}
              >
                {(activity.response?.choices &&
                  activity.response?.choices[activity.data[0].id]) ===
                'SELECTED' ? (
                  <Image
                    src={checkmark}
                    style={{ height: '16px', marginHorizontal: 5 }}
                  />
                ) : (
                  <View style={styles.checkBox} />
                )}
                <Text style={styles.text12}>Yes</Text>
                <Text style={[styles.text12, { marginHorizontal: 20 }]}>
                  or
                </Text>
                {activity.response?.choices &&
                activity.response?.choices[activity.data[1].id] ===
                  'SELECTED' ? (
                  <Image
                    src={checkmark}
                    style={{ height: '16px', marginHorizontal: 5 }}
                  />
                ) : (
                  <View style={styles.checkBox} />
                )}
                <Text style={styles.text12}>No</Text>
              </View>
            </View>
            <View style={styles.activitySeprator}></View>
          </View>
        );
      case ActivityType.MATERIAL:
        return (
          <View>
            <View
              style={[
                styles.activityView,
                {
                  width: '75%',
                },
              ]}
            >
              {activity.data.map((item, itemIndex: number) => (
                <View
                  key={`${activity.id}_${itemIndex}`}
                  style={styles.materialActivityItems}
                  wrap={false}
                >
                  <Text style={styles.text12}>
                    {itemIndex + 1}. {item.name}
                  </Text>
                  <Text style={styles.text12}>{item.quantity}</Text>
                </View>
              ))}
            </View>
            <View style={styles.activitySeprator}></View>
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <PDFViewer style={{ width: '100%', height: '100%' }}>
      <Document>
        <Page style={styles.page}>
          <View style={styles.header} fixed>
            <Image src={cleenLogo} style={{ height: '24px' }} />
            <View style={{ display: 'flex', flexDirection: 'row' }}>
              <Text style={[styles.text12, { fontWeight: 'bold' }]}>
                Job ID : {jobExtras.code}
              </Text>
            </View>
          </View>

          <View style={styles.mainHeader}>
            <View
              style={{
                backgroundColor: '#999999',
                paddingHorizontal: 20,
                paddingVertical: 8,
              }}
            >
              <Text
                style={[styles.text12, { color: '#FFF', fontWeight: 'bold' }]}
              >
                Client Logo
              </Text>
            </View>
            <Image src={cleenLogo} style={{ height: '24px' }} />
          </View>

          <View style={styles.content}>
            <TabLookLike title="Checklist Details">
              <InputLabelGroup
                label="Checklist ID :"
                value={checklist?.code || ''}
              />
              <InputLabelGroup
                label="Checklist Name :"
                value={checklist?.name || ''}
              />
            </TabLookLike>

            <TabLookLike title="Job Details">
              <InputLabelGroup label="Job ID :" value={jobExtras.code} />
              <InputLabelGroup label="Status :" value={jobExtras.status} />
              <View style={{ display: 'flex', flex: 1, flexDirection: 'row' }}>
                <View style={{ display: 'flex', flex: 14.4 }} />
                <View style={{ display: 'flex', flex: 42.8 }}>
                  <InputLabelGroup label="Equipment ID" value="" full={false} />
                </View>
                <View style={{ display: 'flex', flex: 42.8 }}>
                  <InputLabelGroup
                    label="Room ID :"
                    value={jobExtras.properties['ROOM ID']}
                    full={false}
                  />
                </View>
              </View>
              <View style={{ display: 'flex', flex: 1, flexDirection: 'row' }}>
                <View style={{ display: 'flex', flex: 14.4 }} />
                <View style={{ display: 'flex', flex: 42.8 }}>
                  <InputLabelGroup
                    label="Previous Product"
                    value=""
                    full={false}
                  />
                </View>
                <View style={{ display: 'flex', flex: 42.8 }}>
                  <InputLabelGroup
                    label="Batch No :"
                    value={jobExtras.properties['BATCH NO']}
                    full={false}
                  />
                </View>
              </View>
              <Assigness
                assignees={jobExtras.assignees}
                jobStatus={jobExtras.status}
              />
            </TabLookLike>

            <TabLookLike title="Stage and Task Details">
              <InputLabelGroup
                label="Total Stages :"
                value={checklist?.stages?.length.toString() || '0'}
              />
              <InputLabelGroup
                label="Total Tasks :"
                value={jobExtras.totalTasks}
              />
            </TabLookLike>
          </View>

          {checklist?.stages?.map((stage, stageIndex: number) => {
            return (
              <View key={`${stage.id}`} break>
                <View style={styles.stageHeader}>
                  <ValueLabelGroup
                    label="Stage :"
                    value={`${stageIndex + 1}`}
                  />
                  <Text style={{ margin: '8px 0px' }}>{stage.name}</Text>
                  <ValueLabelGroup
                    label="Tasks :"
                    value={`${stage.tasks.length}`}
                  />
                </View>
                {(stage.tasks as Array<Task>).map((task, taskIndex: number) => {
                  const {
                    endDate,
                    startedAt,
                    audit: { modifiedBy, modifiedAt },
                    status: taskExecutionStatus,
                  } = task.taskExecution;
                  return (
                    <View style={styles.taskView} key={`${task.id}`}>
                      <View style={styles.taskHeader} wrap={false}>
                        <View style={styles.taskTopHeader}>
                          <View style={styles.taskStartDate}>
                            <Text style={styles.taskTopHeaderTitle}>
                              Start Date
                            </Text>
                            <Text
                              style={[
                                styles.taskStartDateInput,
                                {
                                  letterSpacing: 2.5,
                                  margin: '8px 0px 2px 0px',
                                },
                              ]}
                            >
                              {taskExecutionStatus !==
                              TaskExecutionStatus.NOT_STARTED
                                ? moment(startedAt).format('MMM DD YYYY')
                                : '___/__/____'}
                            </Text>
                            <Text style={styles.taskStartDateInput}>
                              MMM&nbsp;&nbsp;DD&nbsp;&nbsp;&nbsp;YYYY
                            </Text>
                          </View>
                          <View style={styles.taskStartTime}>
                            <Text style={styles.taskTopHeaderTitle}>
                              Start Time
                            </Text>
                            <Text
                              style={[
                                styles.taskStartDateInput,
                                {
                                  letterSpacing: 2.6,
                                  margin: '8px 0px 2px 0px',
                                },
                              ]}
                            >
                              {taskExecutionStatus !==
                              TaskExecutionStatus.NOT_STARTED
                                ? moment(startedAt).format('HH:MM a')
                                : '__:__ am / pm'}
                            </Text>
                            <Text style={styles.taskStartDateInput}>
                              HH&nbsp;&nbsp;MM
                            </Text>
                          </View>
                        </View>
                        {task.hasStop && (
                          <View style={styles.taskHasStopHeader}>
                            <Image
                              src={handIcon}
                              style={{ height: '20px', marginRight: 8 }}
                            />
                            <Text style={[styles.text12, { fontWeight: 600 }]}>
                              Complete this task before proceeding to the next
                              task.
                            </Text>
                          </View>
                        )}
                        <View style={styles.taskBottomHeader}>
                          <Text style={[styles.taskTitle, { maxWidth: '80%' }]}>
                            Task {`${taskIndex + 1}. ${task.name}`}
                          </Text>
                          <Text style={styles.taskTitle}>
                            {task.mandatory ? `Mandatory` : `Optional`}
                          </Text>
                        </View>
                        {task.timed && task.period && (
                          <View>
                            <View style={styles.taskHasTimed}>
                              <View
                                style={{
                                  display: 'flex',
                                  flexDirection: 'row',
                                  alignItems: 'center',
                                }}
                              >
                                <Image
                                  src={clockIcon}
                                  style={{ height: '18px', marginRight: 8 }}
                                />
                                <Text style={styles.text12}>
                                  Perform Task NLT{' '}
                                  {`${Math.floor(
                                    (task.period / (1000 * 60)) % 60,
                                  )} min : ${Math.floor(
                                    (task.period / 1000) % 60,
                                  )} sec `}
                                </Text>
                              </View>
                            </View>
                            <View
                              style={{
                                display: 'flex',
                                flexDirection: 'row',
                                marginTop: 8,
                                alignItems: 'center',
                              }}
                            >
                              <Text
                                style={[styles.text12, { color: '#666666' }]}
                              >
                                Write values in box E.g. -{' '}
                              </Text>
                              <View style={styles.lightInput} />
                              <View style={styles.lightInput} />
                              <View style={styles.lightInput} />
                              <View style={styles.lightInput} />
                              <View
                                style={{
                                  width: 2,
                                  height: 18,
                                  marginHorizontal: 1,
                                  borderBottomWidth: 1,
                                  borderBottomColor: '#000',
                                }}
                              />
                              <View style={styles.lightInput} />
                              <View style={styles.lightInput} />
                            </View>
                          </View>
                        )}
                      </View>
                      {(task.activities as Array<Activity>).map(
                        (activity, activityIndex: number) => {
                          return (
                            <View key={`${activity.id}`}>
                              {activityTemplateFormatter(
                                activity,
                                activityIndex,
                              )}
                            </View>
                          );
                        },
                      )}
                      <View style={styles.taskFooter} wrap={false}>
                        <View style={styles.flexView}>
                          <Text style={styles.taskFooterLabel}>First Name</Text>
                          <View style={styles.taskFooterInputs}>
                            <Text style={styles.text12}>
                              {taskExecutionStatus !==
                              TaskExecutionStatus.NOT_STARTED
                                ? modifiedBy.firstName
                                : ''}
                            </Text>
                          </View>
                        </View>
                        <View
                          style={[
                            styles.flexView,
                            { margin: '0px 4px 0px 8px' },
                          ]}
                        >
                          <Text style={styles.taskFooterLabel}>Last Name</Text>
                          <View style={styles.taskFooterInputs}>
                            <Text style={styles.text12}>
                              {taskExecutionStatus !==
                              TaskExecutionStatus.NOT_STARTED
                                ? modifiedBy.lastName
                                : ''}
                            </Text>
                          </View>
                        </View>
                        <View style={[styles.flexView, { margin: '0px 4px' }]}>
                          <Text style={styles.taskFooterLabel}>Signature</Text>
                          <View
                            style={[styles.taskFooterInputs, { minHeight: 50 }]}
                          />
                        </View>
                        <View style={[styles.flexView, { margin: '0px 4px' }]}>
                          <Text style={styles.taskFooterLabel}>Date</Text>
                          <Text
                            style={[
                              styles.taskStartDateInput,
                              {
                                letterSpacing: 2.6,
                                margin: '8px 0px 2px 0px',
                              },
                            ]}
                          >
                            {taskExecutionStatus !==
                            TaskExecutionStatus.NOT_STARTED
                              ? moment(modifiedAt || endDate).format(
                                  'DD/MM/YYYY',
                                )
                              : '___/__/____'}
                          </Text>
                        </View>
                      </View>
                    </View>
                  );
                })}
              </View>
            );
          })}
          <View fixed style={styles.footer}>
            <Text style={styles.footerInfo}>
              Downloaded on {now}. By {profile.firstName} {profile.lastName} ID:{' '}
              {profile.employeeId} using CLEEN App
            </Text>
            <View style={styles.pageInfo}>
              <Text
                style={{ fontSize: 10, minHeight: 10 }}
                render={({ pageNumber, totalPages }) => `${pageNumber}`}
                fixed
              />
            </View>
          </View>
        </Page>
      </Document>
    </PDFViewer>
  );
};

const MemoMyPrintJob = React.memo(MyPrintJob);

const PrintJob: FC<PrintJobProps> = ({ jobId }) => (
  <>
    <div
      style={{
        display: 'flex',
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '100%',
        zIndex: -1,
      }}
    >
      Loading...
    </div>
    {jobId && <MemoMyPrintJob jobId={jobId} />}
  </>
);

export default PrintJob;
