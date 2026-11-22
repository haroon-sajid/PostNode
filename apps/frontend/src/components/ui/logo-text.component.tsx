import React from 'react';
import { getAppName } from '@gitroom/helpers/utils/app.name';

// Neutral placeholder logo followed by the product name
export const LogoTextComponent = () => {
  return (
    <div className="flex items-center gap-[8px] h-[33px]">
      <svg
        width="26"
        height="26"
        viewBox="0 0 60 60"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect x="4" y="4" width="52" height="52" rx="14" fill="#612BD3" />
        <rect x="16" y="18" width="28" height="5" rx="2.5" fill="white" />
        <rect x="16" y="28" width="28" height="5" rx="2.5" fill="white" />
        <rect x="16" y="38" width="18" height="5" rx="2.5" fill="white" />
      </svg>
      <span className="text-[20px] font-[600] leading-none">
        {getAppName()}
      </span>
    </div>
  );
};
