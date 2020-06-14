import { Checklist } from './types';

const apiGetCheckslists = (): any => ({
  object: 'list',
  status: 'ok',
  message: 'success',
  data: [
    {
      id: 1,
      name: 'CHECKLIST',
      code: 'CHK-JUN10-1',
      version: 1,
      stages: [
        {
          id: 2,
          name: 'Initial Dry Cleaning',
          code: 'STG-JUN10-2',
          steps: [
            {
              id: 5,
              name:
                'Remove hose pipe from the charging and discharging assembly',
              code: 'STEP-JUN10-2',
            },
            { id: 4, name: 'Clean the finger bag', code: 'STEP-JUN10-1' },
            {
              id: 6,
              name:
                'Remove the Spray gun assembly from Gun Port, Silicon Tubes, Atomisation Air Pipe from Spray Gun Assembly',
              code: 'STEP-JUN10-3',
            },
            {
              id: 7,
              name:
                'Collect the material in double polythene bag and Affix the REJECT TO BE DESTROYED LABEL on collected scrap material and transfer it to reject bin',
              code: 'STEP-JUN10-4',
            },
          ],
        },
        {
          id: 5,
          name: 'Wash the Equipment Parts',
          code: 'STG-JUN10-5',
          steps: [
            {
              id: 13,
              name: 'Wash the exhaust air duct flap for NLT 2 minutes',
              code: 'STEP-JUN10-1',
            },
            {
              id: 14,
              name:
                'Wash the outer surface of inlet & exhaust air duct for NLT 3 minutes',
              code: 'STEP-JUN10-1',
            },
            {
              id: 12,
              name:
                'Switch on the High Pressure Jet Cleaning Machine and set its Pressure at NLT 50 bar',
              code: 'STEP-JUN10-1',
            },
          ],
        },
        {
          id: 4,
          name: 'Dismantling of Parts',
          code: 'STG-JUN10-4',
          steps: [
            {
              id: 11,
              name: 'Dismantle the Container Bowls',
              code: 'STEP-JUN10-1',
            },
            {
              id: 10,
              name: 'Choose the applicable Bowls',
              code: 'STEP-JUN10-1',
            },
          ],
        },
        {
          id: 7,
          name: 'Initial Inspection',
          code: 'STG-JUN10-7',
          steps: [
            {
              id: 17,
              name: 'Inspect View Glasses in dismantled condition',
              code: 'STEP-JUN10-1',
            },
          ],
        },
        {
          id: 1,
          name: 'Procure Material',
          code: 'STG-JUN10-1',
          steps: [
            {
              id: 1,
              name: 'Ensure that you have the following cleaning aids:',
              code: 'STEP-JUN10-1',
            },
            {
              id: 3,
              name:
                'Ensure that TO BE CLEANED label is affixed on the Equipment',
              code: 'STEP-JUN10-3',
            },
            {
              id: 2,
              name: 'Get the Cleaning Agent',
              code: 'STEP-JUN10-2',
            },
          ],
        },
        {
          id: 3,
          name: 'Initial Wash',
          code: 'STG-JUN10-3',
          steps: [
            {
              id: 8,
              name: 'Dispose of the Finger Bag',
              code: 'STEP-JUN10-1',
            },
            { id: 9, name: 'Clean the Finger Bag', code: 'STEP-JUN10-1' },
          ],
        },
        {
          id: 6,
          name: 'Clean the Inlet Air Duct and Flap',
          code: 'STG-JUN10-3',
          steps: [
            {
              id: 15,
              name:
                'Flush the inlet air duct up-to bent and both sides of damper flap, gasket with process water using high pressure jet.',
              code: 'STEP-JUN10-1',
            },
            {
              id: 16,
              name:
                'Scrub the inlet air duct flap with 1.0 v/v Hem-top from both sides and gasket rim with nylon scrubber',
              code: 'STEP-JUN10-1',
            },
          ],
        },
      ],
    },
  ],
  pageable: {
    page: 0,
    pageSize: 20,
    numberOfElements: 1,
    totalPages: 1,
    totalElements: 1,
    first: true,
    last: true,
    empty: false,
  },
  errors: null,
});

export const checklists = apiGetCheckslists();

