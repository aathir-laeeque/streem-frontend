import * as React from 'react';

function Delete(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" fill="none" viewBox="0 0 24 24" {...props}>
      <path
        fill="#fff"
        d="M0 4c0-2.21 1.79-4 4-4h16c2.21 0 4 1.79 4 4v16c0 2.21-1.79 4-4 4H4c-2.21 0-4-1.79-4-4V4z"
      />
      <path
        fill="#666"
        d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"
      />
    </svg>
  );
}

const MemoDelete = React.memo(Delete);
export default MemoDelete;
