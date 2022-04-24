export const getSongs = async (accessToken) => {
  const resp = await fetch('/api/songrequest', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${accessToken}`
    }
  });

  if (resp.ok) return await resp.json();
  else return [];
};