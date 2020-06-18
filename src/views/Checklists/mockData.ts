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
