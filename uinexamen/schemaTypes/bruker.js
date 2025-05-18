export default {
    name: 'bruker',
    type: 'document',
    title: 'Bruker',
    fields: [
        {
            name: "username",
            title: "Brukernavn",
            type: "string",
            validation: (Rule) => Rule.required() //Chatgpt nr5
        },
        {
            name: 'name',
            type: 'string',
            title: 'Navn',
        },
        {
            name: 'email',
            type: 'string',
            title: 'E-post'
        },
        {
            name: 'image',
            type: 'image',
            title: 'Profilbilde',
            options: {
                hotspot: true,
            },
        },
        {
            name: 'gender',
            type: 'string',
            title: 'Kjønn',
            options: {
                list: ['Mann', 'Kvinne', 'Annet'],
            },
        },
        {
            name: 'age',
            type: 'number',
            title: 'Alder',
        },
        {
            name: 'previousPurchases',
            type: 'array',
            title: 'Mine kjøp',
            of: [{ type: 'reference', to: [{ type: 'event' }] }],
        },
        {
            name: 'wishList',
            type: 'array',
            title: 'Min ønskeliste',
            of: [{ type: 'reference', to: [{ type: 'event' }] }],
        },
        {
            name: 'friends',
            title: 'Venner',
            type: 'array',
            of: [{ type: 'reference', to: [{ type: 'bruker' }] }],
        },
    ],
};