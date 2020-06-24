import { Form, renderInputField } from '#components/FormComponents';
import { AppDispatch, RootState } from '#store';

import {
  ArrowDownwardOutlined,
  ArrowUpwardOutlined,
  FileCopyOutlined,
  PlaylistAddOutlined,
} from '@material-ui/icons';
import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { Field, FieldArray, formValueSelector, reduxForm } from 'redux-form';

import { setActiveStage } from './actions';
import { Wrapper } from './styles';

const renderStages = ({ fields, dispatch, activeStageIndex }) => (
  <>
    <ol className="stage-list">
      {fields.map((field, index) => (
        <li
          key={index}
          className={`stage-list-item ${
            index === activeStageIndex ? 'stage-list-item-active' : ''
          }`}
          onClick={() => dispatch(setActiveStage(index))}
        >
          <Field
            name={`${field}.name`}
            type="text"
            component={renderInputField}
            placeholder="Stage Name"
          />
        </li>
      ))}
    </ol>

    <div className="stage-list-control-buttons">
      <div onClick={() => fields.push()} id="add_stage">
        <PlaylistAddOutlined className="icon" />
        <span>New Stage</span>
      </div>
      <div id="duplicate_stage">
        <FileCopyOutlined className="icon" />
        <span>Duplicate</span>
      </div>
      <div id="move_stage_up">
        <ArrowUpwardOutlined className="icon" />
        <span>Move up</span>
      </div>
      <div id="move_stage_down">
        <ArrowDownwardOutlined className="icon" />
        <span>Move down</span>
      </div>
    </div>
  </>
);

const StageListViewForm = ({ dispatch, activeStageIndex }) => (
  <Wrapper>
    <Form>
      <FieldArray
        name="stages"
        component={renderStages}
        activeStageIndex={activeStageIndex}
        dispatch={dispatch}
      />
    </Form>
  </Wrapper>
);

const formName = 'stageListForm';

const withReduxForm = reduxForm({ form: formName });

// const valueSelector = formValueSelector(formName);

const mapStateToProps = (state: RootState) => ({
  // stages: valueSelector(state, 'stages'),
  activeStageIndex: state.checklistComposer.activeStageIndex,
});

const mapDispatchToProps = (dispatch: AppDispatch) => ({
  dispatch,
});

const withConnect = connect(mapStateToProps, mapDispatchToProps);

const StageListView = compose(withReduxForm, withConnect)(StageListViewForm);

export default StageListView;
