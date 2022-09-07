import React, { FC } from 'react';
import {
  TaskExecutionState,
  Activity,
  MandatoryActivity,
  NonMandatoryActivity,
} from '#JobComposer/checklist.types';
import checkmark from '#assets/images/checkmark.png';
import checkEmoji from '#assets/images/emojis/check.png';
import binEmoji from '#assets/images/emojis/bin.png';
import cancelEmoji from '#assets/images/emojis/cancel.png';
import cautionEmoji from '#assets/images/emojis/caution.png';
import cleanEmoji from '#assets/images/emojis/clean.png';
import crossEmoji from '#assets/images/emojis/cross.png';
import electricEmoji from '#assets/images/emojis/electric.png';
import eyeEmoji from '#assets/images/emojis/eye.png';
import fireEmoji from '#assets/images/emojis/fire.png';
import flagEmoji from '#assets/images/emojis/flag.png';
import glassesEmoji from '#assets/images/emojis/glasses.png';
import glovesEmoji from '#assets/images/emojis/gloves.png';
import handEmoji from '#assets/images/emojis/hand.png';
import helmetEmoji from '#assets/images/emojis/helmet.png';
import lockEmoji from '#assets/images/emojis/lock.png';
import recycleEmoji from '#assets/images/emojis/recycle.png';
import sosEmoji from '#assets/images/emojis/sos.png';
import starEmoji from '#assets/images/emojis/star.png';
import stopEmoji from '#assets/images/emojis/stop.png';
import toolboxEmoji from '#assets/images/emojis/toolbox.png';
import torchEmoji from '#assets/images/emojis/torch.png';
import vestEmoji from '#assets/images/emojis/vest.png';
import ReactPDF, { Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import moment from 'moment';
import { parseMarkUp } from '#utils/stringUtils';
import { EmojisUniCodes } from '#utils/constants';
import { InstructionTags } from './types';
import { ActivitiesById } from '#JobComposer/ActivityList/types';
import ResourceActivity from './Resource';

export const styles = StyleSheet.create({
  text12: {
    fontSize: 12,
    fontFamily: 'Nunito',
  },
  textS12: {
    fontSize: 12,
  },
  activityHintText: {
    color: '#666666',
    fontSize: 12,
    fontFamily: 'Nunito',
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
    fontFamily: 'Nunito',
  },
  comments: {
    marginTop: 4,
    paddingHorizontal: 12,
    paddingVertical: 7,
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
  taskFooter: {
    display: 'flex',
    flexDirection: 'row',
    paddingVertical: 8,
    paddingTop: 16,
  },
  wrappedView: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginVertical: 5,
  },
  emojiImage: {
    height: '12px',
    marginTop: 4,
  },
});

type Response = { tag: string; text: string; childs: Response[] };

const getInstructionTemplate = (res: Response[]): JSX.Element[] => {
  const items: JSX.Element[][] = [];
  let newLine = -1;
  const getTagBasedDesign = (
    element: Response,
    childIndex: number,
    parent: Response | null = null,
    extraStyles: ReactPDF.Style = {},
    listValue: string | null = null,
  ) => {
    switch (element.tag) {
      case InstructionTags.UL:
      case InstructionTags.OL:
      case InstructionTags.P:
        newLine++;
        return element.childs.map((child, i) =>
          getTagBasedDesign(child, i, element, extraStyles, i === 0 ? listValue : null),
        );
      case InstructionTags.LI:
        newLine++;
        return element.childs.map((child, i) =>
          getTagBasedDesign(
            child,
            i,
            element,
            extraStyles,
            i === 0 ? (parent?.tag === InstructionTags.UL ? '•' : childIndex + 1 + '.') : null,
          ),
        );
      case InstructionTags.SPAN:
        return element.childs.map((child, i) =>
          getTagBasedDesign(child, i, element, extraStyles, i === 0 ? listValue : null),
        );
      case InstructionTags.STRONG:
        return element.childs.map((child, i) =>
          getTagBasedDesign(
            child,
            i,
            element,
            {
              ...extraStyles,
              fontFamily: 'NunitoBold',
            },
            listValue,
          ),
        );
      case InstructionTags.INS:
        return element.childs.map((child, i) =>
          getTagBasedDesign(
            child,
            i,
            element,
            {
              ...extraStyles,
              textDecoration: 'underline',
            },
            listValue,
          ),
        );
      case InstructionTags.TEXT:
        if (!items[newLine]) items[newLine] = [];
        for (let i = 0; i < element.text.length; i++) {
          if (i === 0 && listValue) {
            items[newLine].push(
              <Text style={[styles.text12, { marginRight: 5 }]}>{listValue}</Text>,
            );
          }

          const unicode = element.text[i].codePointAt(0).toString(16).toUpperCase();
          if (unicode.length !== 4) {
            items[newLine].push(
              <Text style={[styles.text12, extraStyles]}>{element.text[i]}</Text>,
            );
          } else {
            switch (unicode) {
              case EmojisUniCodes.CHECK:
                items[newLine].push(<Image src={checkEmoji} style={styles.emojiImage} />);
                break;
              case EmojisUniCodes.EYE:
                items[newLine].push(<Image src={eyeEmoji} style={styles.emojiImage} />);
                break;
              case EmojisUniCodes.STAR:
                items[newLine].push(<Image src={starEmoji} style={styles.emojiImage} />);
                break;
              case EmojisUniCodes.TORCH:
                items[newLine].push(<Image src={torchEmoji} style={styles.emojiImage} />);
                break;
              case EmojisUniCodes.TOOLBOX:
                items[newLine].push(<Image src={toolboxEmoji} style={styles.emojiImage} />);
                break;
              case EmojisUniCodes.HELMET:
                items[newLine].push(<Image src={helmetEmoji} style={styles.emojiImage} />);
                break;
              case EmojisUniCodes.GLASSES:
                items[newLine].push(<Image src={glassesEmoji} style={styles.emojiImage} />);
                break;
              case EmojisUniCodes.GLOVES:
                items[newLine].push(<Image src={glovesEmoji} style={styles.emojiImage} />);
                break;
              case EmojisUniCodes.CANCEL:
                items[newLine].push(<Image src={cancelEmoji} style={styles.emojiImage} />);
                break;
              case EmojisUniCodes.STOP:
                items[newLine].push(<Image src={stopEmoji} style={styles.emojiImage} />);
                break;
              case EmojisUniCodes.VEST:
                items[newLine].push(<Image src={vestEmoji} style={styles.emojiImage} />);
                break;
              case EmojisUniCodes.CLEAN:
                items[newLine].push(<Image src={cleanEmoji} style={styles.emojiImage} />);
                break;
              case EmojisUniCodes.RECYCLE:
                items[newLine].push(<Image src={recycleEmoji} style={styles.emojiImage} />);
                break;
              case EmojisUniCodes.SOS:
                items[newLine].push(<Image src={sosEmoji} style={styles.emojiImage} />);
                break;
              case EmojisUniCodes.FLAG:
                items[newLine].push(<Image src={flagEmoji} style={styles.emojiImage} />);
                break;
              case EmojisUniCodes.ELECTRIC:
                items[newLine].push(<Image src={electricEmoji} style={styles.emojiImage} />);
                break;
              case EmojisUniCodes.FIRE:
                items[newLine].push(<Image src={fireEmoji} style={styles.emojiImage} />);
                break;
              case EmojisUniCodes.CAUTION:
                items[newLine].push(<Image src={cautionEmoji} style={styles.emojiImage} />);
                break;
              case EmojisUniCodes.HAND:
                items[newLine].push(<Image src={handEmoji} style={styles.emojiImage} />);
                break;
              case EmojisUniCodes.BIN:
                items[newLine].push(<Image src={binEmoji} style={styles.emojiImage} />);
                break;
              case EmojisUniCodes.CROSS:
                items[newLine].push(<Image src={crossEmoji} style={styles.emojiImage} />);
                break;
              case EmojisUniCodes.LOCK:
                items[newLine].push(<Image src={lockEmoji} style={styles.emojiImage} />);
                break;
              default:
                break;
            }
          }
        }
        break;
      default:
        break;
    }
  };

  res.forEach((parent, i) => getTagBasedDesign(parent, i));

  return items.map((item, i) => (
    <View style={styles.wrappedView} wrap={false} key={'instructionItem_' + i}>
      {item}
    </View>
  ));
};

const activityTemplateFormatter = (
  activity: Activity,
  activityIndex: number,
  dateAndTimeStampFormat: string,
  activitiesById: ActivitiesById,
) => {
  switch (activity.type) {
    case NonMandatoryActivity.INSTRUCTION:
      const node = document.createElement('div');
      node.innerHTML = activity.data.text;
      const res = parseMarkUp(node);
      return <View style={styles.activityView}>{getInstructionTemplate(res)}</View>;
    case MandatoryActivity.TEXTBOX:
      const items = [];
      for (let i = 0; i < 8; i++) {
        items.push(<View style={styles.commentsRow} />);
      }
      return (
        <View style={styles.activityView} wrap={false}>
          <Text style={styles.text12}>Write Your Comments</Text>
          <View style={styles.comments}>
            {activity.response?.value ? (
              <Text style={styles.text12}>{activity.response?.value}</Text>
            ) : (
              items
            )}
          </View>
        </View>
      );
    case MandatoryActivity.SIGNATURE:
      const signatureItems = [];
      for (let i = 0; i < 8; i++) {
        signatureItems.push(<View style={[styles.commentsRow, { borderBottomWidth: 0 }]} />);
      }
      return (
        <View style={styles.activityView} wrap={false}>
          <Text style={styles.text12}>Sign Below</Text>
          {activity.response?.medias?.[0] ? (
            <Image src={activity.response?.medias[0]?.link} style={{ width: '300px' }} />
          ) : (
            <View style={[styles.comments, { width: 300 }]}>{signatureItems}</View>
          )}
        </View>
      );
    case MandatoryActivity.PARAMETER:
    case MandatoryActivity.SHOULD_BE:
      let content = '';
      const { data } = activity;
      switch (data.operator) {
        case 'EQUAL_TO':
          content = ` (=) Equal to ${data.value} ${data.uom}`;
          break;
        case 'LESS_THAN':
          content = ` (<) Less than ${data.value} ${data.uom}`;
          break;
        case 'LESS_THAN_EQUAL_TO':
          content = `(<=) Less than equal to ${data.value} ${data.uom}`;
          break;
        case 'BETWEEN':
          content = ` In between ${data.lowerValue} - ${data.upperValue} ${data.uom}`;
          break;
        case 'MORE_THAN':
          content = ` (>) More than ${data.value} ${data.uom}`;
          break;
        case 'MORE_THAN_EQUAL_TO':
          content = `(>=) More than equal to ${data.value} ${data.uom}`;
          break;
        default:
          break;
      }

      const approvalState = activity?.response?.activityValueApprovalDto?.state;
      return (
        <View style={styles.activityView}>
          <Text style={styles.text12}>{`${activity.data.parameter} Should be${content}`}</Text>
          <Text style={[styles.text12, { marginTop: 11, marginBottom: 16 }]}>
            Write your Observed Value
          </Text>
          <View style={{ display: 'flex', flexDirection: 'row' }}>
            {activity.response?.value ? (
              [...activity.response?.value].map((char) =>
                char === '.' ? (
                  <View
                    style={{
                      width: 2,
                      height: 18,
                      marginHorizontal: 1,
                      borderBottomWidth: 1,
                      borderBottomColor: '#000',
                    }}
                  />
                ) : (
                  <View style={styles.lightInput} key={`${char}`}>
                    <Text style={styles.text12}>{char}</Text>
                  </View>
                ),
              )
            ) : (
              <>
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
              </>
            )}
          </View>
          {approvalState && (
            <View style={styles.taskFooter} wrap={false}>
              <Text style={styles.text12}>
                This Activity was {approvalState === 'APPROVED' ? 'approved' : 'rejected'} digitally
                via Leucine {'\n'}
                by {activity.response.activityValueApprovalDto.approver.firstName}{' '}
                {activity.response.activityValueApprovalDto.approver.lastName}, ID:{' '}
                {activity.response.activityValueApprovalDto.approver.employeeId} on{' '}
                {moment
                  .unix(activity.response.activityValueApprovalDto.createdAt)
                  .format(dateAndTimeStampFormat)}
              </Text>
            </View>
          )}
          {!!activity?.response?.reason && (
            <View style={styles.comments}>
              <Text style={styles.text12}>{activity.response.reason}</Text>
            </View>
          )}
        </View>
      );
    case MandatoryActivity.CHECKLIST:
      return (
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
            <Text style={styles.activityHintText}>Check all the items. E.g. -</Text>
            <Image src={checkmark} style={{ height: '16px', marginHorizontal: 5 }} />
            <Text style={styles.activityHintText}>Remove the jacket from the assembly</Text>
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
              {activity.response?.choices && activity.response?.choices[item.id] === 'SELECTED' ? (
                <Image src={checkmark} style={{ height: '16px', marginHorizontal: 5 }} />
              ) : (
                <View style={styles.checkBox} />
              )}
              <Text style={styles.text12}>{item.name}</Text>
            </View>
          ))}
        </View>
      );
    case MandatoryActivity.SINGLE_SELECT:
    case MandatoryActivity.MULTISELECT:
      return (
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
              {activity.type === MandatoryActivity.MULTISELECT
                ? 'You can select multiple items . E.g. -'
                : 'You can select only one item. E.g. - '}
            </Text>
            <Image src={checkmark} style={{ height: '16px', marginHorizontal: 5 }} />
            <Text style={styles.activityHintText}>Remove the jacket from the assembly</Text>
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
              {activity.response?.choices && activity.response?.choices[item.id] === 'SELECTED' ? (
                <Image
                  src={checkmark}
                  style={{
                    height: '16px',
                    marginLeft: 2,
                    marginRight: 8,
                  }}
                />
              ) : (
                <View style={styles.checkBox} />
              )}
              <Text style={styles.text12}>{item.name}</Text>
            </View>
          ))}
        </View>
      );
    case MandatoryActivity.YES_NO:
      const yesNoItems = [];
      for (let i = 0; i < 4; i++) {
        yesNoItems.push(<View style={styles.commentsRow} />);
      }
      return (
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
            <Text style={styles.activityHintText}>Check either one option E.g. -</Text>
            <Image src={checkmark} style={{ height: '16px', marginHorizontal: 5 }} />
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
                flexWrap: 'wrap',
              },
            ]}
            wrap={false}
          >
            {(activity.response?.choices && activity.response?.choices[activity.data[0].id]) ===
            'SELECTED' ? (
              <Image src={checkmark} style={{ height: '16px', marginHorizontal: 5 }} />
            ) : (
              <View style={styles.checkBox} />
            )}
            <Text style={styles.text12}>
              {activity.data?.filter((d) => d.type === 'yes')[0].name || 'Positive'}
            </Text>
            <Text style={[styles.text12, { marginHorizontal: 20 }]}>or</Text>
            {activity.response?.choices &&
            activity.response?.choices[activity.data[1].id] === 'SELECTED' ? (
              <Image src={checkmark} style={{ height: '16px', marginHorizontal: 5 }} />
            ) : (
              <View style={styles.checkBox} />
            )}
            <Text style={styles.text12}>
              {activity.data?.filter((d) => d.type === 'no')[0].name || 'Negative'}
            </Text>
          </View>
          <View style={{ paddingVertical: 8 }} wrap={false}>
            <Text style={styles.text12}>
              If ‘{activity.data?.filter((d) => d.type === 'no')[0].name || 'Negative'}’ is ticked,
              a reason has to be written below
            </Text>
            <View style={styles.comments}>
              {activity.response?.reason ? (
                <Text style={styles.text12}>{activity.response?.reason}</Text>
              ) : (
                yesNoItems
              )}
            </View>
          </View>
        </View>
      );
    case NonMandatoryActivity.MATERIAL:
      return (
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
              <Text style={styles.text12}>{item.quantity !== 0 ? item.quantity : ''}</Text>
            </View>
          ))}
        </View>
      );
    case MandatoryActivity.MEDIA:
      return (
        <View style={styles.activityView} wrap={false}>
          <Text style={{ ...styles.text12, marginBottom: 16 }}>Uploaded Media:</Text>
          {activity.response?.medias?.length > 0 &&
            activity.response.medias.map(
              (imageDetails: {
                link: string;
                name: string;
                id: string;
                description: string | null;
              }) => {
                return (
                  <View key={imageDetails.id} style={{ marginBottom: 16 }} wrap={false} break>
                    <Text style={styles.text12}>
                      <Text
                        style={{
                          ...styles.text12,
                          marginRight: '2px',
                          fontWeight: 'bold',
                        }}
                      >
                        Name-
                      </Text>
                      {imageDetails.name}
                    </Text>

                    {imageDetails.description && (
                      <Text style={styles.text12}>
                        <Text
                          style={{
                            ...styles.text12,
                            marginRight: '2px',
                            fontWeight: 'bold',
                          }}
                        >
                          Description-
                        </Text>
                        {imageDetails.description}
                      </Text>
                    )}
                    <Image
                      src={imageDetails.link}
                      style={{ maxHeight: '230mm', marginTop: '8px', maxWidth: '100%' }}
                    />
                  </View>
                );
              },
            )}
        </View>
      );

    case MandatoryActivity.NUMBER:
      return (
        <View style={styles.activityView} wrap={false}>
          <Text style={{ ...styles.text12, marginTop: 6 }}>
            {activity.label}: {activity.response?.value ? activity.response?.value : '___'}{' '}
            {activity.data?.uom}
          </Text>
        </View>
      );

    case MandatoryActivity.CALCULATION:
      return (
        <View style={styles.activityView} wrap={false}>
          <Text style={{ ...styles.activityHintText, marginBottom: 6 }}>Calculation</Text>
          <Text style={styles.text12}>
            {activity.label} = {activity.data.expression}
          </Text>
          <Text style={{ ...styles.activityHintText, marginTop: 24, marginBottom: 6 }}>
            Input(s)
          </Text>
          {Object.entries(activity.data.variables).map(([key, value]: any) => {
            return (
              <Text style={styles.text12}>
                {key}:{' '}
                {activitiesById?.[value.activityId]?.response?.value
                  ? activitiesById?.[value.activityId]?.response.value
                  : '____'}
              </Text>
            );
          })}
          <Text style={{ ...styles.activityHintText, marginTop: 24, marginBottom: 6 }}>Result</Text>
          <Text style={{ ...styles.text12, backgroundColor: '#F0F0F0', padding: 8 }}>
            {activity.label} = {activity.response?.value ? activity.response.value : '_________'}{' '}
            {activity.data.uom}
          </Text>
        </View>
      );

    case MandatoryActivity.RESOURCE:
      return <ResourceActivity activity={activity} />;

    default:
      return null;
  }
};

const MemoActivityList: FC<{
  activities: Activity[];
  dateAndTimeStampFormat: string;
  activitiesById: ActivitiesById;
}> = ({ activities, dateAndTimeStampFormat, activitiesById }) => {
  return (
    <>
      {(activities as Array<Activity>).map((activity, activityIndex: number) => {
        return (
          <View key={`${activity.id}`}>
            {activityTemplateFormatter(
              activity,
              activityIndex,
              dateAndTimeStampFormat,
              activitiesById,
            )}
            <View style={styles.activitySeprator} />
            {activity.response.state !== TaskExecutionState.NOT_STARTED && (
              <View style={styles.taskFooter} wrap={false}>
                <Text style={styles.text12}>
                  This Activity was last updated digitally via Leucine {'\n'}
                  by {activity.response.audit.modifiedBy.firstName}{' '}
                  {activity.response.audit.modifiedBy.lastName}, ID:{' '}
                  {activity.response.audit.modifiedBy.employeeId} on{' '}
                  {moment.unix(activity.response.audit.modifiedAt).format(dateAndTimeStampFormat)}
                </Text>
              </View>
            )}
          </View>
        );
      })}
    </>
  );
};

const ActivityList = React.memo(MemoActivityList);

export default ActivityList;
