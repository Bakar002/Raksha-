export const transformPagesToCategories = (pages) => {
  const categoryMap = {};

  pages?.forEach((page) => {
    const { category, title, bannerImage, _id } = page;

    if (!categoryMap[category]) {
      categoryMap[category] = {
        category: category,
        pages: [],
      };
    }

    categoryMap[category].pages.push({ title, _id, bannerImage });
  });

  return Object.values(categoryMap);
};
