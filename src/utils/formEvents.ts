import { debounce } from 'lodash';

export const customOnChange = debounce((event, functor) => functor(event), 500);
