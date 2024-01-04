import React from 'react';

function TaskRecurrence(props: React.SVGProps<SVGSVGElement>) {
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
        d="M17.5 3.75c0-.69-.56-1.25-1.25-1.25h-2.5V1.25H12.5V2.5h-5V1.25H6.25V2.5h-2.5c-.69 0-1.25.56-1.25 1.25v12.5c0 .69.56 1.25 1.25 1.25h2.5v-1.25h-2.5V3.75h2.5V5H7.5V3.75h5V5h1.25V3.75h2.5V7.5h1.25V3.75z"
        clipRule="evenodd"
      ></path>
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M11.831 11.557h-1.318c.938-1.415 2.42-1.513 3.955-1.112 1.397.552 2.407 1.503 2.407 3.191h1.259c.002-1.899-1.407-3.791-3.226-4.437-1.819-.646-3.959-.215-5.195 1.246V9.2H8.53v3.372h3.302v-1.014zM14.69 15.79h1.318c-.938 1.414-2.42 1.512-3.955 1.11-1.397-.551-2.408-1.502-2.408-3.19H8.387c-.002 1.899 1.407 3.791 3.226 4.437 1.819.646 3.959.215 5.194-1.246v1.246h1.184v-3.373H14.69v1.015z"
        clipRule="evenodd"
      ></path>
    </svg>
  );
}

export default TaskRecurrence;
