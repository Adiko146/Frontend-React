export const useFilterProducts = (products, filters) => {
  return products.filter(product => {
    const price = Number(product.price);
    const stock = Number(product.stock);

    const minPrice = Number(filters.minPrice);
    const maxPrice = Number(filters.maxPrice);
    const minStock = Number(filters.stock);

    return (
      (!filters.category || product.category === filters.category) &&
      (!filters.minPrice || (!isNaN(minPrice) && price >= minPrice)) &&
      (!filters.maxPrice || (!isNaN(maxPrice) && price <= maxPrice)) &&
      (!filters.stock || (!isNaN(minStock) && stock >= minStock))
    );
  });
};
