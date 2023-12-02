import { Media, Parameter, TaskExecutionState } from '#PrototypeComposer/checklist.types';
import { PdfText, commonPdfStyles, tableStyles } from '#components/documents';
import { getUserName } from '#services/users/helpers';
import {
  MandatoryParameter,
  NonMandatoryParameter,
  ParameterState,
  ParameterVerificationStatus,
  ParameterVerificationTypeEnum,
} from '#types';
import { responseDetailsForChoiceBasedParameters } from '#utils/parameterUtils';
import { parseMarkUp } from '#utils/stringUtils';
import { formatDateTime } from '#utils/timeUtils';
import { PrintContext } from '#views/Jobs/PrintJob/PrintContext';
import { DEFAULT_VALUE } from '#views/Jobs/PrintJob/constant';
import { InstructionTags } from '#views/Jobs/PrintJob/types';
import { Link, StyleSheet, View } from '@react-pdf/renderer';
import { Style } from '@react-pdf/types';
import { parseHTML } from 'linkedom';
import { capitalize } from 'lodash';
import React, { useContext } from 'react';

const renderVerificationText = (
  verificationData: any[],
  type: string,
  isTaskCompleted: boolean,
  dateAndTimeStampFormat: string,
) => {
  const renderOutPutView = (verification: any) => {
    return verification?.verificationStatus &&
      [ParameterVerificationStatus.ACCEPTED, ParameterVerificationStatus.REJECTED].includes(
        verification.verificationStatus,
      ) ? (
      <PdfText style={tableStyles.columnText}>
        {capitalize(type)} Verified by:{' '}
        <PdfText style={{ ...tableStyles.columnText, fontWeight: 600 }}>
          {getUserName({ user: verification.modifiedBy, withEmployeeId: true })}
        </PdfText>{' '}
        on{' '}
        {formatDateTime({
          value: verification.modifiedAt,
          format: dateAndTimeStampFormat,
        })}
        {verification.verificationStatus === ParameterVerificationStatus.REJECTED && ' [REJECTED]'}
      </PdfText>
    ) : (
      <PdfText style={tableStyles.columnText}>
        {capitalize(type)} Verified by: {isTaskCompleted ? DEFAULT_VALUE : '_________ '}
      </PdfText>
    );
  };

  const verificationPayload = verificationData?.find(
    ({ verificationType }) => verificationType === type,
  );

  return renderOutPutView(verificationPayload);
};

const parameterVerificationStatus = (
  parameter: Parameter,
  dateAndTimeStampFormat: string,
  isTaskCompleted: boolean,
) => {
  if (!parameter?.verificationType || parameter?.verificationType === 'NONE') {
    return null;
  }

  let verifications = [parameter.verificationType];

  if (parameter.verificationType === ParameterVerificationTypeEnum.BOTH) {
    verifications = [ParameterVerificationTypeEnum.SELF, ParameterVerificationTypeEnum.PEER];
  }

  return (
    <View>
      {verifications.map((verificationType) => {
        return renderVerificationText(
          parameter.response?.parameterVerifications,
          verificationType,
          isTaskCompleted,
          dateAndTimeStampFormat,
        );
      })}
    </View>
  );
};

const getIsTaskCompleted = (taskState: string) =>
  [
    TaskExecutionState.COMPLETED,
    TaskExecutionState.COMPLETED_WITH_EXCEPTION,
    TaskExecutionState.SKIPPED,
  ].includes(taskState as any);

const styles = StyleSheet.create({
  text10: {
    fontSize: 10,
  },
  wrappedView: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
});

type Response = { tag: string; text: string; childs: Response[] };

