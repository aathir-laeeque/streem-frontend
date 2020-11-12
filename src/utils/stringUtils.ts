import { User } from '#store/users/types';

export const getInitials = (name: string) => {
  let initials: RegExpMatchArray | string = name.match(/\b\w/g) || [];
  initials = ((initials.shift() || '') + (initials.pop() || '')).toUpperCase();
  return initials;
};

export const capitalizeFirstLetter = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const getFullName = ({
  firstName,
  lastName,
}: Pick<User, 'firstName' | 'lastName'>) => {
  return `${firstName} ${lastName}`;
};

export const getOrdinal = (n: number) => {
  const s = ['th', 'st', 'nd', 'rd'],
    v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
};

export const removeUnderscore = (str: string) => {
  return str.replace(/_/g, ' ');
};

type Response = { tag: string; text: string; childs: Response[] };

export const parseMarkUp = (n: HTMLElement) => {
  const res: Response[] = [];
  const parser = (node: HTMLElement, arr: Response[]) => {
    node.childNodes.forEach((cNode) => {
      const nValue = cNode.textContent as string;
      if (
        !(nValue.length === 3 && nValue?.substring(nValue.length - 2) === '  ')
      ) {
        if (cNode.nodeType === 3 || cNode.hasChildNodes()) {
          arr.push({
            tag: cNode.nodeName,
            text: cNode.nodeType === 3 ? nValue : '',
            childs: [],
          });
          parser(cNode, arr[arr.length - 1].childs);
        }
      }
    });
  };

  parser(n, res);
  return res;
};
