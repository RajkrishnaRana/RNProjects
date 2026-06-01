export const formData = {
    screens: [
        {
            screenId: '3435qdfi34t35r32rt',
            name: 'GeoTag Trees',
            form: [
                {
                    name: 'location',
                    type: 'LOCATION',
                    required: true,
                    visible: false,
                    auto: true,
                    display: 'Location',
                },
                {
                    name: 'image',
                    type: 'CAMERA_IMAGE',
                    required: true,
                    visible: true,
                    auto: false,
                    display: 'Image',
                },
                {
                    name: 'jaat',
                    type: 'TEXT',
                    required: false,
                    visible: true,
                    auto: false,
                    display: 'Jaat',
                },
                {
                    name: 'dateOfPlanting',
                    type: 'DATE',
                    required: false,
                    visible: true,
                    auto: false,
                    display: 'Date Of Planting',
                },
                {
                    name: 'girthHeight',
                    type: 'NUMBER',
                    required: false,
                    visible: true,
                    auto: false,
                    display: 'Girth Height',
                },
                {
                    name: 'notes',
                    type: 'TEXT_DESCRIPTION',
                    required: false,
                    visible: true,
                    auto: false,
                    display: 'Notes',
                },
            ],
            postSubmit: 'RESET/BACK', // DEFAULT BEHAVIOUR IS RESET.
        },
        {
            name: 'Feedback',
            form: [
                {
                    name: 'topic',
                    type: 'SELECT',
                    options: 'data1',
                    required: true,
                    visible: true,
                    auto: false,
                    display: 'Girth Height',
                },
                {
                    name: 'notes',
                    type: 'TEXT_DESCRIPTION',
                    required: true,
                    visible: true,
                    auto: false,
                    display: 'Notes',
                },
                {
                    name: 'authorized',
                    required: true,
                    visible: true,
                    auto: false,
                    display: 'Authorized',
                    type: 'TOGGLE',
                },
                {
                    name: 'options',
                    required: true,
                    visible: true,
                    auto: false,
                    display: 'Options',
                    type: 'MULTI_SELECT',
                    options: 'data2',
                },
            ],
        },
    ],
    dataSources: {
        data1: [
            {
                id: 'BASIC',
                value: 'BASIC',
            },
            {
                id: 'URGENT',
                value: 'Urgent',
            },
        ],
        data2: [
            {
                id: 'BASIC2',
                value: 'BASIC2',
            },
            {
                id: 'URGENT2',
                value: 'Urgent2',
            },
        ],
    },
};
