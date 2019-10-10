export const debounce = (func: () => void, wait: number) => {
  let h: number | NodeJS.Timeout;
  return () => {
    clearTimeout(h as number);
    h = setTimeout(() => func(), wait);
  };
};
