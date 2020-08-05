import { renderInputField } from '#components/FormComponents';
import { create, ReactTestRenderer } from 'react-test-renderer';

describe('<FormField />', () => {
  let snapshot: ReactTestRenderer;

  beforeAll(() => {
    const component = renderInputField({
      input: {},
      type: 'text',
      label: 'Form Field',
      placeholder: 'Form Field',
      meta: { touched: null, error: null },
    });
    snapshot = create(component);
  });

  it('should render and match the snapshot', () => {
    expect(snapshot.toJSON()).toMatchSnapshot();
  });
});
