import { User } from '#store/users/types';

export const getInitials = (name: string) => {
  let initials: RegExpMatchArray | string = name.match(/\b\w/g) || [];
  initials = ((initials.shift() || '') + (initials.pop() || '')).toUpperCase();
  return initials;
};

// TODO : remove this function from here and use the one defined in the helpers of users service
export const getFullName = ({ firstName, lastName }: Pick<User, 'firstName' | 'lastName'>) => {
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
      if (cNode.nodeName === 'BR') {
        arr.push({
          tag: 'P',
          text: '',
          childs: [],
        });
      } else if (
        (cNode.nodeType === 3 && nValue?.codePointAt(0)?.toString(16) !== 'a') ||
        cNode.hasChildNodes()
      ) {
        arr.push({
          tag: cNode.nodeName,
          text: cNode.nodeType === 3 ? nValue : '',
          childs: [],
        });
        parser(cNode, arr[arr.length - 1].childs);
      }
    });
  };

  parser(n, res);
  return res;
};

export const encrypt = (data: string) => btoa(data);

export const isMatchAny = (url: string, patterns: string[]) =>
  !patterns.every((pattern) => url.match(pattern) === null);

export const getFileExtension = (filename: string) => {
  return filename.split('.').pop();
};

export const generateShouldBeText = (label: string | undefined, data: any) => {
  const uom = data.uom || '';
  if (data.operator === 'BETWEEN') {
    return `${label} should be between ${data.lowerValue} ${uom} and ${data.upperValue} ${uom}`;
  } else {
    let operatorString: string;

    switch (data.operator) {
      case 'EQUAL_TO':
        operatorString = '(=) equal to';
        break;
      case 'LESS_THAN':
        operatorString = '(<) less than';
        break;
      case 'LESS_THAN_EQUAL_TO':
        operatorString = '(≤) less than equal to';
        break;
      case 'MORE_THAN':
        operatorString = '(>) more than';
        break;
      case 'MORE_THAN_EQUAL_TO':
        operatorString = '(≥) more than equal to';
        break;
      default:
        return;
    }

    return `${label} should be ${operatorString} ${data?.value ?? 50} ${uom}`;
  }
};
