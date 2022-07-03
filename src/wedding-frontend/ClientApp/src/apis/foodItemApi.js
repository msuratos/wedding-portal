export const getFoodItems = async () => {
  const resp = await fetch('/api/fooditem');
  return await resp.json();
};