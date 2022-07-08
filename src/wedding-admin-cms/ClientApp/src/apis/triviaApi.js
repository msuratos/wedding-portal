export const addTrivia = async (question, accessToken) => {
  const resp = await fetch('/api/trivia/questions', {
    method: 'POST',
    body: JSON.stringify(question),
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    }
  });

  return resp;
};

export const getTrivia = async (weddingId, accessToken) => {
  const resp = await fetch(`/api/trivia?weddingId=${weddingId}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${accessToken}`
    }
  });

  return await resp.json();
};

export const closeTrivia = async (status, accessToken) => {
  const resp = await fetch('/api/trivia/status', {
    method: 'POST',
    body: JSON.stringify(status),
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`
    }
  });

  return resp;
};