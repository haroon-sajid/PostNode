'use client';

import { FC, ReactNode, useCallback, useMemo } from 'react';
import Link from 'next/link';
import clsx from 'clsx';
import { countBy, orderBy } from 'lodash';
import useCookie from 'react-use-cookie';
import ImageWithFallback from '@postnode/react/helpers/image.with.fallback';
import { useT } from '@postnode/react/translation/get.transation.service.client';
import { stripHtmlValidation } from '@postnode/helpers/utils/strip.html.validation';
import { useUser } from '@postnode/frontend/components/layout/user.context';
import { LoadingComponent } from '@postnode/frontend/components/layout/loading';
import {
  fromUtc,
  newDayjs,
} from '@postnode/frontend/components/layout/set.timezone';
import {
  isBrandMark,
  PlatformIcon,
} from '@postnode/frontend/components/ui/platform.icon.component';
import { isUSCitizen } from '@postnode/frontend/components/launches/helpers/isuscitizen.utils';
import { useIntegrationList } from '@postnode/frontend/components/launches/helpers/use.integration.list';
import { AddProviderButton } from '@postnode/frontend/components/launches/add.provider.component';
import { NewPostButton } from '@postnode/frontend/components/launches/new.post';
import { Integrations } from '@postnode/frontend/components/launches/calendar.context';
import { ChartSocial } from '@postnode/frontend/components/analytics/chart-social';
import { TrendIndicator } from '@postnode/frontend/components/platform-analytics/render.analytics';
import {
  useDashboardPosts,
  useDashboardPublished,
  useDashboardScheduled,
  useDashboardSets,
} from '@postnode/frontend/components/dashboard/use.dashboard';

type CardColor = 'purple' | 'green' | 'red' | 'blue';
type ChannelStatus = 'active' | 'disabled' | 'reconnect';

const dotColors: Record<CardColor, string> = {
  purple: 'bg-[#612bd3]',
  green: 'bg-[#32d583]',
  red: 'bg-[#f97066]',
  blue: 'bg-[#1d9bf0]',
};

const channelStatus = (channel: any): ChannelStatus => {
  if (channel.refreshNeeded || channel.inBetweenSteps) {
    return 'reconnect';
  }
  return channel.disabled ? 'disabled' : 'active';
};

const StatCard: FC<{
  label: string;
  value: number;
  color: CardColor;
  footer: ReactNode;
  trend?: ReactNode;
  highlight?: boolean;
}> = ({ label, value, color, footer, trend, highlight }) => {
  return (
    <div className="flex flex-col h-full gap-[8px] bg-newTableHeader border border-newTableBorder rounded-[12px] px-[16px] py-[14px] transition-all duration-200 hover:border-[#612bd3]/50">
      <div className="flex items-center justify-between gap-[8px]">
        <div className="flex items-center gap-[10px] min-w-0">
          <div
            className={clsx('w-[8px] h-[8px] rounded-full', dotColors[color])}
          />
          <span className="text-[15px] font-medium text-newTableText truncate">
            {label}
          </span>
        </div>
        {trend}
      </div>
      <div
        className={clsx(
          'text-[36px] leading-[42px] font-semibold tracking-tight',
          highlight && 'text-[#f97066]'
        )}
      >
        {new Intl.NumberFormat().format(value)}
      </div>
      <div className="text-[13px] text-newTableText truncate">{footer}</div>
    </div>
  );
};

const Panel: FC<{
  title: string;
  action?: ReactNode;
  children: ReactNode;
}> = ({ title, action, children }) => {
  return (
    <div className="flex flex-col bg-newTableHeader border border-newTableBorder rounded-[12px] overflow-hidden">
      <div className="flex items-center justify-between gap-[8px] px-[16px] pt-[14px] pb-[10px]">
        <span className="text-[16px] font-[600] truncate">{title}</span>
        {action}
      </div>
      <div className="flex-1 flex flex-col px-[8px] pb-[8px]">{children}</div>
    </div>
  );
};

const PanelLink: FC<{ href: string; children: ReactNode }> = ({
  href,
  children,
}) => {
  return (
    <Link
      href={href}
      className="text-[13px] text-newTableText hover:text-newTextColor whitespace-nowrap transition-colors"
    >
      {children}
    </Link>
  );
};

const EmptyText: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <div className="flex-1 flex items-center justify-center text-center text-[14px] text-newTableText py-[24px] px-[16px]">
      {children}
    </div>
  );
};

