'use client';

import { useCallback } from 'react';
import useSWR from 'swr';
import { useFetch } from '@postnode/helpers/utils/custom.fetch';
import {
  expandPosts,
  expandPostsList,
} from '@postnode/helpers/utils/posts.list.minify';

const dashboardSWROptions = {
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
  refreshWhenHidden: false,
  refreshWhenOffline: false,
};

// The posts between two dates, the same data the calendar shows (repeating
// posts come once per occurrence)
export const useDashboardPosts = (startDate: string, endDate: string) => {
  const fetch = useFetch();

  const load = useCallback(async () => {
    const params = new URLSearchParams({ startDate, endDate }).toString();
    return expandPosts(await (await fetch(`/posts?${params}`)).json());
  }, [startDate, endDate]);

  return useSWR(`dashboard-posts-${startDate}-${endDate}`, load, {
    ...dashboardSWROptions,
    fallbackData: { posts: [] },
  });
};

// The next scheduled posts, and how many are scheduled in total
export const useDashboardScheduled = () => {
  const fetch = useFetch();

  const load = useCallback(async () => {
    return expandPostsList(
      await (await fetch('/posts/list?state=scheduled&limit=5')).json()
    );
  }, []);

  return useSWR('dashboard-scheduled', load, dashboardSWROptions);
};

// The last published posts, and how many were published in total
export const useDashboardPublished = () => {
  const fetch = useFetch();

  const load = useCallback(async () => {
    return expandPostsList(
      await (await fetch('/posts/list?state=published&limit=5')).json()
    );
  }, []);

  return useSWR('dashboard-published', load, dashboardSWROptions);
};

// The saved sets offered when creating a post (same cache as the calendar)
export const useDashboardSets = () => {
  const fetch = useFetch();

  const load = useCallback(async () => {
    return (await fetch('/sets')).json();
  }, []);

  return useSWR('sets', load, {
    ...dashboardSWROptions,
    revalidateIfStale: false,
    revalidateOnMount: true,
  });
};
