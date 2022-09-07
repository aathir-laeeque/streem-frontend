import React from 'react';

function SentForReview() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="250"
      height="159"
      fill="none"
      viewBox="0 0 250 159"
    >
      <g clipPath="url(#clip0)" filter="url(#filter0_d)">
        <path fill="url(#paint0_linear)" d="M58.9 80.7l8.9 45.3L246 3 58.9 80.7z"></path>
        <path fill="url(#paint1_linear)" d="M246 3L58.9 80.7 4 36.5 246 3z"></path>
        <path fill="url(#paint2_linear)" d="M80.7 98.3L67.8 126 246 3 80.7 98.3z"></path>
        <path fill="url(#paint3_linear)" d="M246 3L80.7 98.3l68.7 55.2L246 3z"></path>
      </g>
      <defs>
        <filter
          id="filter0_d"
          width="250"
          height="158.5"
          x="0"
          y="0"
          colorInterpolationFilters="sRGB"
          filterUnits="userSpaceOnUse"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix"></feFlood>
          <feColorMatrix
            in="SourceAlpha"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          ></feColorMatrix>
          <feOffset dy="1"></feOffset>
          <feGaussianBlur stdDeviation="2"></feGaussianBlur>
          <feColorMatrix values="0 0 0 0 0.4 0 0 0 0 0.4 0 0 0 0 0.4 0 0 0 0.08 0"></feColorMatrix>
          <feBlend in2="BackgroundImageFix" result="effect1_dropShadow"></feBlend>
          <feBlend in="SourceGraphic" in2="effect1_dropShadow" result="shape"></feBlend>
        </filter>
        <linearGradient
          id="paint0_linear"
          x1="58.381"
          x2="248.201"
          y1="68.231"
          y2="61.032"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#7EB9FF"></stop>
          <stop offset="1" stopColor="#ADD3FF"></stop>
        </linearGradient>
        <linearGradient
          id="paint1_linear"
          x1="4.416"
          x2="247.338"
          y1="47.488"
          y2="38.275"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#BBDAFF"></stop>
          <stop offset="1" stopColor="#E8F3FF"></stop>
        </linearGradient>
        <linearGradient
          id="paint2_linear"
          x1="65.603"
          x2="248.201"
          y1="67.957"
          y2="61.032"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#5CA6FF"></stop>
          <stop offset="1" stopColor="#79B6FF"></stop>
        </linearGradient>
        <linearGradient
          id="paint3_linear"
          x1="80.079"
          x2="248.781"
          y1="82.717"
          y2="76.319"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#BBDAFF"></stop>
          <stop offset="1" stopColor="#E8F3FF"></stop>
        </linearGradient>
        <clipPath id="clip0">
          <path fill="#fff" d="M0 0H242V150.5H0z" transform="translate(4 3)"></path>
        </clipPath>
      </defs>
    </svg>
  );
}

export default SentForReview;
