export const addActivity = async (activity, accessToken) => {
  const resp = await fetch('/api/schedule', {
    method: 'POST',
    body: JSON.stringify(activity),
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    }
  });

  return resp;
};

export const getSchedule = async (weddingId, accessToken) => {
  const resp = await fetch(`/api/schedule?weddingid=${weddingId}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${accessToken}`
    }
  });

  return await resp.json();
};