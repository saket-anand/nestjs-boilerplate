export function getDateAfterSeconds(seconds: number): Date {
  const currentDate = new Date();
  currentDate.setSeconds(currentDate.getSeconds() + seconds);
  return currentDate;
}

export function getSecondsForDays(days: number): number {
  return days * 24 * 60 * 60;
}
