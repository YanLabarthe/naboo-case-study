export function formatDate(date: Date) {
  if (!(date instanceof Date)) {
    date = new Date(date);
  }
  const day = `0${date.getDate()}`.slice(-2);
  const month = `0${date.getMonth() + 1}`.slice(-2);
  const year = date.getFullYear().toString().substr(-2);
  return `${day}/${month}/${year}`;
}
