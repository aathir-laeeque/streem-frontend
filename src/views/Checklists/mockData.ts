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
    name: 'CHECKLIST',
    code: 'CHK-JUN10-1',
    version: null,
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
                type: 'MATERIAL',
                data: [
                  {
                    name: 'Nylon scrubber',
                    image: '/medias/static.jpg',
                    quantity: 1,
                  },
                  {
                    name: 'Nylon Brush',
                    image: '/medias/static.jpg',
                    quantity: 1,
                  },
                  {
                    name: 'Scrapper',
                    image: '/medias/static.jpg',
                    quantity: 1,
                  },
                  {
                    name: 'Vacuum Cleaner',
                    image: '/medias/static.jpg',
                    quantity: 1,
                  },
                  {
                    name: 'High Pressure Jet',
                    image: '/medias/static.jpg',
                    quantity: 1,
                  },
                  {
                    name: 'Telescopic Pole',
                    image: '/medias/static.jpg',
                    quantity: 1,
                  },
                  {
                    name: 'Link Free Cloth',
                    image: '/medias/static.jpg',
                    quantity: 1,
                  },
                ],
                medias: [],
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
                type: 'INSTRUCTION',
                data: [
                  {
                    name: 'Use 5% KOH when Eudragit is used',
                  },
                  {
                    name: 'Use Acetone for scrubbing where Omeprazole is used',
                  },
                  {
                    name: 'In all other cases use 1.0% v/v Hempton solution',
                  },
                ],
                medias: [],
              },
              {
                id: 3,
                type: 'MULTIPLECHOICE',
                data: [
                  {
                    name: 'Item1: 1.0% v/v Hempton Solution',
                    value: 1,
                  },
                  {
                    name: 'Item 2: Acetone ',
                    value: 2,
                  },
                  {
                    name: 'Item 3: 5% KOH Solution',
                    value: 3,
                  },
                ],
                medias: [],
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
                type: 'YESNO',
                data: [
                  {
                    name: 'Positive',
                    type: 'yes',
                    value: 1,
                  },
                  {
                    name: 'Negative',
                    type: 'no',
                    value: 2,
                  },
                ],
                medias: [],
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
                type: 'MULTIPLECHOICE',
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
                medias: [],
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
                type: 'YESNO',
                data: [
                  {
                    name: 'Positive',
                    type: 'yes',
                    value: 1,
                  },
                  {
                    name: 'Negative',
                    type: 'no',
                    value: 2,
                  },
                ],
                medias: [],
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
                type: 'YESNO',
                data: [
                  {
                    name: 'Positive',
                    type: 'yes',
                    value: 1,
                  },
                  {
                    name: 'Negative',
                    type: 'no',
                    value: 2,
                  },
                ],
                medias: [],
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
                type: 'MATERIAL',
                data: [
                  {
                    name: 'Polythene Bag',
                    image: '/medias/static.jpg',
                    quantity: 1,
                  },
                  {
                    name: 'To be destroyed label',
                    image: '/medias/static.jpg',
                    quantity: 1,
                  },
                ],
                medias: [],
              },
              {
                id: 9,
                type: 'CHECKLIST',
                data: [
                  {
                    name: 'Item 1: Material put in double polythene bag',
                    value: 1,
                  },
                  {
                    name: 'Item 2: To Be Destroyed label affixed',
                    value: 2,
                  },
                  {
                    name: 'Item 3: Material transferred in bin',
                    value: 3,
                  },
                ],
                medias: [],
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
                type: 'INSTRUCTION',
                data: [
                  {
                    name:
                      'Collect the finger bag in polythene bag and close the bag with cable tie and transfer it to the wash area with “To be cleaned label”  in closed condition.',
                  },
                ],
                medias: [],
              },
              {
                id: 11,
                type: 'CHECKLIST',
                data: [
                  {
                    name: 'Item 1: Finger Bag closed in the polythene?',
                    value: 1,
                  },
                  {
                    name: 'Item 2: To Be Cleaned label affixed?',
                    value: 2,
                  },
                ],
                medias: [],
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
                id: 12,
                type: 'INSTRUCTION',
                data: [
                  {
                    name: 'Clean the Finger Bag as per SOP-MFG-01344',
                  },
                ],
                medias: [],
              },
              {
                id: 13,
                type: 'MEDIA',
                data: {},
                medias: [
                  {
                    name: 'Image',
                    type: '/medias/static.jpg',
                    link: '/medias/static.jpg',
                  },
                ],
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
                type: 'MULTISELECT',
                data: [
                  {
                    name: 'Item 1: Bowl No. 01D',
                    value: 1,
                  },
                  {
                    name: 'Item 2: Bowl No. 02D',
                    value: 2,
                  },
                ],
                medias: [],
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
                type: 'CHECKLIST',
                data: [
                  {
                    name: 'Item 1: Base Plate',
                    value: 1,
                  },
                  {
                    name: 'Item 2: Dutch Mesh Assembly',
                    value: 2,
                  },
                  {
                    name: 'Item 3: Support Cross',
                    value: 3,
                  },
                  {
                    name: 'Item 4: Sampling Port',
                    value: 4,
                  },
                  {
                    name: 'Item 5: View Glasses',
                    value: 5,
                  },
                  {
                    name: 'Item 6: Discharging Port',
                    value: 6,
                  },
                ],
                medias: [],
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
                type: 'SHOULDBE',
                data: [
                  {
                    UOM: 'Bar',
                    type: 'Quantity',
                    Target: {
                      Rule: 'Not less than',
                      Value: 50,
                    },
                  },
                ],
                medias: [],
              },
            ],
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
                type: 'YESNO',
                data: [
                  {
                    name: 'Positive',
                    type: 'yes',
                    value: 1,
                  },
                  {
                    name: 'Negative',
                    type: 'no',
                    value: 2,
                  },
                ],
                medias: [],
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
                type: 'MEDIA',
                data: {},
                medias: [
                  {
                    name: 'Image',
                    type: '/medias/static.jpg',
                    link: '/medias/static.jpg',
                  },
                  {
                    name: 'Image',
                    type: '/medias/static.jpg',
                    link: '/medias/static.jpg',
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
                type: 'YESNO',
                data: [
                  {
                    type: 'yes',
                    name: 'All Clean',
                    value: 1,
                  },
                  {
                    type: 'no',
                    name: 'Not Clean',
                    value: 0,
                  },
                ],
                medias: [],
              },
              {
                id: 19,
                type: 'TEXTBOX',
                data: [],
                medias: [],
              },
              {
                id: 20,
                type: 'SIGNATURE',
                data: [],
                medias: [],
              },
            ],
            mandatory: false,
          },
        ],
      },
    ],
  },
  pageable: null,
  errors: null,
});

export const getChecklist = (id: number): any => apiGetChecklist(id);
