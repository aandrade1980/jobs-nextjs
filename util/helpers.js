export const sortCategories = (categories = []) =>
  categories.sort((a, b) =>
    a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1
  );