const ChannelAvatar: FC<{
  picture?: string;
  identifier: string;
  inactive?: boolean;
}> = ({ picture, identifier, inactive }) => {
  return (
    <div
      className={clsx(
        'relative shrink-0',
        isBrandMark(identifier) ? 'isolate' : inactive && 'opacity-50'
      )}
    >
      <ImageWithFallback
        fallbackSrc={`/icons/platforms/${identifier}.png`}
        src={picture || `/icons/platforms/${identifier}.png`}
        className="rounded-[8px]"
        alt={identifier}
        width={36}
        height={36}
      />
      <PlatformIcon
        identifier={identifier}
        size={16}
        inactive={inactive}
        className="absolute -bottom-[4px] -end-[4px]"
        iconClassName="z-10 rounded-[8px] border border-fifth"
        markClassName="z-[1] -mb-[5px] -me-[3px] bg-newTableHeader group-hover/row:bg-boxHover"
      />
    </div>
  );
};

const PostRow: FC<{
  post: any;
  meta: ReactNode;
  subtitle?: ReactNode;
}> = ({ post, meta, subtitle }) => {
  const t = useT();
  const className =
    'group/row flex items-center gap-[12px] p-[8px] rounded-[8px] hover:bg-boxHover transition-colors';
  const inner = (
    <>
      <ChannelAvatar
        picture={post.integration?.picture}
        identifier={post.integration?.providerIdentifier}
      />
      <div className="flex-1 min-w-0 flex flex-col gap-[2px]">
        <div className="text-[14px] line-clamp-1 break-words">
          {stripHtmlValidation('none', post.content, false, true, false) ||
            t('no_content', 'no content')}
        </div>
        <div className="text-[12px] text-newTableText truncate">
          {subtitle || post.integration?.name}
        </div>
      </div>
      <div className="text-[12px] text-newTableText whitespace-nowrap text-end">
        {meta}
      </div>
    </>
  );

  // A published post opens on the platform, the others in the calendar
  if (post.releaseURL) {
    return (
      <a
        href={post.releaseURL}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
      >
        {inner}
      </a>
    );
  }

  return (
    <Link href="/launches" className={className}>
      {inner}
    </Link>
  );
};

// A list panel's body: loading, the empty message, or the posts
const PostList: FC<{
  data?: { posts?: any[] };
  empty: string;
  renderPost: (post: any) => ReactNode;
}> = ({ data, empty, renderPost }) => {
  if (!data) {
    return <LoadingComponent />;
  }
  if (!data.posts?.length) {
    return <EmptyText>{empty}</EmptyText>;
  }
  return <>{data.posts.map(renderPost)}</>;
};

const ChannelRow: FC<{ channel: any }> = ({ channel }) => {
  const t = useT();
  const status = channelStatus(channel);
  const labels: Record<ChannelStatus, string> = {
    active: t('active', 'Active'),
    disabled: t('disabled', 'Disabled'),
    reconnect: t('reconnect_needed', 'Reconnect needed'),
  };

  return (
    <Link
      href="/launches"
      className="group/row flex items-center gap-[12px] p-[8px] rounded-[8px] hover:bg-boxHover transition-colors"
    >
      <ChannelAvatar
        picture={channel.picture}
        identifier={channel.identifier}
        inactive={status === 'disabled'}
      />
      <div className="flex-1 min-w-0 text-[14px] truncate">{channel.name}</div>
      <div className="flex items-center gap-[6px] text-[12px] text-newTableText whitespace-nowrap">
        <div
          className={clsx(
            'w-[6px] h-[6px] rounded-full',
            status === 'active' && 'bg-[#32d583]',
            status === 'disabled' && 'bg-newTableText',
            status === 'reconnect' && 'bg-[#f97066]'
          )}
        />
        {labels[status]}
      </div>
    </Link>
  );
};

const formatDateTime = (date: string) =>
  fromUtc(date).format(isUSCitizen() ? 'MMM D, hh:mm A' : 'D MMM, HH:mm');

