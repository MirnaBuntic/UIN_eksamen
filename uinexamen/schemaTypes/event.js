export default {
    name: 'event',
    type: 'document',
    title: 'Event',
    fields: [
        {
            name: 'title',
            type: 'string',
            title: 'Tittel på arrangementet'
        },

        {
            name: 'apiId',
            type: 'string',
            title: 'API-id till arrangementet'
        },
    ],
};