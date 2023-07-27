import React from 'react';
import { render, fireEvent, getByTestId } from '@testing-library/react';
import { Input } from '#components/shared/Input';
import { TextInput, NumberInput } from '#components';

describe('Input', () => {
  test('renders without errors', () => {
    render(<Input />);
  });

  test('displays label correctly', () => {
    const labelText = 'First Name';
    const { getByText } = render(<Input label={labelText} />);
    const labelElement = getByText(labelText);
    expect(labelElement).toBeInTheDocument();
  });

  test('invokes onChange callback correctly', () => {
    const onChangeMock = jest.fn();
    const { getByTestId } = render(<Input label="Input" name="Input" onChange={onChangeMock} />);
    const inputElement = getByTestId('input-element');
    fireEvent.change(inputElement, { target: { value: 'Test' } });
    expect(onChangeMock).toHaveBeenCalledTimes(1);
    expect(onChangeMock).toHaveBeenCalledWith({ name: 'Input', value: 'Test' });
  });

  test('renders optional badge when optional prop is true', () => {
    const { getByText } = render(<Input label="Input" optional />);
    const optionalBadge = getByText('Optional');
    expect(optionalBadge).toBeInTheDocument();
  });

  test('does not render optional badge when optional prop is false', () => {
    const { queryByText } = render(<Input label="Input" />);
    const optionalBadge = queryByText('Optional');
    expect(optionalBadge).toBeNull();
  });

  test('displays secondary action correctly', () => {
    const actionText = 'Action';
    const actionMock = jest.fn();
    const { getByText } = render(
      <Input label="Input" secondaryAction={{ text: actionText, action: actionMock }} />,
    );
    const actionElement = getByText(actionText);
    fireEvent.click(actionElement);
    expect(actionElement).toBeInTheDocument();
    expect(actionMock).toHaveBeenCalledTimes(1);
  });

  test('renders description correctly', () => {
    const descriptionText = 'Some description';
    const { getByText } = render(<Input label="Input" description={descriptionText} />);
    const descriptionElement = getByText(descriptionText);
    expect(descriptionElement).toBeInTheDocument();
  });

  test('disables input when disabled prop is true', () => {
    const { getByTestId } = render(<Input label="Input" disabled />);
    const inputElement = getByTestId('input-element');
    expect(inputElement).toBeDisabled();
  });

  test('does not display error message when error prop is false', () => {
    const { queryByText } = render(<Input label="Input" error={false} />);
    const errorElement = queryByText('Error');
    expect(errorElement).toBeNull();
  });

  test('displays custom error message when error prop is a string', () => {
    const errorMessage = 'Invalid input';
    const { getByText } = render(<Input label="Input" error={errorMessage} />);
    const errorElement = getByText(errorMessage);
    expect(errorElement).toBeInTheDocument();
  });

  test('displays error message when error prop is true', () => {
    const { getByTestId } = render(<Input label="Input" error />);
    const errorElement = getByTestId('input-element-error-icon');
    expect(errorElement).toBeInTheDocument();
  });

  test('renders before and after icons correctly', () => {
    const { getByTestId } = render(
      <Input
        label="Input"
        BeforeElement={(props) => <span {...props} />}
        AfterElement={(props) => <span {...props} />}
        afterElementWithoutError
      />,
    );
    const beforeIcon = getByTestId('input-element-before-icon');
    const afterIcon = getByTestId('input-element-after-icon');
    expect(beforeIcon).toBeInTheDocument();
    expect(afterIcon).toBeInTheDocument();
  });
});

describe('TextInput', () => {
  test('renders without errors', () => {
    render(<TextInput />);
  });

  test('sets input type as text', () => {
    const { getByTestId } = render(<TextInput label="Text Input" />);
    const inputElement = getByTestId('input-element');
    expect(inputElement.type).toBe('text');
  });

  test('blurs input on wheel event', () => {
    const { getByTestId } = render(<TextInput label="Text Input" />);
    const inputElement = getByTestId('input-element');
    fireEvent.wheel(inputElement);
    expect(inputElement).not.toHaveFocus();
  });
});

describe('NumberInput', () => {
  test('renders without errors', () => {
    render(<NumberInput />);
  });

  test('sets input type as number', () => {
    const { getByTestId } = render(<NumberInput label="Number Input" />);
    const inputElement = getByTestId('input-element');
    expect(inputElement.type).toBe('number');
  });

  test('blurs input on wheel event', () => {
    const { getByTestId } = render(<NumberInput label="Number Input" />);
    const inputElement = getByTestId('input-element');
    fireEvent.wheel(inputElement);
    expect(inputElement).not.toHaveFocus();
  });
});
