/**
 * External dependencies
 */
import { createInertiaApp } from "@inertiajs/react";
import { resolvePageComponent } from "laravel-vite-plugin/inertia-helpers";
import { createRoot } from "react-dom/client";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";

/**
 * Internal dependencies
 */
import queryClient from "@/data/query-client";
import "../scss/app.scss";

const appName = import.meta.env.VITE_APP_NAME || "Laravel";

createInertiaApp({
    title: (title) => (title ? title : appName),
    resolve: (name) =>
        resolvePageComponent(
            `./pages/${name}.jsx`,
            import.meta.glob("./pages/**/*.jsx"),
        ),
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(
            <QueryClientProvider client={queryClient}>
                <App {...props} />

                <Toaster />
            </QueryClientProvider>,
        );
    },
    progress: {
        color: "#4B5563",
    },
});
