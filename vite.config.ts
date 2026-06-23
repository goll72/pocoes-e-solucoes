import type { UserConfig } from "vite";

export default {
    appType: "mpa",
    server: {
        port: 3000,
        proxy: {
            "/api": "http://localhost:8080",
        },
    },
    build: {
        target: "esnext",
        outDir: "../dist",
        emptyOutDir: true,
    },
    root: "src",
    resolve: {
        tsconfigPaths: true,
    },
} satisfies UserConfig;
