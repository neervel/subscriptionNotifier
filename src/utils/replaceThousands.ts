export const replaceThousands = (num: number): string => {
  const re = /\B(?=(\d{3})+(?!\d))/g
  return num.toString().replace(re, '.');
}
