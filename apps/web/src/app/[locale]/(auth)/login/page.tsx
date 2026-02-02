import { useTranslations } from 'next-intl';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/shared/components/ui';
import { LoginForm } from '@/features/auth';

interface LoginPageProps {
  params: { locale: string };
}

export default function LoginPage({ params: { locale } }: LoginPageProps) {
  const t = useTranslations('auth');

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-primary"
            >
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
            </svg>
          </div>
          <CardTitle className="text-2xl">Ilona English Center</CardTitle>
          <CardDescription>{t('enterCredentials')}</CardDescription>
        </CardHeader>
        <CardContent>
          <LoginForm locale={locale} />
        </CardContent>
      </Card>
    </div>
  );
}

