// The product name lives here and nowhere else.
// To rename the product, change DEFAULT_APP_NAME, or set APP_NAME (backend,
// orchestrator, server side of the frontend) and NEXT_PUBLIC_APP_NAME (browser,
// read when the frontend is built) to the same value.
const DEFAULT_APP_NAME = 'PostNode';

export const getAppName = () => {
  return (
    process.env.NEXT_PUBLIC_APP_NAME || process.env.APP_NAME || DEFAULT_APP_NAME
  );
};

// URL scheme of the mobile app deep links (postnode://...). A fixed id, not
// the display name: the mobile app registers it, so renaming the product must
// not change it
const APP_SCHEME = 'postnode';

export const getAppScheme = () => {
  return APP_SCHEME;
};
