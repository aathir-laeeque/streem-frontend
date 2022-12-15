export const filtersToQueryParams = (data: any[]) => {
  let filters = data.map((currData: any) => ({
    field: currData.key,
    op: currData.constraint,
    values: ['startedAt', 'createdAt', 'modifiedAt'].includes(currData.key)
      ? [parseInt(currData.value)]
      : [currData.value],
  }));

  return filters;
};
