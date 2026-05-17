import '@inertiajs/core'

declare module "@inertiajs/core" {
    export interface InertiaConfig {
        flashDataType: {
            toast?: {
                type: 'success' | 'error' | 'info';
                message: string;
            }
        }
    }
}
