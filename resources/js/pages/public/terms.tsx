import { Head } from '@inertiajs/react';
import type { ReactNode } from 'react';
import LegalProse from '@/components/legal-prose';
import LegalLayout from '@/layouts/legal-layout';
import termsRaw from '@legal/terms.md?raw';

export default function TermsPage() {
    return (
        <>
            <Head title="Terms of Service" />
            <LegalProse raw={termsRaw} />
        </>
    );
}

TermsPage.layout = (page: ReactNode) => (
    <LegalLayout title="Terms of Service" updatedAt="11 May 2026">
        {page}
    </LegalLayout>
);
