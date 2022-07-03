export const getFoodItemsForWedding = async (weddingId, accessToken) => {
  const resp = await fetch(`/api/fooditem?weddingId=${weddingId}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${accessToken}`
    }
  });

  return await resp.json();
};