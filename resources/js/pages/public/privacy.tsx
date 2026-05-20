import { Head } from '@inertiajs/react';
import LegalLayout from '@/layouts/legal-layout';
import LegalProse from '@/components/legal-prose';
import type { ReactNode } from 'react';
import privacyRaw from '@legal/privacy.md?raw';

export default function PrivacyPage() {
    return (
        <>
            <Head title="Privacy Policy" />
            <LegalProse raw={privacyRaw} />
        </>
    );
}

PrivacyPage.layout = (page: ReactNode) => (
    <LegalLayout title="Privacy Policy" updatedAt="11 May 2026">{page}</LegalLayout>
);
