'use client';

import {
  PostComment,
  withProvider,
} from '@postnode/frontend/components/new-launch/providers/high.order.provider';
import { ThreadFinisher } from '@postnode/frontend/components/new-launch/finisher/thread.finisher';
import { useT } from '@postnode/react/translation/get.transation.service.client';
import { useSettings } from '@postnode/frontend/components/launches/helpers/use.values';
import { ThreadsDto } from '@postnode/nestjs-libraries/dtos/posts/providers-settings/threads.dto';
import { Checkbox } from '@postnode/react/form/checkbox';
const SettingsComponent = () => {
  const t = useT();
  const { register } = useSettings();

  return (
    <>
      <div className="mb-5">
        <Checkbox
          label={t('label_made_with_ai', 'Made with AI')}
          {...register('made_with_ai')}
        />
      </div>

      <ThreadFinisher />
    </>
  );
};

export default withProvider({
  postComment: PostComment.POST,
  minimumCharacters: [],
  SettingsComponent: SettingsComponent,
  CustomPreviewComponent: undefined,
  dto: ThreadsDto,
  maximumCharacters: 500,
});
