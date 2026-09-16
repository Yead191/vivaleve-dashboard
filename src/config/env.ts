const withoutTrailingSlash = (value: string | undefined) =>
  value?.replace(/\/+$/, "") ?? "";

export const API_BASE_URL = withoutTrailingSlash(
  import.meta.env.VITE_API_BASE_URL,
);

export const IMAGE_BASE_URL = withoutTrailingSlash(
  import.meta.env.VITE_IMAGE_BASE_URL,
);

export const BRAND_NAME = "Sigaleve";

export const BRAND_LOGO_URL =
  "https://res.cloudinary.com/dnsktebcu/image/upload/v1789462289/image_uiidjd.png";
