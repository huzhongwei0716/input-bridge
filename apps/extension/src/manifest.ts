import { defineManifest } from '@crxjs/vite-plugin';

export default defineManifest({
    name: 'InputBridge',
    description: 'Map JSON data to HTML forms',
    version: '1.0.0',
    manifest_version: 3,
    permissions: ['activeTab', 'scripting', 'storage'],
    background: {
        service_worker: 'src/background/index.ts',
        type: 'module',
    },
    content_scripts: [
        {
            matches: ['<all_urls>'],
            js: ['src/content/index.tsx'],
            run_at: 'document_end',
        },
    ],
});
