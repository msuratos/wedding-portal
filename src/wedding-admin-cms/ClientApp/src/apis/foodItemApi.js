export const addFoodItemForWedding = async (foodItem, accessToken) => {
  const resp = await fetch(`/api/fooditem`, {
    method: 'POST',
    body: JSON.stringify(foodItem),
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    }
  });

  return resp;
};

export const getFoodItemsForWedding = async (weddingId, accessToken) => {
  const resp = await fetch(`/api/fooditem?weddingId=${weddingId}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${accessToken}`
    }
  });

  return await resp.json();
};