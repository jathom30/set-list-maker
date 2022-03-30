export const createGrammaticList = (items: (string | number)[]) => {
  if (items.length === 1) {
    return items[0];
  }
  if (items.length === 2) {
    return `${items[0]} and ${items[1]}`;
  }
  const lastItem = items[items.length - 1];
  return `${items
    .slice(0, -1)
    .map((item) => `${item}, `)
    .join('')}and ${lastItem}`;
};

export const capitalizeFirstLetter = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);