const getInstructionTemplate = (res: Response[]): JSX.Element[] => {
  const items: JSX.Element[][] = [];
  let newLine = -1;
  const getTagBasedDesign: any = (
    element: Response,
    childIndex: number,
    parent: Response | null = null,
    extraStyles: Style = {},
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
            i === 0 ? (parent?.tag === InstructionTags.UL ? '• ' : childIndex + 1 + '. ') : null,
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
              fontWeight: 700,
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
        items[newLine].push(
          <PdfText style={{ ...styles.text10, ...extraStyles }}>
            {(listValue || '') + element.text + ' '}
          </PdfText>,
        );
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

const getShouldBeOperator = (params: any) => {
  switch (params?.operator) {
    case 'EQUAL_TO':
      return `Equal To ${params.value}`;
    case 'LESS_THAN':
      return `Less Than ${params.value}`;
    case 'LESS_THAN_EQUAL_TO':
      return `Less Than Equal To ${params.value}`;
    case 'MORE_THAN':
      return `More Than ${params.value}`;
    case 'MORE_THAN_EQUAL_TO':
      return `More Than Equal To ${params.value}`;
    case 'BETWEEN':
      return `Between ${params.lowerValue} - ${params.upperValue}`;
    default:
      return;
  }
};

const renderInstructionParameter = (parameter: any) => {
  const { document } = parseHTML(`
  `);
  const node = document.createElement('div');
  node.innerHTML = parameter.data.text;
  const res = parseMarkUp(node);
  return <View>{getInstructionTemplate(res)}</View>;
};

const renderMaterialParameter = (parameter: any) => {
  return (
    <View style={{ display: 'flex', flexDirection: 'row', gap: 2, flexWrap: 'wrap' }}>
      {(parameter.data || []).map((media: Media) => (
        <Link src={media.link}>
          <PdfText style={commonPdfStyles.link}>{media.name || media.filename}</PdfText>
        </Link>
      ))}
    </View>
  );
};

export const isParameterNeeded = (parameter: Parameter, hiddenIds: Record<string, boolean>) => {
  if (
    (parameter.type === MandatoryParameter.MEDIA ||
      parameter.type === MandatoryParameter.FILE_UPLOAD) &&
    parameter.response?.state !== ParameterState.EXECUTED
  ) {
    return false;
  }
  if (hiddenIds[parameter.response?.id]) {
    return false;
  }
  return true;
};

export const getLabelDetails = (parameter: Parameter) => {
  switch (parameter?.type) {
    case MandatoryParameter.SHOULD_BE:
      return parameter.label + ' ' + `( ${getShouldBeOperator(parameter?.data)} )`;
    case MandatoryParameter.CALCULATION:
      let content = '';
      let calculationParameter = parameter.label + ' ';
      for (let key in parameter?.data?.variables) {
        calculationParameter =
          calculationParameter + key + ' = ' + parameter?.data?.variables[key]?.label + '; ';
      }
      calculationParameter = calculationParameter + ' Output = ' + parameter?.data?.expression;
      content = calculationParameter;
      return content;
    default:
      return parameter.label;
  }
};

export const getParameterDetails = (parameter: any, taskState: string) => {
  const { dateAndTimeStampFormat, dateFormat } = useContext(PrintContext);
  let parameterContent: (() => JSX.Element) | string = '';
  const isTaskCompleted = getIsTaskCompleted(taskState);
  if (parameter.response.state !== ParameterState.NOT_STARTED || isTaskCompleted) {
    switch (parameter.type) {
      case MandatoryParameter.SHOULD_BE:
        parameterContent = DEFAULT_VALUE;
        if (parameter.response?.value) {
          parameterContent =
            (parameter.response.value || DEFAULT_VALUE) +
            (parameter.response.reason ? ' Remarks:' + parameter.response.reason : '') +
            `${
              parameter.response.state === ParameterVerificationStatus.PENDING
                ? 'Pending Approval'
                : parameter.response.state === ParameterVerificationStatus.REJECTED
                ? `Rejected by [${getUserName({
                    user: parameter.response?.audit?.modifiedBy,
                    withEmployeeId: true,
                  })}]`
                : ''
            }`;
        } else if (!isTaskCompleted) {
          parameterContent = () => <View style={commonPdfStyles.input} />;
        }
        break;
      case MandatoryParameter.MULTI_LINE:
      case MandatoryParameter.SINGLE_LINE:
      case MandatoryParameter.NUMBER:
        parameterContent = DEFAULT_VALUE;
        if (parameter.response?.value) {
          parameterContent = parameter.response?.value;
        } else if (!isTaskCompleted) {
          parameterContent = () => <View style={commonPdfStyles.input} />;
        }
        break;
      case MandatoryParameter.DATE:
      case MandatoryParameter.DATE_TIME:
        parameterContent = parameter.response.value
          ? formatDateTime({
              value: parameter.response.value,
              format:
                parameter.type === MandatoryParameter.DATE ? dateFormat : dateAndTimeStampFormat,
            })
          : DEFAULT_VALUE;
        break;
      case MandatoryParameter.MULTISELECT:
      case MandatoryParameter.CHECKLIST:
        parameterContent = DEFAULT_VALUE;
        if (parameter.response.choices) {
          parameterContent = responseDetailsForChoiceBasedParameters(parameter);
        } else if (!isTaskCompleted) {
          parameterContent =
            parameter.data?.map((value: any) => `[ ] ${value.name}`).join(', ') || '';
        }
        break;
      case MandatoryParameter.SINGLE_SELECT:
      case MandatoryParameter.YES_NO:
        parameterContent = DEFAULT_VALUE;
        if (parameter.response.choices) {
          parameterContent = responseDetailsForChoiceBasedParameters(parameter);
        } else if (!isTaskCompleted) {
          parameterContent =
            parameter.data?.map((value: any) => `( ) ${value.name}`).join(', ') || '';
        }
        break;
      case NonMandatoryParameter.MATERIAL:
        parameterContent = () => renderMaterialParameter(parameter);
        break;
      case MandatoryParameter.RESOURCE:
      case MandatoryParameter.MULTI_RESOURCE:
        parameterContent = DEFAULT_VALUE;
        if (parameter.response?.choices?.length) {
          parameterContent = (parameter.response.choices || [])
            .map(
              (currChoice: any) =>
                `${currChoice.objectDisplayName} (ID: ${currChoice.objectExternalId})`,
            )
            .join(', ');
        } else if (!isTaskCompleted) {
          parameterContent = () => <View style={commonPdfStyles.input} />;
        }
        break;
      case MandatoryParameter.SIGNATURE:
      case MandatoryParameter.FILE_UPLOAD:
      case MandatoryParameter.MEDIA:
        parameterContent = () => (
          <View style={{ display: 'flex', flexDirection: 'row', gap: 2, flexWrap: 'wrap' }}>
            {parameter.response.medias?.length ? (
              parameter.response.medias.map((media: Media) => (
                <Link src={media.link}>
                  <PdfText style={commonPdfStyles.link}>
                    {parameter.type === MandatoryParameter.SIGNATURE
                      ? 'Signature'
                      : media.name || media.filename}
                  </PdfText>
                </Link>
              ))
            ) : (
              <PdfText style={tableStyles.columnText}>{DEFAULT_VALUE}</PdfText>
            )}
          </View>
        );
        break;
      case NonMandatoryParameter.INSTRUCTION:
        parameterContent = () => renderInstructionParameter(parameter);
        break;
      case MandatoryParameter.CALCULATION:
        parameterContent = parameter.response.value || DEFAULT_VALUE;
        break;
      default:
        break;
    }
  } else {
    switch (parameter.type) {
      case MandatoryParameter.SINGLE_SELECT:
      case MandatoryParameter.YES_NO:
        parameterContent =
          parameter.data?.map((value: any) => `( ) ${value.name}`).join(', ') || '';
        break;
      case MandatoryParameter.MULTISELECT:
      case MandatoryParameter.CHECKLIST:
        parameterContent =
          parameter.data?.map((value: any) => `[ ] ${value.name}`).join(', ') || '';
        break;
      case NonMandatoryParameter.MATERIAL:
        parameterContent = () => renderMaterialParameter(parameter);
        break;
      case NonMandatoryParameter.INSTRUCTION:
        parameterContent = () => renderInstructionParameter(parameter);
        break;
      default:
        parameterContent = () => <View style={commonPdfStyles.input} />;
        break;
    }
  }

  return (
    <View style={{ display: 'flex' }}>
      {typeof parameterContent === 'string' ? (
        <View>
          <PdfText style={tableStyles.columnText}>{parameterContent || DEFAULT_VALUE}</PdfText>
        </View>
      ) : (
        parameterContent()
      )}
      <View>
        <PdfText style={tableStyles.columnText}>
          {parameterVerificationStatus(parameter, dateAndTimeStampFormat, isTaskCompleted)}
        </PdfText>
      </View>
    </View>
  );
};
