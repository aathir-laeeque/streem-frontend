import { debounce } from 'lodash';

// this function takes form events and deplay the function passed to it with the latest event by 500ms
export const customOnChange = debounce((event, functor) => functor(event), 500);
