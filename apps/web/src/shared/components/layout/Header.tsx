'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useAuthStore } from '@/features/auth';
import { Button } from '@/shared/components/ui';
import { LogOut, User, Bell, Globe } from 'lucide-react';

interface HeaderProps {
  locale: string;
}

export function Header({ locale }: HeaderProps) {
  const t = useTranslations('nav');
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    window.location.href = `/${locale}/login`;
  };

  const otherLocale = locale === 'en' ? 'hy' : 'en';

  return (
    <header className="fixed left-64 right-0 top-0 z-30 flex h-16 items-center justify-between border-b bg-card px-6">
      {/* Search or Title */}
      <div className="flex items-center gap-4">
        <h1 className="text-lg font-semibold">{t('dashboard')}</h1>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-4">
        {/* Language switcher */}
        <Link
          href={`/${otherLocale}`}
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <Globe className="h-4 w-4" />
          {otherLocale.toUpperCase()}
        </Link>

        {/* Notifications */}
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] text-destructive-foreground">
            3
          </span>
        </Button>

        {/* User menu */}
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
            <User className="h-5 w-5 text-primary" />
          </div>
          <div className="hidden md:block">
            <p className="text-sm font-medium">
              {user?.firstName} {user?.lastName}
            </p>
            <p className="text-xs text-muted-foreground">{user?.role}</p>
          </div>
        </div>

        {/* Logout */}
        <Button variant="ghost" size="icon" onClick={handleLogout}>
          <LogOut className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
}

