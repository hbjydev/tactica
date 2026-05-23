import { defineConfig } from 'oxlint';

export default defineConfig({
    plugins: [
        'eslint',
        'import',
        'react',
        'typescript',
    ],

    rules: {
        'typescript/no-non-null-asserted-optional-chain': 'off',
    },

    ignorePatterns: [
        'public',
        'tailwind.config.js',
        'vite.config.ts',
        'resources/js/components/ui/*',
    ]
});
