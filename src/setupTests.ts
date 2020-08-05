import 'whatwg-fetch';
import '@testing-library/jest-dom';

import * as Enzyme from 'enzyme';
import ReactSixteenAdapter from 'enzyme-adapter-react-16';

jest.mock('./utils/request');
Enzyme.configure({ adapter: new ReactSixteenAdapter() });
