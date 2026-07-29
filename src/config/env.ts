const withoutTrailingSlash = (value: string | undefined) =>
  value?.replace(/\/+$/, "") ?? "";

export const API_BASE_URL = withoutTrailingSlash(
  import.meta.env.VITE_API_BASE_URL,
);

export const IMAGE_BASE_URL = withoutTrailingSlash(
  import.meta.env.VITE_IMAGE_BASE_URL,
);
