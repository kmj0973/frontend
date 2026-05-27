export const AnalysisHeroSvg = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="144"
      height="64"
      viewBox="0 0 144 64"
      fill="none"
    >
      <rect
        y="8"
        width="8"
        height="48"
        rx="4"
        fill="#FF822E"
        fillOpacity="0.1"
      />
      <rect
        x="14"
        width="8"
        height="64"
        rx="4"
        fill="#FF822E"
        fillOpacity="0.1"
      />
      <rect
        x="28"
        y="17.5"
        width="8"
        height="29"
        rx="4"
        fill="#FF822E"
        fillOpacity="0.1"
      />
      <rect
        width="8"
        height="48"
        rx="4"
        transform="matrix(-1 0 0 1 144 8)"
        fill="#FF822E"
        fillOpacity="0.1"
      />
      <rect
        width="8"
        height="64"
        rx="4"
        transform="matrix(-1 0 0 1 130 0)"
        fill="#FF822E"
        fillOpacity="0.1"
      />
      <rect
        width="8"
        height="29"
        rx="4"
        transform="matrix(-1 0 0 1 116 17.5)"
        fill="#FF822E"
        fillOpacity="0.1"
      />
      <g clipPath="url(#clip0_382_50)">
        <path
          d="M92 24.5V19.5C92 16.75 89.75 14.5 87 14.5H79.5C79.5 10.35 76.15 7 72 7C67.85 7 64.5 10.35 64.5 14.5H57C54.25 14.5 52 16.75 52 19.5V24.5C47.85 24.5 44.5 27.85 44.5 32C44.5 36.15 47.85 39.5 52 39.5V49.5C52 52.25 54.25 54.5 57 54.5H87C89.75 54.5 92 52.25 92 49.5V39.5C96.15 39.5 99.5 36.15 99.5 32C99.5 27.85 96.15 24.5 92 24.5ZM60.75 30.75C60.75 28.675 62.425 27 64.5 27C66.575 27 68.25 28.675 68.25 30.75C68.25 32.825 66.575 34.5 64.5 34.5C62.425 34.5 60.75 32.825 60.75 30.75ZM82 44.5H62V39.5H82V44.5ZM79.5 34.5C77.425 34.5 75.75 32.825 75.75 30.75C75.75 28.675 77.425 27 79.5 27C81.575 27 83.25 28.675 83.25 30.75C83.25 32.825 81.575 34.5 79.5 34.5Z"
          fill="#FF822E"
        />
      </g>
      <defs>
        <clipPath id="clip0_382_50">
          <rect
            width="60"
            height="60"
            fill="white"
            transform="translate(42 2)"
          />
        </clipPath>
      </defs>
    </svg>
  );
};

export const AnalysisProcessPendingSvg = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="4"
      height="50"
      viewBox="0 0 4 50"
      fill="none"
    >
      <line
        x1="2"
        y1="2"
        x2="2"
        y2="48"
        stroke="#F2F2F2"
        strokeWidth="4"
        strokeLinecap="round"
        strokeDasharray="8 8"
      />
    </svg>
  );
};

export const AnalysisProcessActiveSvg = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="4"
      height="50"
      viewBox="0 0 4 50"
      fill="none"
    >
      <line
        x1="2"
        y1="2"
        x2="2"
        y2="48"
        stroke="url(#paint0_linear_382_110)"
        strokeWidth="4"
        strokeLinecap="round"
        strokeDasharray="8 8"
      />
      <defs>
        <linearGradient
          id="paint0_linear_382_110"
          x1="-0.5"
          y1="-2.18557e-08"
          x2="-0.500002"
          y2="50"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#FFD9C0" />
          <stop offset="1" stopColor="#FF822E" />
        </linearGradient>
      </defs>
    </svg>
  );
};

export const AnalysisProcessDoneSvg = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="4"
      height="50"
      viewBox="0 0 4 50"
      fill="none"
    >
      <line
        x1="2"
        y1="2"
        x2="2"
        y2="48"
        stroke="#FFD9C0"
        strokeWidth="4"
        strokeLinecap="round"
        strokeDasharray="8 8"
      />
    </svg>
  );
};
