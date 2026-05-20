import type { Auth } from '@/types/auth';
import { Unit } from './units';

declare module 'react' {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    interface InputHTMLAttributes<T> {
        passwordrules?: string;
    }
}

/// <reference types="@/wayfinder/types" />
