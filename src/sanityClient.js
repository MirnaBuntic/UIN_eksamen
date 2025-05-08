import { createClient } from '@sanity/client';

export const client = createClient ({
    projectId: "21myogrg",
    dataset: "production",
    apiVersion: "v2025-03-24",
    useCdn: false,
});