import * as React from 'react';

function SentForReview(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 250 159" fill="none" {...props}>
      <g clipPath="url(#prefix__clip0)" filter="url(#prefix__filter0_d)">
        <path
          d="M58.9 80.7l8.9 45.3L246 3 58.9 80.7z"
          fill="url(#prefix__paint0_linear)"
        />
        <path
          d="M246 3L58.9 80.7 4 36.5 246 3z"
          fill="url(#prefix__paint1_linear)"
        />
        <path
          d="M80.7 98.3L67.8 126 246 3 80.7 98.3z"
          fill="url(#prefix__paint2_linear)"
        />
        <path
          d="M246 3L80.7 98.3l68.7 55.2L246 3z"
          fill="url(#prefix__paint3_linear)"
        />
      </g>
      <defs>
        <linearGradient
          id="prefix__paint0_linear"
          x1={58.381}
          y1={68.231}
          x2={248.201}
          y2={61.032}
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#7EB9FF" />
          <stop offset={1} stopColor="#ADD3FF" />
        </linearGradient>
        <linearGradient
          id="prefix__paint1_linear"
          x1={4.416}
          y1={47.488}
          x2={247.338}
          y2={38.275}
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#BBDAFF" />
          <stop offset={1} stopColor="#E8F3FF" />
        </linearGradient>
        <linearGradient
          id="prefix__paint2_linear"
          x1={65.603}
          y1={67.957}
          x2={248.201}
          y2={61.032}
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#5CA6FF" />
          <stop offset={1} stopColor="#79B6FF" />
        </linearGradient>
        <linearGradient
          id="prefix__paint3_linear"
          x1={80.079}
          y1={82.717}
          x2={248.781}
          y2={76.319}
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#BBDAFF" />
          <stop offset={1} stopColor="#E8F3FF" />
        </linearGradient>
        <clipPath id="prefix__clip0">
          <path fill="#fff" transform="translate(4 3)" d="M0 0h242v150.5H0z" />
        </clipPath>
        <filter
          id="prefix__filter0_d"
          x={0}
          y={0}
          width={250}
          height={158.5}
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity={0} result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          />
          <feOffset dy={1} />
          <feGaussianBlur stdDeviation={2} />
          <feColorMatrix values="0 0 0 0 0.4 0 0 0 0 0.4 0 0 0 0 0.4 0 0 0 0.08 0" />
          <feBlend in2="BackgroundImageFix" result="effect1_dropShadow" />
          <feBlend in="SourceGraphic" in2="effect1_dropShadow" result="shape" />
        </filter>
      </defs>
    </svg>
  );
}

const MemoSentForReview = React.memo(SentForReview);
export default MemoSentForReview;