// What the cards, the week and the chart show, from the posts of the last 60
// days and the week ahead (in the timezone of the user)
const getDashboardStats = (posts: any[]) => {
  const now = newDayjs();
  const start30 = now.subtract(29, 'day').startOf('day');
  const start60 = now.subtract(59, 'day').startOf('day');

  // A repeating post comes once per occurrence with the state of the post
  // itself, so only the single posts count (the rule of the list view too)
  const single = posts.filter((post) => !post.intervalInDays);
  const publishedNow = single.filter((post) => {
    const date = fromUtc(post.publishDate);
    return (
      post.state === 'PUBLISHED' && !date.isBefore(start30) && !date.isAfter(now)
    );
  });
  const publishedBefore = single.filter((post) => {
    const date = fromUtc(post.publishDate);
    return (
      post.state === 'PUBLISHED' &&
      !date.isBefore(start60) &&
      date.isBefore(start30)
    );
  });
  const failed = orderBy(
    single.filter(
      (post) =>
        post.state === 'ERROR' && !fromUtc(post.publishDate).isBefore(start30)
    ),
    ['publishDate'],
    ['desc']
  );

  const trend = publishedBefore.length
    ? ((publishedNow.length - publishedBefore.length) /
        publishedBefore.length) *
      100
    : 0;

  const publishedPerDay = countBy(publishedNow, (post) =>
    fromUtc(post.publishDate).format('YYYY-MM-DD')
  );
  const activity = Array.from({ length: 30 }, (_, index) => {
    const day = start30.add(index, 'day');
    return {
      date: day.format(isUSCitizen() ? 'MMM D' : 'D MMM'),
      total: publishedPerDay[day.format('YYYY-MM-DD')] || 0,
    };
  });

  const upcomingPerDay = countBy(
    single.filter(
      (post) => post.state === 'QUEUE' && fromUtc(post.publishDate).isAfter(now)
    ),
    (post) => fromUtc(post.publishDate).format('YYYY-MM-DD')
  );
  const week = Array.from({ length: 7 }, (_, index) => {
    const day = now.add(index, 'day');
    return {
      day,
      today: index === 0,
      total: upcomingPerDay[day.format('YYYY-MM-DD')] || 0,
    };
  });

  return {
    published: publishedNow.length,
    failed,
    trend,
    activity,
    week,
    weekMax: Math.max(1, ...week.map((day) => day.total)),
  };
};

