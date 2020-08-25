import * as React from 'react';

function Danger(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" fill="none" viewBox="0 0 24 24" {...props}>
      <path
        fill="#fff"
        d="M0 4c0-2.21 1.79-4 4-4h16c2.21 0 4 1.79 4 4v16c0 2.21-1.79 4-4 4H4c-2.21 0-4-1.79-4-4V4z"
      />
      <path
        fill="#FF6B6B"
        d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"
      />
    </svg>
  );
}

const MemoDanger = React.memo(Danger);
export default MemoDanger;
