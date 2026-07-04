export const normalizeIndonesianPhoneNumber = (value) => {
  if (value === null || value === undefined) {
    return null;
  }

  const compactValue = String(value)
    .trim()
    .replace(/[\s()-]/g, "");

  let normalizedValue;

  if (/^08\d+$/.test(compactValue)) {
    normalizedValue = `+62${compactValue.slice(1)}`;
  } else if (/^628\d+$/.test(compactValue)) {
    normalizedValue = `+${compactValue}`;
  } else if (/^\+628\d+$/.test(compactValue)) {
    normalizedValue = compactValue;
  } else {
    return null;
  }

  return /^\+628\d{7,12}$/.test(normalizedValue)
    ? normalizedValue
    : null;
};

