import * as React from 'react';

function Electricity(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" fill="none" viewBox="0 0 24 24" {...props}>
      <path
        fill="#fff"
        d="M0 4c0-2.21 1.79-4 4-4h16c2.21 0 4 1.79 4 4v16c0 2.21-1.79 4-4 4H4c-2.21 0-4-1.79-4-4V4z"
      />
      <path
        fill="#1D84FF"
        d="M12 2.02c-5.51 0-9.98 4.47-9.98 9.98 0 5.51 4.47 9.98 9.98 9.98 5.51 0 9.98-4.47 9.98-9.98 0-5.51-4.47-9.98-9.98-9.98zM11.48 20v-6.26H8L13 4v6.26h3.35L11.48 20z"
      />
    </svg>
  );
}

const MemoElectricity = React.memo(Electricity);
export default MemoElectricity;
