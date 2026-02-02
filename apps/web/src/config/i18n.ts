import { getRequestConfig } from 'next-intl/server';

export const locales = ['en', 'hy'] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'en';

export default getRequestConfig(async ({ locale }) => ({
  messages: (await import(`../../languages/${locale}.json`)).default,
}));

