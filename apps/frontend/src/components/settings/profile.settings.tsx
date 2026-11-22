'use client';

import React, { FC } from 'react';
import { useFormContext } from 'react-hook-form';
import { Input } from '@gitroom/react/form/input';
import { Textarea } from '@gitroom/react/form/textarea';
import { Button } from '@gitroom/react/form/button';
import { useT } from '@gitroom/react/translation/get.transation.service.client';
import { useUser } from '@gitroom/frontend/components/layout/user.context';
import { ProfileAvatar } from '@gitroom/frontend/components/layout/profile.menu.component';

// The form (fullname, bio, picture) and its submit live in SettingsPopup
export const ProfileSettings: FC<{
  picture?: { id: string; path: string } | null;
  onChangePicture: () => void;
  onRemovePicture: () => void;
}> = ({ picture, onChangePicture, onRemovePicture }) => {
  const t = useT();
  const user = useUser();
  const form = useFormContext();
  const fullname = form.watch('fullname');

  return (
    <div className="flex flex-col">
      <h3 className="text-[20px]">{t('profile', 'Profile')}</h3>
      <div className="my-[16px] mt-[16px] bg-sixth border-fifth border rounded-[4px] p-[24px] flex flex-col gap-[24px]">
        <div className="flex items-center gap-[16px]">
          <ProfileAvatar
            name={fullname || user?.email}
            picture={picture?.path}
            size={64}
          />
          <div className="flex flex-col gap-[8px]">
            <div className="text-[14px]">
              {t('profile_picture', 'Profile picture')}
            </div>
            <div className="flex flex-wrap gap-[8px]">
              <Button
                secondary
                className="mobile:px-[12px]"
                onClick={onChangePicture}
              >
                {t('upload', 'Upload')}
              </Button>
              {!!picture?.path && (
                <Button
                  secondary
                  className="mobile:px-[12px]"
                  onClick={onRemovePicture}
                >
                  {t('remove', 'Remove')}
                </Button>
              )}
            </div>
            {!!form.formState.errors.picture && (
              <div className="text-red-400 text-[12px]">
                {t(
                  'picture_not_supported',
                  'Please choose a PNG, JPG, GIF or WEBP image'
                )}
              </div>
            )}
          </div>
        </div>
        <Input name="fullname" label={t('name', 'Name')} />
        <Input
          name="email"
          label={t('email_address', 'Email Address')}
          disableForm={true}
          readOnly={true}
          value={user?.email || ''}
          className="opacity-70"
        />
        <Textarea name="bio" label={t('bio', 'Bio')} />
        <div>
          <Button type="submit" loading={form.formState.isSubmitting}>
            {t('save', 'Save')}
          </Button>
        </div>
      </div>
    </div>
  );
};
