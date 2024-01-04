import React from 'react';

function TaskInterlocks(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      fill="none"
      viewBox="0 0 20 20"
      {...props}
    >
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M16.875 13.838v-3.213c0-.69-.56-1.25-1.25-1.25h-5V6.162a2.5 2.5 0 10-1.25 0v3.213h-5c-.69 0-1.25.56-1.25 1.25v3.213a2.5 2.5 0 101.25 0v-3.213h11.25v3.213a2.5 2.5 0 101.25 0zM5 16.25a1.25 1.25 0 11-2.5 0 1.25 1.25 0 012.5 0zm3.75-12.5a1.25 1.25 0 112.5 0 1.25 1.25 0 01-2.5 0zm7.5 13.75a1.25 1.25 0 110-2.5 1.25 1.25 0 010 2.5z"
        clipRule="evenodd"
      ></path>
    </svg>
  );
}

export default TaskInterlocks;
