export const generateLinks = (categories, filterCategories) =>
  categories
    .filter((category) => filterCategories.includes(category.category))
    .flatMap((category) =>
      category.pages.map((page) => ({
        label: page.title,
        link: `/${category.category
          .toLowerCase()
          .replace(/ & /g, "-")
          .replace(/ /g, "-")}/${page.title.toLowerCase().replace(/ /g, "-")}`,
      }))
    );
