export const getTrivia = async () => {
  const resp = await fetch('/api/trivia');
  return await resp.json();
};

export const postAnswer = async (useranswer) => {
  const resp = await fetch('/api/trivia/answer', {
    method: 'POST',
    body: JSON.stringify(useranswer),
    headers: {
      'Content-Type': 'application/json'
    }
  });

  return resp;
}