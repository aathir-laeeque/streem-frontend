import React from 'react';

function ScheduleTask(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="17"
      height="18"
      fill="none"
      viewBox="0 0 17 18"
      {...props}
    >
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M15.5 2.75c0-.69-.56-1.25-1.25-1.25h-2.5V.25H10.5V1.5h-5V.25H4.25V1.5h-2.5C1.06 1.5.5 2.06.5 2.75v12.5c0 .69.56 1.25 1.25 1.25h2.5v-1.25h-2.5V2.75h2.5V4H5.5V2.75h5V4h1.25V2.75h2.5V6.5h1.25V2.75zm-9.375 10a5 5 0 1010 0 5 5 0 00-10 0zm4.375.256l1.619 1.619.881-.881-1.25-1.25V10.25H10.5v2.756zm-3.125-.256a3.75 3.75 0 117.5 0 3.75 3.75 0 01-7.5 0z"
        clipRule="evenodd"
      ></path>
    </svg>
  );
}

export default ScheduleTask;
