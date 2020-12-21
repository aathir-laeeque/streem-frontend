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
import { Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import moment from 'moment';
import { parseMarkUp } from '#utils/stringUtils';
import { EmojisUniCodes } from '#utils/constants';
import { InstructionTags } from './types';

const styles = StyleSheet.create({
  text12: {
    fontSize: 12,
    fontFamily: 'Nunito',
  },
  textS12: {
    fontSize: 12,
    // fontFamily: 'inherit',
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
});

type Response = { tag: string; text: string; childs: Response[] };
const getTagBasedDesign = (
  element: Response,
  childIndex: number,
  parentTag: string | null = null,
) => {
  switch (element.tag) {
    case InstructionTags.P:
      return (
        <View
          style={{ display: 'flex', flexDirection: 'row', marginVertical: 10 }}
        >
          {element.childs.map((child, i) => getTagBasedDesign(child, i))}
        </View>
      );
    case InstructionTags.SPAN:
      return (
        <View style={{ display: 'flex', flexDirection: 'row' }}>
          {element.childs.map((child, i) => getTagBasedDesign(child, i))}
        </View>
      );
    case InstructionTags.UL:
      return (
        <View>
          {element.childs.map((child, i) =>
            getTagBasedDesign(child, i, element.tag),
          )}
        </View>
      );
    case InstructionTags.OL:
      return (
        <View>
          {element.childs.map((child, i) =>
            getTagBasedDesign(child, i, element.tag),
          )}
        </View>
      );
    case InstructionTags.LI:
      return (
        <View style={{ display: 'flex', flexDirection: 'row' }}>
          {parentTag === InstructionTags.OL ? (
            <Text style={[styles.text12, { marginHorizontal: 5 }]}>•</Text>
          ) : (
            <Text style={[styles.text12, { marginHorizontal: 5 }]}>
              {childIndex + 1}.
            </Text>
          )}
          {element.childs.map((child, i) => getTagBasedDesign(child, i))}
        </View>
      );
    case InstructionTags.STRONG:
      return (
        <View style={{ fontFamily: 'NunitoBold' }}>
          {element.childs.map((child, i) => getTagBasedDesign(child, i))}
        </View>
      );
    case InstructionTags.INS:
      return (
        <View style={{ textDecoration: 'underline' }}>
          {element.childs.map((child, i) => getTagBasedDesign(child, i))}
        </View>
      );
    case InstructionTags.TEXT:
      const items = [];
      console.log('element.text', element.text);
      for (let i = 0; i < element.text.length; i++) {
        const unicode = element.text[i]
          .codePointAt(0)
          .toString(16)
          .toUpperCase();
        if (unicode.length !== 4) {
          items.push(
            <Text style={[styles.textS12, { minWidth: 6 }]}>
              {element.text[i]}
            </Text>,
          );
        } else {
          switch (unicode) {
            case EmojisUniCodes.CHECK:
              items.push(<Image src={checkEmoji} style={{ height: '12px' }} />);
              break;
            case EmojisUniCodes.EYE:
              items.push(<Image src={eyeEmoji} style={{ height: '12px' }} />);
              break;
            case EmojisUniCodes.STAR:
              items.push(<Image src={starEmoji} style={{ height: '12px' }} />);
              break;
            case EmojisUniCodes.TORCH:
              items.push(<Image src={torchEmoji} style={{ height: '12px' }} />);
              break;
            case EmojisUniCodes.TOOLBOX:
              items.push(
                <Image src={toolboxEmoji} style={{ height: '12px' }} />,
              );
              break;
            case EmojisUniCodes.HELMET:
              items.push(
                <Image src={helmetEmoji} style={{ height: '12px' }} />,
              );
              break;
            case EmojisUniCodes.GLASSES:
              items.push(
                <Image src={glassesEmoji} style={{ height: '12px' }} />,
              );
              break;
            case EmojisUniCodes.GLOVES:
              items.push(
                <Image src={glovesEmoji} style={{ height: '12px' }} />,
              );
              break;
            case EmojisUniCodes.CANCEL:
              items.push(
                <Image src={cancelEmoji} style={{ height: '12px' }} />,
              );
              break;
            case EmojisUniCodes.STOP:
              items.push(<Image src={stopEmoji} style={{ height: '12px' }} />);
              break;
            case EmojisUniCodes.VEST:
              items.push(<Image src={vestEmoji} style={{ height: '12px' }} />);
              break;
            case EmojisUniCodes.CLEAN:
              items.push(<Image src={cleanEmoji} style={{ height: '12px' }} />);
              break;
            case EmojisUniCodes.RECYCLE:
              items.push(
                <Image src={recycleEmoji} style={{ height: '12px' }} />,
              );
              break;
            case EmojisUniCodes.SOS:
              items.push(<Image src={sosEmoji} style={{ height: '12px' }} />);
              break;
            case EmojisUniCodes.FLAG:
              items.push(<Image src={flagEmoji} style={{ height: '12px' }} />);
              break;
            case EmojisUniCodes.ELECTRIC:
              items.push(
                <Image src={electricEmoji} style={{ height: '12px' }} />,
              );
              break;
            case EmojisUniCodes.FIRE:
              items.push(<Image src={fireEmoji} style={{ height: '12px' }} />);
              break;
            case EmojisUniCodes.CAUTION:
              items.push(
                <Image src={cautionEmoji} style={{ height: '12px' }} />,
              );
              break;
            case EmojisUniCodes.HAND:
              items.push(<Image src={handEmoji} style={{ height: '12px' }} />);
              break;
            case EmojisUniCodes.BIN:
              items.push(<Image src={binEmoji} style={{ height: '12px' }} />);
              break;
            case EmojisUniCodes.CROSS:
              items.push(<Image src={crossEmoji} style={{ height: '12px' }} />);
              break;
            case EmojisUniCodes.LOCK:
              items.push(<Image src={lockEmoji} style={{ height: '12px' }} />);
              break;
            default:
              console.log('IN DEFAULT');
              break;
          }
        }
      }
      return (
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            flex: 1,
          }}
        >
          {items}
        </View>
      );
    default:
      break;
  }
};

