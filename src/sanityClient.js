import SanityClientConstructor from '@sanity/client';

export const client = SanityClientConstructor ({
    projectID: "21myogrg",
    dataset: "production",
    apiVersion: "v2025-03-24",
    useCdn: false,
});