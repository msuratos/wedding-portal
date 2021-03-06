export const addEntourage = async (request) => {
  const { name, roleIdOfEntourage, entourageOfWeddingId, token } = request;

  const resp = await fetch('wedding/entourage', {
    method: 'POST', body: JSON.stringify({ name, roleIdOfEntourage, entourageOfWeddingId }),
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });
  return await resp.json();
};

export const createWedding = async (request, tokenCache) => {
  const resp = await fetch('wedding', {
    method: 'POST', body: JSON.stringify(request),
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${tokenCache.accessToken}`
    }
  });
  return await resp.json();
};

export const editMessageApi = async (request, token) => {
  const resp = await fetch('wedding/message', {
    method: 'POST', body: JSON.stringify(request),
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });
  return await resp.json();
};

export const getEntourage = async (weddingId, tokenCache) => {
  const resp = await fetch(`entourage?weddingId=${weddingId}`, {
    method: 'GET',
    headers: { 'Authorization': `Bearer ${tokenCache.accessToken}` }
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

export const updateWedding = async (request, tokenCache) => {
  const resp = await fetch('wedding', {
    method: 'PATCH',
    body: JSON.stringify(request),
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${tokenCache.accessToken}`
    }
  });

  return await resp.json();
};