const apiGetChecklist = (checklistId: number) => ({
  object: 'object',
  status: 'ok',
  message: 'success',
  data: {
    id: 1,
    name: 'Fuild Bed Dryer Checklist',
    code: 'CHK-JUN10-1',
    version: 1,
    archived: false,
    stages: [
      {
        id: 1,
        name: 'Procure Material',
        code: 'STG-JUN10-1',
        steps: [
          {
            id: 1,
            name: 'Ensure that you have the following cleaning aids:',
            code: 'STEP-JUN10-1',
            hasStop: false,
            interactions: [
              {
                id: 1,
                type: 'material',
                data: [
                  {
                    link: 'http://api.streem.leucinetech.com/medias/static.jpg',
                    name: 'Nylon Scrubber',
                    type: 'image',
                    filename: 'static.jpg',
                    quantity: 1,
                  },
                  {
                    link: 'http://api.streem.leucinetech.com/medias/static.jpg',
                    name: 'Nylon Brush',
                    type: 'image',
                    filename: 'static.jpg',
                  },
                  {
                    link: 'http://api.streem.leucinetech.com/medias/static.jpg',
                    name: 'Scrapper',
                    type: 'image',
                    filename: 'static.jpg',
                  },
                  {
                    link: 'http://api.streem.leucinetech.com/medias/static.jpg',
                    name: 'Vaccum Cleaner',
                    type: 'image',
                    filename: 'static.jpg',
                  },
                  {
                    link: 'http://api.streem.leucinetech.com/medias/static.jpg',
                    name: 'High Pressure Jet',
                    type: 'image',
                    filename: 'static.jpg',
                  },
                  {
                    link: 'http://api.streem.leucinetech.com/medias/static.jpg',
                    name: 'Telescopic Pole',
                    type: 'image',
                    filename: 'static.jpg',
                  },
                  {
                    link: 'http://api.streem.leucinetech.com/medias/static.jpg',
                    name: 'Link Free Cloth',
                    type: 'image',
                    filename: 'static.jpg',
                  },
                ],
              },
            ],
            mandatory: false,
          },
          {
            id: 2,
            name: 'Get the Cleaning Agent',
            code: 'STEP-JUN10-2',
            hasStop: false,
            interactions: [
              {
                id: 2,
                type: 'instruction',
                data: {
                  text:
                    'Use 5% KOH when Eudragit is used. Use Acetone for scrubbing where Omeprazole is used. In all other cases use 1.0% v/v Hempton solution',
                },
              },
              {
                id: 3,
                type: 'multiselect',
                data: [
                  { name: 'Item1: 1.0% v/v Hempton Solution', value: 1 },
                  { name: 'Item 2: Acetone ', value: 2 },
                  { name: 'Item 3: 5% KOH Solution', value: 3 },
                ],
              },
            ],
            mandatory: false,
          },
          {
            id: 3,
            name: 'Ensure that TO BE CLEANED label is affixed on the Equipment',
            code: 'STEP-JUN10-3',
            hasStop: true,
            interactions: [
              {
                id: 4,
                type: 'yes-no',
                label: 'Is the tag fixed?',
                data: [
                  { name: 'Positive', type: 'yes', value: 1 },
                  { name: 'Negative', type: 'no', value: 2 },
                ],
              },
            ],
            mandatory: false,
          },
        ],
      },
      {
        id: 2,
        name: 'Initial Dry Cleaning',
        code: 'STG-JUN10-2',
        steps: [
          {
            id: 4,
            name: 'Clean the finger bag',
            code: 'STEP-JUN10-1',
            hasStop: true,
            interactions: [
              {
                id: 5,
                type: 'multiselect',
                data: [
                  {
                    name:
                      'Item 1: Remove the adhering material of the Finger bag by repetitive shaking in manual mode',
                    value: 1,
                  },
                  {
                    name:
                      'Item 2: Go to ‘GENERAL’ function and select ‘Filter’ then pressing ‘Blow out filter manually’ icon for manually shaking',
                    value: 2,
                  },
                ],
              },
            ],
            mandatory: false,
          },
          {
            id: 5,
            name: 'Remove hose pipe from the charging and discharging assembly',
            code: 'STEP-JUN10-2',
            hasStop: false,
            interactions: [
              {
                id: 6,
                type: 'yes-no',
                label: 'Spray Gun Removed?',
                data: [
                  { name: 'Positive', type: 'yes', value: 1 },
                  { name: 'Negative', type: 'no', value: 2 },
                ],
              },
            ],
            mandatory: false,
          },
          {
            id: 6,
            name:
              'Remove the Spray gun assembly from Gun Port, Silicon Tubes, Atomisation Air Pipe from Spray Gun Assembly',
            code: 'STEP-JUN10-3',
            hasStop: false,
            interactions: [
              {
                id: 7,
                type: 'yes-no',
                data: [
                  { name: 'Positive', type: 'yes', value: 1 },
                  { name: 'Negative', type: 'no', value: 2 },
                ],
              },
            ],
            mandatory: false,
          },
          {
            id: 7,
            name:
              'Collect the material in double polythene bag and Affix the REJECT TO BE DESTROYED LABEL on collected scrap material and transfer it to reject bin',
            code: 'STEP-JUN10-4',
            hasStop: true,
            interactions: [
              {
                id: 8,
                type: 'material',
                data: [
                  {
                    link: 'http://api.streem.leucinetech.com/medias/static.jpg',
                    name: 'Polythene Bag',
                    type: 'image',
                    filename: 'static.jpg',
                    quantity: 1,
                  },
                  {
                    link: 'http://api.streem.leucinetech.com/medias/static.jpg',
                    name: 'To be destroyed label',
                    type: 'image',
                    filename: 'static.jpg',
                    quantity: 1,
                  },
                ],
              },
              {
                id: 9,
                type: 'checklist',
                data: [
                  {
                    name: 'Item 1: Material put in double polythene bag',
                    value: 1,
                  },
                  { name: 'Item 2: To Be Destroyed label affixed', value: 2 },
                  { name: 'Item 3: Material transferred in bin', value: 3 },
                ],
              },
            ],
            mandatory: false,
          },
        ],
      },
      {
        id: 3,
        name: 'Initial Wash',
        code: 'STG-JUN10-3',
        steps: [
          {
            id: 8,
            name: 'Dispose of the Finger Bag',
            code: 'STEP-JUN10-1',
            hasStop: true,
            interactions: [
              {
                id: 10,
                type: 'instruction',
                data: {
                  text:
                    'Collect the finger bag in polythene bag and close the bag with cable tie and transfer it to the wash area with “To be cleaned label”  in closed condition.',
                },
              },
              {
                id: 11,
                type: 'checklist',
                data: [
                  {
                    name: 'Item 1: Finger Bag closed in the polythene?',
                    value: 1,
                  },
                  { name: 'Item 2: To Be Cleaned label affixed?', value: 2 },
                ],
              },
            ],
            mandatory: false,
          },
          {
            id: 9,
            name: 'Clean the Finger Bag',
            code: 'STEP-JUN10-1',
            hasStop: true,
            interactions: [
              {
                id: 13,
                type: 'media',
                data: [
                  {
                    link: 'http://api.streem.leucinetech.com/medias/static.jpg',
                    name: 'Image name',
                    type: 'image',
                    filename: 'static.jpg',
                  },
                  {
                    link: 'http://api.streem.leucinetech.com/medias/static.jpg',
                    name: 'Image name',
                    type: 'image',
                    filename: 'static.jpg',
                  },
                  {
                    link: 'http://api.streem.leucinetech.com/medias/static.jpg',
                    name: 'Image name',
                    type: 'image',
                    filename: 'static.jpg',
                  },
                  {
                    link: 'http://api.streem.leucinetech.com/medias/static.jpg',
                    name: 'Image name',
                    type: 'image',
                    filename: 'static.jpg',
                  },
                ],
              },
              {
                id: 12,
                type: 'instruction',
                data: { text: 'Clean the Finger Bag as per SOP-MFG-01344' },
              },
            ],
            mandatory: false,
          },
        ],
      },
      {
        id: 4,
        name: 'Dismantling of Parts',
        code: 'STG-JUN10-4',
        steps: [
          {
            id: 10,
            name: 'Choose the applicable Bowls',
            code: 'STEP-JUN10-1',
            hasStop: false,
            interactions: [
              {
                id: 14,
                type: 'multiselect',
                data: [
                  { name: 'Item 1: Bowl No. 01D', value: 1 },
                  { name: 'Item 2: Bowl No. 02D', value: 2 },
                ],
              },
            ],
            mandatory: false,
          },
          {
            id: 11,
            name: 'Dismantle the Container Bowls',
            code: 'STEP-JUN10-1',
            hasStop: true,
            interactions: [
              {
                id: 15,
                type: 'checklist',
                label: 'Following parts are to be dismantled',
                data: [
                  { name: 'Item 1: Base Plate', value: 1 },
                  { name: 'Item 2: Dutch Mesh Assembly', value: 2 },
                  { name: 'Item 3: Support Cross', value: 3 },
                  { name: 'Item 4: Sampling Port', value: 4 },
                  { name: 'Item 5: View Glasses', value: 5 },
                  { name: 'Item 6: Discharging Port', value: 6 },
                ],
              },
            ],
            mandatory: false,
          },
        ],
      },
      {
        id: 5,
        name: 'Wash the Equipment Parts',
        code: 'STG-JUN10-5',
        steps: [
          {
            id: 12,
            name:
              'Switch on the High Pressure Jet Cleaning Machine and set its Pressure at NLT 50 bar',
            code: 'STEP-JUN10-1',
            hasStop: true,
            interactions: [
              {
                id: 16,
                type: 'should-be',
                data: [
                  {
                    uom: 'Bar',
                    rule: 'not-less-than',
                    type: 'quantity',
                    value: '50',
                    parameter: 'Pressure',
                  },
                ],
              },
            ],
            mandatory: false,
          },
          {
            id: 13,
            name: 'Wash the exhaust air duct flap for NLT 2 minutes',
            code: 'STEP-JUN10-1',
            hasStop: true,
            interactions: [],
            mandatory: false,
          },
          {
            id: 14,
            name:
              'Wash the outer surface of inlet & exhaust air duct for NLT 3 minutes',
            code: 'STEP-JUN10-1',
            hasStop: true,
            interactions: [],
            mandatory: false,
          },
        ],
      },
      {
        id: 6,
        name: 'Clean the Inlet Air Duct and Flap',
        code: 'STG-JUN10-3',
        steps: [
          {
            id: 15,
            name:
              'Flush the inlet air duct up-to bent and both sides of damper flap, gasket with process water using high pressure jet.',
            code: 'STEP-JUN10-1',
            hasStop: false,
            interactions: [
              {
                id: 17,
                type: 'yes-no',
                label: 'Inlet Air Duct flushed with water?',
                data: [
                  { name: 'Positive', type: 'yes', value: 1 },
                  { name: 'Negative', type: 'no', value: 2 },
                ],
              },
            ],
            mandatory: false,
          },
          {
            id: 16,
            name:
              'Scrub the inlet air duct flap with 1.0 v/v Hem-top from both sides and gasket rim with nylon scrubber',
            code: 'STEP-JUN10-1',
            hasStop: false,
            interactions: [
              {
                id: 21,
                type: 'media',
                data: [
                  {
                    link: 'http://api.streem.leucinetech.com/medias/static.jpg',
                    name: 'Image name',
                    type: 'image',
                    filename: 'static.jpg',
                  },
                  {
                    link: 'http://api.streem.leucinetech.com/medias/static.jpg',
                    name: 'Image name',
                    type: 'image',
                    filename: 'static.jpg',
                  },
                ],
              },
            ],
            mandatory: false,
          },
        ],
      },
      {
        id: 7,
        name: 'Initial Inspection',
        code: 'STG-JUN10-7',
        steps: [
          {
            id: 17,
            name: 'Inspect View Glasses in dismantled condition',
            code: 'STEP-JUN10-1',
            hasStop: true,
            interactions: [
              {
                id: 18,
                type: 'yes-no',
                label: 'Cleaning Status',
                data: [
                  { name: 'All Clean', type: 'no', value: 1 },
                  { name: 'Not Clean', type: 'yes', value: 2 },
                ],
              },
              { id: 20, type: 'signature', data: [] },
              { id: 19, type: 'textbox', data: [] },
            ],
            mandatory: false,
          },
        ],
      },
    ],
    properties: {
      'EQUIPMENT ID': 'ZYD/SOP/001',
      TYPE: 'GROUP',
      'SOP NO': 'ZYD/SOP/CLN/001',
      'SL NO': null,
    },
  },
  pageable: null,
  errors: null,
});

export const getChecklist = (id: number): any => apiGetChecklist(id);
