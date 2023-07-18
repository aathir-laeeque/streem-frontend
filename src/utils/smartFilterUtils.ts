export const getActiveSmartFilter = (cards: any, activeCard: string) => {
  const activeSmartFilters = cards
    .find((item) => item.label === activeCard)
    ?.filters?.reduce((acc, filter) => {
      acc[filter.field] = true;
      return acc;
    }, {});

  return activeSmartFilters;
};
