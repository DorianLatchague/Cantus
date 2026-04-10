import { defineConfig } from 'vite';

export default defineConfig({
    build: {
        sourcemap: true,
        lib: {
            entry: 'src/cli.ts',
            formats: ['cjs'],
            fileName: () => 'cli.js',
        },
        outDir: 'bin',
        rollupOptions: {
            external: (id, importer) => {
                if (!importer) return false;
                if (id.startsWith('.') || id.startsWith('/') || id.startsWith('\0') || /^[A-Z]:/i.test(id)) return false;
                return true;
            },
        },
    },
});
