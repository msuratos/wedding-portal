export const createWedding = async (request, tokenCache) => {
  const resp = await fetch('wedding', {
    method: 'POST', body: JSON.stringify(request),
    headers:
    {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${tokenCache.accessToken}`
    }
  });
  return await resp.json();
};

export const getWedding = async (tokenCache) => {
  const resp = await fetch('wedding', {
    method: 'GET',
    headers: { 'Authorization': `Bearer ${tokenCache.accessToken}` }
  });

  return await resp.json();
};