const activityTemplateFormatter = (
  activity: Activity,
  activityIndex: number,
) => {
  switch (activity.type) {
    case NonMandatoryActivity.INSTRUCTION:
      const node = document.createElement('div');
      node.innerHTML = activity.data.text;
      const res = parseMarkUp(node);
      return (
        <View style={styles.activityView}>
          {res.map((parent, i) => getTagBasedDesign(parent, i))}
        </View>
      );
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
        signatureItems.push(
          <View style={[styles.commentsRow, { borderBottomWidth: 0 }]} />,
        );
      }
      return (
        <View style={styles.activityView} wrap={false}>
          <Text style={styles.text12}>Sign Below</Text>
          {activity.response?.medias?.[0] ? (
            <Image
              src={activity.response?.medias[0]?.link}
              style={{ width: '300px' }}
            />
          ) : (
            <View style={[styles.comments, { width: 300 }]}>
              {signatureItems}
            </View>
          )}
        </View>
      );
    case MandatoryActivity.PARAMETER:
    case MandatoryActivity.SHOULD_BE:
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
        <View style={styles.activityView}>
          <Text
            style={styles.text12}
          >{`${activity.data.parameter} Should be${content}`}</Text>
          <Text style={[styles.text12, { marginTop: 11, marginBottom: 16 }]}>
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
            <Text style={styles.activityHintText}>
              Check all the items. E.g. -
            </Text>
            <Image
              src={checkmark}
              style={{ height: '16px', marginHorizontal: 5 }}
            />
            <Text style={styles.activityHintText}>
              Remove the jacket from the assembly
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
            <Image
              src={checkmark}
              style={{ height: '16px', marginHorizontal: 5 }}
            />
            <Text style={styles.activityHintText}>
              Remove the jacket from the assembly
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
            <Text style={styles.text12}>Positive</Text>
            <Text style={[styles.text12, { marginHorizontal: 20 }]}>or</Text>
            {activity.response?.choices &&
            activity.response?.choices[activity.data[1].id] === 'SELECTED' ? (
              <Image
                src={checkmark}
                style={{ height: '16px', marginHorizontal: 5 }}
              />
            ) : (
              <View style={styles.checkBox} />
            )}
            <Text style={styles.text12}>Negative</Text>
          </View>
          <View style={{ paddingVertical: 8 }} wrap={false}>
            <Text style={styles.text12}>
              If ‘NO’ is ticked, a reason has to be written below
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
              <Text style={styles.text12}>
                {item.quantity !== 0 ? item.quantity : ''}
              </Text>
            </View>
          ))}
        </View>
      );
    default:
      return null;
  }
};

const MemoActivityList: FC<{ activities: Activity[] }> = ({ activities }) => {
  return (
    <>
      {(activities as Array<Activity>).map(
        (activity, activityIndex: number) => {
          return (
            <View key={`${activity.id}`}>
              {activityTemplateFormatter(activity, activityIndex)}
              <View style={styles.activitySeprator} />
              {activity.response.state !== TaskExecutionState.NOT_STARTED && (
                <View style={styles.taskFooter} wrap={false}>
                  <Text style={styles.text12}>
                    This Activity was last updated digitally via CLEEN {'\n'}
                    by {activity.response.audit.modifiedBy.firstName}{' '}
                    {activity.response.audit.modifiedBy.lastName}, ID:{' '}
                    {activity.response.audit.modifiedBy.employeeId} on{' '}
                    {moment
                      .unix(activity.response.audit.modifiedAt)
                      .format('MMM DD, h:mm A')}
                  </Text>
                </View>
              )}
            </View>
          );
        },
      )}
    </>
  );
};

const ActivityList = React.memo(MemoActivityList);

export default ActivityList;
