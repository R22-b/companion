// vite-plugin-electron-external.js
export default function electronExternalPlugin() {
    return {
        name: 'electron-external',
        resolveId(source) {
            if (source === 'electron') {
                return { id: 'electron', external: true, moduleSideEffects: false };
            }
        }
    };
}
