'use client';

import React, { FC, useCallback, useState } from 'react';
import Link from 'next/link';
import useSWR from 'swr';
import clsx from 'clsx';
import { useClickAway } from '@uidotdev/usehooks';
import { useFetch } from '@postnode/helpers/utils/custom.fetch';
import { useUser } from '@postnode/frontend/components/layout/user.context';
import { useLogout } from '@postnode/frontend/components/layout/logout.component';
import { useMediaDirectory } from '@postnode/react/helpers/use.media.directory';
import { useT } from '@postnode/react/translation/get.transation.service.client';

// name, bio and picture of the signed-in user, edited in Settings > Profile
export const useUserPersonal = () => {
  const fetch = useFetch();
  return useSWR<{
    name?: string;
    bio?: string;
    picture?: { id: string; path: string } | null;
  }>(
    'user-personal',
    async () => {
      return await (await fetch('/user/personal')).json();
    },
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );
};

// the user's picture, or the first letter of their name when there is none
export const ProfileAvatar: FC<{
  name?: string;
  picture?: string | null;
  size?: number;
}> = ({ name, picture, size = 32 }) => {
  const mediaDirectory = useMediaDirectory();
  const initial = (name || '').trim().charAt(0).toUpperCase() || '?';
  if (picture) {
    return (
      <img
        src={mediaDirectory.set(picture)}
        alt={name || ''}
        className="rounded-full object-cover shrink-0"
        style={{ width: size, height: size }}
      />
    );
  }
  return (
    <div
      className="rounded-full bg-btnPrimary text-white font-[600] flex items-center justify-center shrink-0 select-none"
      style={{ width: size, height: size, fontSize: Math.round(size * 0.42) }}
    >
      {initial}
    </div>
  );
};

const menuItemClassName =
  'flex items-center gap-[10px] px-[16px] h-[44px] text-[14px] text-start hover:bg-boxHover';

export const ProfileMenuComponent = () => {
  const t = useT();
  const user = useUser();
  const logout = useLogout();
  const { data: personal } = useUserPersonal();
  const [show, setShow] = useState(false);
  const close = useCallback(() => setShow(false), []);
  const ref = useClickAway<HTMLDivElement>(close);

  const name = personal?.name || user?.name || '';
  const picture = personal?.picture?.path;

  return (
    // sits at the bottom of the left menu, the popup opens next to it
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={(e) => {
          // on phones the menu drawer closes on any click inside it
          e.stopPropagation();
          setShow(!show);
        }}
        title={name || user?.email || ''}
        aria-label={t('profile', 'Profile')}
        className={clsx(
          'w-full minCustom:h-[54px] custom:h-[44px] flex items-center justify-center rounded-[12px] hover:bg-boxFocused transition-colors',
          show && 'bg-boxFocused'
        )}
      >
        <ProfileAvatar name={name || user?.email} picture={picture} />
      </button>
      {show && (
        <div
          className={clsx(
            'opacity-0 animate-normalFadeDown absolute bottom-0 start-[calc(100%+16px)] w-[260px] bg-newBgColorInner text-newTextColor rounded-[12px] flex flex-col border border-newTableBorder shadow-menu overflow-hidden z-[600]',
            // on phones the drawer clips its content, so the popup is placed on the screen instead
            'mobile:fixed mobile:bottom-[16px] mobile:start-[88px] mobile:end-[8px] mobile:w-auto'
          )}
        >
          <div
            className="flex items-center gap-[12px] px-[16px] py-[14px] border-b border-newTableBorder"
            // keeps the phone menu drawer open when the header is clicked
            onClick={(e) => e.stopPropagation()}
          >
            <ProfileAvatar
              name={name || user?.email}
              picture={picture}
              size={40}
            />
            <div className="flex flex-col min-w-0">
              {!!name && (
                <div className="text-[14px] font-[600] truncate">{name}</div>
              )}
              <div className="text-[12px] text-textItemBlur truncate">
                {user?.email}
              </div>
            </div>
          </div>
          <Link
            href="/settings?tab=profile"
            onClick={close}
            className={menuItemClassName}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            {t('profile', 'Profile')}
          </Link>
          <button
            type="button"
            onClick={() => {
              close();
              logout();
            }}
            className={clsx(
              menuItemClassName,
              'text-red-400 border-t border-newTableBorder'
            )}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="rtl:rotate-180"
            >
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            {t('logout', 'Logout')}
          </button>
        </div>
      )}
    </div>
  );
};
