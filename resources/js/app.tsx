import { createInertiaApp, router, http } from '@inertiajs/react';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { initializeTheme } from '@/hooks/use-appearance';
import AppLayout from '@/layouts/app-layout';
import AuthLayout from '@/layouts/auth-layout';
import SsoSettingsLayout from '@/layouts/sso-settings/layout';
import AuthLayoutWide from './layouts/auth-layout-wide';
import { toast } from 'sonner';
import { CredentialedXhrClient } from './xhr-client';
import { FlashToast } from './types';

const appName = import.meta.env.VITE_APP_NAME || 'Tactica';

http.setClient(new CredentialedXhrClient());

createInertiaApp({
    title: (title) => (title ? `${title} - ${appName}` : appName),
    layout: (name) => {
        switch (true) {
            case name.startsWith('auth/'):
                return AuthLayout;
            case name.startsWith('public/'):
                return AuthLayout;
            case name.startsWith('settings/'):
                return [AuthLayoutWide, SsoSettingsLayout];
            default:
                return AppLayout;
        }
    },
    strictMode: true,
    withApp(app) {
        router.on('flash', (event) => {
            if (event.detail.flash.toast) {
                const toastData = event.detail.flash.toast as FlashToast;

                let toastFn;
                switch (toastData.type) {
                    case 'success':
                        toastFn = toast.success;
                        break;
                    case 'error':
                        toastFn = toast.error;
                        break;
                    case 'warning':
                        toastFn = toast.warning;
                        break;
                    case 'info':
                        toastFn = toast.info;
                        break;
                }

                toastFn(toastData.message);
            }
        });

        return (
            <TooltipProvider delayDuration={0}>
                {app}
                <Toaster />
            </TooltipProvider>
        );
    },
    progress: {
        color: '#4B5563',
    },
});

// This will set light / dark mode on load...
initializeTheme();