export const DashboardComponent = () => {
  const t = useT();
  const user = useUser();
  const [mode] = useCookie('mode', 'dark');

  // Last 60 days (this period and the one before, for the trend) and the
  // week ahead, in the timezone of the user
  const range = useMemo(
    () => ({
      startDate: newDayjs().subtract(59, 'day').startOf('day').utc().format(),
      endDate: newDayjs().add(6, 'day').endOf('day').utc().format(),
    }),
    []
  );

  const {
    data: integrations,
    isLoading,
    mutate: mutateIntegrations,
  } = useIntegrationList();
  const { data: rangePosts, mutate: mutatePosts } = useDashboardPosts(
    range.startDate,
    range.endDate
  );
  const { data: scheduled, mutate: mutateScheduled } = useDashboardScheduled();
  const { data: published, mutate: mutatePublished } = useDashboardPublished();
  const { data: sets } = useDashboardSets();

  const reload = useCallback(() => {
    mutatePosts();
    mutateScheduled();
    mutatePublished();
  }, [mutatePosts, mutateScheduled, mutatePublished]);

  const sortedIntegrations = useMemo(() => {
    return orderBy(
      integrations,
      ['type', 'disabled', 'identifier'],
      ['desc', 'asc', 'asc']
    );
  }, [integrations]);

  const channels = useMemo(() => {
    const order: Record<ChannelStatus, number> = {
      reconnect: 0,
      active: 1,
      disabled: 2,
    };
    const list = orderBy(
      integrations,
      [(channel: any) => order[channelStatus(channel)], 'name'],
      ['asc', 'asc']
    );
    return {
      list,
      active: list.filter((channel: any) => !channel.disabled).length,
      reconnect: list.filter(
        (channel: any) => channelStatus(channel) === 'reconnect'
      ),
    };
  }, [integrations]);

  const stats = useMemo(
    () => getDashboardStats(rangePosts?.posts || []),
    [rangePosts]
  );

  const greeting = useMemo(() => {
    const hour = newDayjs().hour();
    if (hour < 12) {
      return t('good_morning', 'Good morning');
    }
    if (hour < 18) {
      return t('good_afternoon', 'Good afternoon');
    }
    return t('good_evening', 'Good evening');
  }, [t]);

  if (isLoading) {
    return (
      <div className="bg-newBgColorInner p-[20px] flex flex-1 flex-col items-center justify-center">
        <LoadingComponent />
      </div>
    );
  }

  if (!integrations.length) {
    return (
      <div className="bg-newBgColorInner p-[20px] mobile:p-[12px] flex flex-1 flex-col items-center justify-center gap-[16px] text-center">
        <img
          src={mode === 'dark' ? '/no-channels.svg' : '/no-channels-colors.svg'}
          alt={t('no_channels', 'No channels yet')}
          className="w-full max-w-[260px]"
        />
        <div className="text-[24px] font-[600]">
          {t('welcome_to_app', 'Welcome to {{appName}}')}
        </div>
        <div className="text-[14px] text-newTableText max-w-[440px]">
          {t(
            'dashboard_empty_description',
            'Connect your first channel to start scheduling posts. Your activity and results will show up here.'
          )}
        </div>
        <div className="w-full max-w-[300px]">
          <AddProviderButton update={() => mutateIntegrations()} />
        </div>
      </div>
    );
  }

  const nextPost = scheduled?.posts?.[0];
  const name = user?.name?.trim();

  return (
    <div className="bg-newBgColorInner flex-1 flex flex-col p-[20px] mobile:p-[12px] gap-[20px] min-w-0">
      <div className="flex items-center gap-[16px] mobile:flex-col mobile:items-stretch">
        <div className="flex-1 flex flex-col gap-[4px] min-w-0">
          <h2 className="text-[24px] mobile:text-[20px] font-[600] truncate">
            {greeting}
            {name ? `, ${name}` : ''}
          </h2>
          <div className="text-[14px] text-newTableText">
            {newDayjs().format(
              isUSCitizen() ? 'dddd, MMMM D, YYYY' : 'dddd, D MMMM YYYY'
            )}
            {' · '}
            {t(
              'dashboard_subtitle',
              'Here is what is happening with your social media'
            )}
          </div>
        </div>
        <div className="flex gap-[8px]">
          <Link
            href="/launches"
            className="h-[44px] px-[16px] rounded-[8px] bg-btnSimple text-btnText text-[14px] flex items-center justify-center whitespace-nowrap mobile:flex-1"
          >
            {t('view_calendar', 'View calendar')}
          </Link>
          <div className="flex w-[170px] mobile:w-auto mobile:flex-1">
            <NewPostButton
              integrations={sortedIntegrations as Integrations[]}
              sets={sets || []}
              mutate={reload}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-4 tablet:grid-cols-2 mobile:!grid-cols-1 gap-[16px]">
        <StatCard
          color="purple"
          label={t('scheduled', 'Scheduled')}
          value={scheduled?.total || 0}
          footer={
            nextPost
              ? t('next_post_in', 'Next post {{time}}', {
                  time: fromUtc(nextPost.publishDate).fromNow(),
                })
              : t('nothing_scheduled_yet', 'Nothing scheduled yet')
          }
        />
        <StatCard
          color="green"
          label={t('published', 'Published')}
          value={stats.published}
          trend={<TrendIndicator value={stats.trend} />}
          footer={t('in_the_last_30_days', 'In the last 30 days')}
        />
        <StatCard
          color="red"
          label={t('failed', 'Failed')}
          value={stats.failed.length}
          highlight={stats.failed.length > 0}
          footer={t('in_the_last_30_days', 'In the last 30 days')}
        />
        <StatCard
          color="blue"
          label={t('channels', 'Channels')}
          value={channels.active}
          footer={
            channels.reconnect.length
              ? t('channels_need_reconnect', '{{count}} need to be reconnected', {
                  count: channels.reconnect.length,
                })
              : t('all_channels_connected', 'All channels are connected')
          }
        />
      </div>

      <div className="grid grid-cols-3 tablet:grid-cols-1 gap-[16px]">
        <div className="col-span-2 tablet:col-span-1 flex flex-col gap-[16px] min-w-0">
          <Panel
            title={t('next_7_days', 'Next 7 days')}
            action={
              <PanelLink href="/launches">
                {t('view_calendar', 'View calendar')}
              </PanelLink>
            }
          >
            <div className="grid grid-cols-7 gap-[8px] mobile:gap-[4px]">
              {stats.week.map(({ day, today, total }) => (
                <Link
                  key={day.format('YYYY-MM-DD')}
                  href="/launches"
                  className={clsx(
                    'flex flex-col items-center gap-[6px] rounded-[8px] py-[10px] bg-newBgColorInner hover:bg-boxHover transition-colors border',
                    today ? 'border-newTableTextFocused' : 'border-transparent'
                  )}
                >
                  <span className="text-[12px] text-newTableText">
                    {day.format('ddd')}
                  </span>
                  <span
                    className={clsx(
                      'text-[16px] font-[600]',
                      today && 'text-newTableTextFocused'
                    )}
                  >
                    {day.format('D')}
                  </span>
                  <div className="h-[48px] w-[8px] rounded-full bg-newBgLineColor flex items-end overflow-hidden">
                    <div
                      className="w-full rounded-full bg-[#612bd3]"
                      style={{ height: `${(total / stats.weekMax) * 100}%` }}
                    />
                  </div>
                  <span className="text-[13px] font-[500]">{total}</span>
                </Link>
              ))}
            </div>
          </Panel>

          <Panel
            title={t('upcoming_posts', 'Upcoming posts')}
            action={
              <PanelLink href="/launches">
                {t('view_calendar', 'View calendar')}
              </PanelLink>
            }
          >
            <PostList
              data={scheduled}
              empty={t('no_upcoming_posts', 'No upcoming posts scheduled')}
              renderPost={(post) => (
                <PostRow
                  key={post.id}
                  post={post}
                  meta={
                    <div className="flex flex-col">
                      <span className="text-newTextColor font-[500]">
                        {fromUtc(post.publishDate).fromNow()}
                      </span>
                      <span>{formatDateTime(post.publishDate)}</span>
                    </div>
                  }
                />
              )}
            />
          </Panel>

          <Panel
            title={t('publishing_activity', 'Publishing activity')}
            action={
              <span className="text-[13px] text-newTableText whitespace-nowrap">
                {t('in_the_last_30_days', 'In the last 30 days')}
              </span>
            }
          >
            {stats.published ? (
              <div className="h-[180px] relative px-[8px]">
                <ChartSocial
                  key={stats.activity.map((day) => day.total).join('-')}
                  data={stats.activity}
                  color="purple"
                />
              </div>
            ) : (
              <EmptyText>
                {t('no_published_posts', 'No published posts')}
              </EmptyText>
            )}
          </Panel>
        </div>

        <div className="flex flex-col gap-[16px] min-w-0">
          <Panel title={t('needs_attention', 'Needs attention')}>
            {!stats.failed.length && !channels.reconnect.length ? (
              <div className="flex flex-col items-center text-center gap-[8px] py-[24px] px-[16px]">
                <div className="w-[40px] h-[40px] rounded-full bg-[#32d583]/10 text-[#32d583] flex items-center justify-center">
                  <svg
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M20 6L9 17L4 12" />
                  </svg>
                </div>
                <div className="text-[14px] font-[600]">
                  {t('everything_looks_good', 'Everything looks good')}
                </div>
                <div className="text-[13px] text-newTableText">
                  {t(
                    'no_failed_posts_or_channels',
                    'No failed posts, and all your channels are connected.'
                  )}
                </div>
              </div>
            ) : (
              <>
                {channels.reconnect.slice(0, 3).map((channel: any) => (
                  <ChannelRow key={channel.id} channel={channel} />
                ))}
                {stats.failed.slice(0, 3).map((post: any) => (
                  <PostRow
                    key={post.id}
                    post={post}
                    subtitle={
                      <span className="text-[#f97066]">
                        {post.error || post.integration?.name}
                      </span>
                    }
                    meta={formatDateTime(post.publishDate)}
                  />
                ))}
              </>
            )}
          </Panel>

          <Panel title={t('recently_published', 'Recently published')}>
            <PostList
              data={published}
              empty={t('no_published_posts', 'No published posts')}
              renderPost={(post) => (
                <PostRow
                  key={post.id}
                  post={post}
                  meta={fromUtc(post.publishDate).fromNow()}
                />
              )}
            />
          </Panel>

          <Panel
            title={t('channels', 'Channels')}
            action={
              <PanelLink href="/launches">
                {t('manage_channels', 'Manage channels')}
              </PanelLink>
            }
          >
            {channels.list.slice(0, 5).map((channel: any) => (
              <ChannelRow key={channel.id} channel={channel} />
            ))}
            {channels.list.length > 5 && (
              <Link
                href="/launches"
                className="text-[13px] text-newTableText hover:text-newTextColor px-[8px] py-[6px] transition-colors"
              >
                {t('more_channels', '+{{count}} more', {
                  count: channels.list.length - 5,
                })}
              </Link>
            )}
            <div className="px-[8px] pt-[8px]">
              <AddProviderButton update={() => mutateIntegrations()} />
            </div>
          </Panel>
        </div>
      </div>
    </div>
  );
};
