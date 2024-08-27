export function convertToStandardObject(obj) {
  // Base case for non-objects or null
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  // Convert Arrays
  if (Array.isArray(obj)) {
    return obj.map((item) => convertToStandardObject(item));
  }

  // Convert Objects
  const standardObject = {};
  for (const key of Object.keys(obj)) {
    standardObject[key] = convertToStandardObject(obj[key]);
  }
  return standardObject;
}

export function truncateTitle(title, maxLength = 60) {
  if (title.length > maxLength) {
    const lastIndex = title.substring(0, maxLength).lastIndexOf(' ');
    return lastIndex > 0
      ? title.substring(0, lastIndex)
      : title.substring(0, maxLength);
  }
  // If the title is 60 characters or shorter, return it unchanged
  return title;
}
