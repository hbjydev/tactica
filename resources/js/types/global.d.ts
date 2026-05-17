import type { Auth } from '@/types/auth';
import { Unit } from './units';

declare module 'react' {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    interface InputHTMLAttributes<T> {
        passwordrules?: string;
    }
}

declare module '@inertiajs/core' {
    export interface InertiaConfig {
        flashDataType: {
            toast?: {
                type: 'success' | 'error' | 'info';
                message: string;
            }
        }

        sharedPageProps: {
            name: string;
            appUrl: string;
            unit?: Unit;
            auth: Auth;
            sidebarOpen: boolean;
            [key: string]: unknown;
        };
    }
}
