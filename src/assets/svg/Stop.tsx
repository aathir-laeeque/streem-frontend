import * as React from 'react';

function Stop(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" fill="none" viewBox="0 0 24 24" {...props}>
      <path
        fill="#fff"
        d="M0 4c0-2.21 1.79-4 4-4h16c2.21 0 4 1.79 4 4v16c0 2.21-1.79 4-4 4H4c-2.21 0-4-1.79-4-4V4z"
      />
      <path
        fill="#F7B500"
        d="M21.333 6.583v12.084C21.333 20.5 19.833 22 18 22h-6.083c-.9 0-1.75-.358-2.375-.992L3 14.358s1.05-1.025 1.083-1.041a.987.987 0 01.659-.242c.183 0 .35.05.5.133.033.009 3.591 2.05 3.591 2.05V5.333a1.25 1.25 0 112.5 0v5.834h.834V3.25c0-.692.558-1.25 1.25-1.25.691 0 1.25.558 1.25 1.25v7.917h.833V4.083c0-.691.558-1.25 1.25-1.25S18 3.392 18 4.083v7.084h.833V6.583a1.25 1.25 0 112.5 0z"
      />
    </svg>
  );
}

const MemoStop = React.memo(Stop);
export default MemoStop;
