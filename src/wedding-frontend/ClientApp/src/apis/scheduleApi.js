export const getSchedule = async () => {
  const resp = await fetch('/api/schedule');
  return await resp.json();
};