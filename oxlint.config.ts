import { defineConfig } from 'oxlint';

export default defineConfig({
    plugins: [
        'eslint',
        'import',
        'react',
        'typescript',
    ],

    ignorePatterns: [
        'public',
        'tailwind.config.js',
        'vite.config.ts',
        'resources/js/components/ui/*',
    ]
});
