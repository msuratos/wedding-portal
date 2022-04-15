export const createGuestsWithFile = async (formData, accessToken) => {
  const resp = await fetch('/api/guest', {
    method: "POST",
    body: formData,
    headers: {
      'Authorization': `Bearer ${accessToken}`
    }
  });

  return resp.ok;
};

export const getGuests = async (accessToken) => {
  const resp = await fetch('/api/guest', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${accessToken}`
    }
  });

  if (resp.ok) return await resp.json();
  else return [];
};