export const toSlug = (name) => {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
};

export const shopUrl = (code, name) => `/shop/${code}/${toSlug(name)}`;
export const productUrl = (code, name) => `/product/${code}/${toSlug(name)}`;
export const categoryUrl = (name) => `/collections/${toSlug(name)}`;
