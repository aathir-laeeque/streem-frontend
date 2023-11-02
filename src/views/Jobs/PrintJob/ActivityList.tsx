import React, { FC } from 'react';
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
import ReactPDF, { Text, View, StyleSheet, Image, Link } from '@react-pdf/renderer';
import { parseMarkUp } from '#utils/stringUtils';
import { EmojisUniCodes } from '#utils/constants';
import { InstructionTags } from './types';
import ResourceParameter from './Resource';
import MultiResourceParameter from './MultiResource';
import { formatDateTime } from '#utils/timeUtils';
import { InputTypes } from '#utils/globalTypes';
import {
  MandatoryParameter,
  NonMandatoryParameter,
  Parameter,
  ParameterVerificationTypeEnum,
  TASK_EXECUTION_STATES,
} from '#types';
import { ParametersById } from '#PrototypeComposer/Activity/reducer.types';
export const styles = StyleSheet.create({
  text12: {
    fontSize: 12,
    fontFamily: 'Nunito',
  },
  textS12: {
    fontSize: 12,
  },
  parameterHintText: {
    color: '#666666',
    fontSize: 12,
    fontFamily: 'Nunito',
  },
  parameterView: {
    paddingVertical: 8,
    marginBottom: 8,
  },
  parameterSeprator: {
    borderTopWidth: 1,
    borderTopColor: '#dadada',
    borderTopStyle: 'dashed',
  },
  materialParameterItems: {
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

const parameterTemplateFormatter = (
  parameter: Parameter,
  parameterIndex: number,
  dateAndTimeStampFormat: string,
  parametersById: ParametersById,
  cjfParametersById: ParametersById,
) => {
  switch (parameter.type) {
    case NonMandatoryParameter.INSTRUCTION:
      const node = document.createElement('div');
      node.innerHTML = parameter.data.text;
      const res = parseMarkUp(node);
      return (
        <View style={styles.parameterView}>
          <Text style={styles.text12}>{parameter.label}</Text>
          {getInstructionTemplate(res)}
        </View>
      );
    case MandatoryParameter.SINGLE_LINE:
    case MandatoryParameter.MULTI_LINE:
      const items = [];
      const rowsCounts = parameter.type === MandatoryParameter.MULTI_LINE ? 8 : 1;
      for (let i = 0; i < rowsCounts; i++) {
        items.push(<View style={styles.commentsRow} />);
      }
      return (
        <View style={styles.parameterView} wrap={false}>
          <Text style={styles.text12}>{parameter.label}</Text>
          <Text style={styles.text12}>Write Your Comments</Text>
          <View style={styles.comments}>
            {parameter.response?.value ? (
              <Text style={styles.text12}>{parameter.response?.value}</Text>
            ) : (
              items
            )}
          </View>
        </View>
      );
    case MandatoryParameter.SIGNATURE:
      const signatureItems = [];
      for (let i = 0; i < 8; i++) {
        signatureItems.push(<View style={[styles.commentsRow, { borderBottomWidth: 0 }]} />);
      }
      return (
        <View
          style={styles.parameterView}
          wrap={false}
          {...(parameter.response?.medias?.[0] && { break: true })}
        >
          <Text style={styles.text12}>{parameter.label}</Text>
          <Text style={styles.text12}>Sign Below</Text>
          {parameter.response?.medias?.[0] ? (
            <Image
              src={parameter.response?.medias[0]?.link}
              style={{ width: '300px', maxHeight: '230mm' }}
            />
          ) : (
            <View style={[styles.comments, { width: 300 }]}>{signatureItems}</View>
          )}
        </View>
      );
    case MandatoryParameter.SHOULD_BE:
      let content = '';
      const { data } = parameter;
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

      const approvalState = parameter?.response?.parameterValueApprovalDto?.state;
      return (
        <View style={styles.parameterView}>
          <Text style={styles.text12}>{`${parameter.label} Should be${content}`}</Text>
          <Text style={[styles.text12, { marginTop: 11, marginBottom: 16 }]}>
            Write your Observed Value
          </Text>
          <View style={{ display: 'flex', flexDirection: 'row' }}>
            {parameter.response?.value ? (
              [...parameter.response?.value].map((char) =>
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
                This Parameter was {approvalState === 'APPROVED' ? 'approved' : 'rejected'}{' '}
                digitally via Leucine {'\n'}
                by {parameter.response.parameterValueApprovalDto.approver.firstName}{' '}
                {parameter.response.parameterValueApprovalDto.approver.lastName}, ID:{' '}
                {parameter.response.parameterValueApprovalDto.approver.employeeId} on{' '}
                {formatDateTime({ value: parameter.response.parameterValueApprovalDto.createdAt })}
              </Text>
            </View>
          )}
          {!!parameter?.response?.reason && (
            <View style={styles.comments}>
              <Text style={styles.text12}>{parameter.response.reason}</Text>
            </View>
          )}
        </View>
      );
    case MandatoryParameter.CHECKLIST:
      return (
        <View style={styles.parameterView}>
          <Text style={styles.text12}>{parameter.label}</Text>
          {parameter.data.map((item) => (
            <View
              wrap={false}
              key={`${item.id}`}
              style={[
                styles.materialParameterItems,
                { justifyContent: 'flex-start', borderBottomWidth: 0 },
              ]}
            >
              {parameter.response?.choices &&
              parameter.response?.choices[item.id] === 'SELECTED' ? (
                <Image src={checkmark} style={{ height: '16px', marginHorizontal: 5 }} />
              ) : (
                <View style={styles.checkBox} />
              )}
              <Text style={styles.text12}>{item.name}</Text>
            </View>
          ))}
        </View>
      );
    case MandatoryParameter.SINGLE_SELECT:
    case MandatoryParameter.MULTISELECT:
      return (
        <View style={styles.parameterView}>
          <Text style={styles.text12}>{parameter.label}</Text>
          {parameter.data.map((item) => (
            <View
              key={`${item.id}`}
              style={[
                styles.materialParameterItems,
                { justifyContent: 'flex-start', borderBottomWidth: 0 },
              ]}
              wrap={false}
            >
              {parameter.response?.choices &&
              parameter.response?.choices[item.id] === 'SELECTED' ? (
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
    case MandatoryParameter.YES_NO:
      const yesNoItems = [];
      for (let i = 0; i < 4; i++) {
        yesNoItems.push(<View style={styles.commentsRow} />);
      }
      return (
        <View style={styles.parameterView}>
          <Text style={styles.yesNoLabel}>{parameter.label}</Text>
          <View
            style={[
              styles.materialParameterItems,
              {
                justifyContent: 'flex-start',
                borderBottomWidth: 0,
                flexWrap: 'wrap',
              },
            ]}
            wrap={false}
          >
            {(parameter.response?.choices && parameter.response?.choices[parameter.data[0].id]) ===
            'SELECTED' ? (
              <Image src={checkmark} style={{ height: '16px', marginHorizontal: 5 }} />
            ) : (
              <View style={styles.checkBox} />
            )}
            <Text style={styles.text12}>
              {parameter.data?.filter((d) => d.type === 'yes')[0].name || 'Positive'}
            </Text>
            <Text style={[styles.text12, { marginHorizontal: 20 }]}>or</Text>
            {parameter.response?.choices &&
            parameter.response?.choices[parameter.data[1].id] === 'SELECTED' ? (
              <Image src={checkmark} style={{ height: '16px', marginHorizontal: 5 }} />
            ) : (
              <View style={styles.checkBox} />
            )}
            <Text style={styles.text12}>
              {parameter.data?.filter((d) => d.type === 'no')[0].name || 'Negative'}
            </Text>
          </View>
          <View style={{ paddingVertical: 8 }} wrap={false}>
            <Text style={styles.text12}>
              If ‘{parameter.data?.filter((d) => d.type === 'no')[0].name || 'Negative'}’ is ticked,
              a reason has to be written below
            </Text>
            <View style={styles.comments}>
              {parameter.response?.reason ? (
                <Text style={styles.text12}>{parameter.response?.reason}</Text>
              ) : (
                yesNoItems
              )}
            </View>
          </View>
        </View>
      );
    case NonMandatoryParameter.MATERIAL:
      return (
        <View
          style={[
            styles.parameterView,
            {
              width: '75%',
            },
          ]}
        >
          <Text style={styles.text12}>{parameter.label}</Text>
          {parameter.data.map((item, itemIndex: number) => (
            <View
              key={`${parameter.id}_${itemIndex}`}
              style={styles.materialParameterItems}
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
    case MandatoryParameter.FILE_UPLOAD:
    case MandatoryParameter.MEDIA:
      return (
        <View style={styles.parameterView} wrap={false}>
          <Text style={styles.text12}>{parameter.label}</Text>
          <Text style={{ ...styles.text12, marginBottom: 16 }}>Uploaded Media:</Text>
          {parameter.response?.medias?.length > 0
            ? parameter.response.medias.map(
                (imageDetails: {
                  link: string;
                  name: string;
                  filename: string;
                  id: string;
                  description: string | null;
                }) => {
                  const fileExtension = imageDetails.filename.split('.').pop();
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
                          Name -
                        </Text>
                        <Link src={imageDetails.link} style={styles.link}>
                          {' '}
                          {imageDetails.name}.{fileExtension}
                        </Link>
                      </Text>

                      {imageDetails.description ? (
                        <Text style={styles.text12}>
                          <Text
                            style={{
                              ...styles.text12,
                              marginRight: '2px',
                              fontWeight: 'bold',
                            }}
                          >
                            Description -
                          </Text>{' '}
                          {imageDetails.description}
                        </Text>
                      ) : null}
                      {parameter.type === MandatoryParameter.MEDIA ? (
                        <Image
                          src={imageDetails.link}
                          style={{ maxHeight: '230mm', marginTop: '8px', maxWidth: '100%' }}
                        />
                      ) : null}
                    </View>
                  );
                },
              )
            : null}
        </View>
      );

    case MandatoryParameter.NUMBER:
      return (
        <View style={styles.parameterView} wrap={false}>
          <Text style={{ ...styles.text12, marginTop: 6 }}>
            {parameter.label}: {parameter.response?.value ? parameter.response?.value : '___'}{' '}
            {parameter.data?.uom}
          </Text>
        </View>
      );

    case MandatoryParameter.CALCULATION:
      const allParameterById = { ...parametersById, ...cjfParametersById };

      return (
        <View style={styles.parameterView} wrap={false}>
          <Text style={{ ...styles.parameterHintText, marginBottom: 6 }}>Calculation</Text>
          <Text style={styles.text12}>
            {parameter.label} = {parameter.data.expression}
          </Text>
          <Text style={{ ...styles.parameterHintText, marginTop: 24, marginBottom: 6 }}>
            Input(s)
          </Text>
          {Object.entries(parameter.data.variables).map(([key, value]: any) => {
            return (
              <Text style={styles.text12}>
                {key}:{' '}
                {allParameterById?.[value.parameterId]?.response?.value
                  ? allParameterById?.[value.parameterId]?.response.value
                  : '____'}
              </Text>
            );
          })}
          <Text style={{ ...styles.parameterHintText, marginTop: 24, marginBottom: 6 }}>
            Result
          </Text>
          <Text style={{ ...styles.text12, backgroundColor: '#F0F0F0', padding: 8 }}>
            {parameter.label} = {parameter.response?.value ? parameter.response.value : '_________'}{' '}
            {parameter.data.uom}
          </Text>
        </View>
      );

    case MandatoryParameter.RESOURCE:
      return <ResourceParameter parameter={parameter} />;

    case MandatoryParameter.MULTI_RESOURCE:
      return <MultiResourceParameter parameter={parameter} />;

    case MandatoryParameter.DATE_TIME:
    case MandatoryParameter.DATE:
      return (
        <View style={styles.parameterView} wrap={false}>
          <Text style={{ ...styles.text12, marginTop: 6 }}>
            {parameter.label}:{' '}
            {parameter.response?.value
              ? formatDateTime({
                  value: parameter.response?.value,
                  type: parameter.type as unknown as InputTypes,
                })
              : '_____'}
          </Text>
        </View>
      );

    default:
      return null;
  }
};

const parameterVerificationAudits = (parameterVerifications: []) => {
  return parameterVerifications.map((verification) => {
    switch (verification.verificationType) {
      case ParameterVerificationTypeEnum.SELF:
        return (
          <View style={styles.parameterView} wrap={false}>
            <Text style={styles.text12}>
              This activity was self-verified and accepted digitally via Leucine {'\n'}
              by{' '}
              {verification.verificationStatus === 'ACCEPTED'
                ? `${verification.requestedTo.firstName} ${verification.requestedTo.lastName}, ID: ${verification.requestedTo.employeeId}`
                : `__________`}{' '}
              on{' '}
              {verification.verificationStatus === 'ACCEPTED'
                ? `${formatDateTime({ value: verification.modifiedAt })}`
                : `__________`}
            </Text>
          </View>
        );

      case ParameterVerificationTypeEnum.PEER:
        if (verification.verificationStatus === 'REJECTED') {
          return (
            <View style={styles.parameterView} wrap={false}>
              <Text style={styles.text12}>
                This activity was peer-verified and rejected digitally via Leucine {'\n'}
                by {verification.requestedTo.firstName} {verification.requestedTo.lastName}, ID:{' '}
                {verification.requestedTo.employeeId} on{' '}
                {formatDateTime({ value: verification.modifiedAt })}
              </Text>
              <View style={styles.comments}>
                <Text style={styles.text12}>{verification.comments}</Text>
              </View>
            </View>
          );
        } else {
          return (
            <View style={styles.parameterView} wrap={false}>
              <Text style={styles.text12}>
                This activity was peer-verified and{' '}
                {verification.verificationStatus === 'ACCEPTED' ? 'accepted' : '_________'}{' '}
                digitally via Leucine {'\n'}
                by{' '}
                {verification.verificationStatus === 'ACCEPTED'
                  ? `${verification.requestedTo.firstName} ${verification.requestedTo.lastName}, ID: ${verification.requestedTo.employeeId}`
                  : `__________`}{' '}
                on{' '}
                {verification.verificationStatus === 'ACCEPTED'
                  ? `${formatDateTime({ value: verification.modifiedAt })}`
                  : `__________`}
              </Text>
            </View>
          );
        }
    }
  });
};

const parameterVerificationDetails = (verificationType: string) => {
  switch (verificationType) {
    case ParameterVerificationTypeEnum.SELF:
      return (
        <View style={styles.parameterView} wrap={false}>
          <Text style={styles.text12}>
            {' '}
            This activity was self-verified and accepted digitally via Leucine by _________ on
            ________
          </Text>
        </View>
      );

    case ParameterVerificationTypeEnum.PEER:
      return (
        <View style={styles.parameterView} wrap={false}>
          <Text style={styles.text12}>
            {' '}
            This activity was peer-verified and __________ digitally via Leucine by _________ on
            ________
          </Text>
        </View>
      );

    case ParameterVerificationTypeEnum.BOTH:
      return (
        <View style={styles.parameterView} wrap={false}>
          <Text style={styles.text12}>
            {' '}
            This activity was self-verified and accepted digitally via Leucine by _________ on
            ________
          </Text>
          <Text style={styles.text12}>
            {' '}
            This activity was peer-verified and __________ digitally via Leucine by _________ on
            ________
          </Text>
        </View>
      );
  }
};

const MemoParameterList: FC<{
  parameters: Parameter[];
  dateAndTimeStampFormat: string;
  parametersById: ParametersById;
  hiddenIds: Record<string, boolean>;
  cjfParametersById: ParametersById;
}> = ({ parameters, dateAndTimeStampFormat, parametersById, hiddenIds, cjfParametersById }) => {
  return (
    <>
      {(parameters as Array<Parameter>).map((parameter, parameterIndex: number) => {
        if (hiddenIds[parameter.id] === undefined) {
          return (
            <View key={`${parameter.id}`}>
              {parameterTemplateFormatter(
                parameter,
                parameterIndex,
                dateAndTimeStampFormat,
                parametersById,
                cjfParametersById,
              )}
              <View style={styles.parameterSeprator} />
              {parameter.response.state !== TASK_EXECUTION_STATES.NOT_STARTED &&
                parameter.response.audit.modifiedBy && (
                  <View style={styles.taskFooter} wrap={false}>
                    <Text style={styles.text12}>
                      This Activity was last updated digitally via Leucine {'\n'}
                      by {parameter.response.audit.modifiedBy.firstName}{' '}
                      {parameter.response.audit.modifiedBy.lastName}, ID:{' '}
                      {parameter.response.audit.modifiedBy.employeeId} on{' '}
                      {formatDateTime({ value: parameter.response.audit.modifiedAt })}
                    </Text>
                  </View>
                )}
              {parameter.response.verificationType !== ParameterVerificationTypeEnum.NONE &&
                parameter.response.parameterVerifications &&
                parameterVerificationAudits(parameter.response.parameterVerifications)}
              {parameter.response.verificationType !== ParameterVerificationTypeEnum.NONE &&
                !parameter.response.parameterVerifications &&
                parameterVerificationDetails(parameter.verificationType)}
            </View>
          );
        }
      })}
    </>
  );
};

const ParameterList = React.memo(MemoParameterList);

export default ParameterList;
