export const getTrivia = async () => {
  const resp = await fetch('/api/trivia');
  return await resp.json();
};