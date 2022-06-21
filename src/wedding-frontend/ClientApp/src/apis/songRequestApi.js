export const addSongRequest = async (songRequests) => {
  const resp = await fetch('/api/songrequest', {
    method: 'POST',
    body: JSON.stringify({ songNames: songRequests }),
    headers: {
      'Content-Type': 'application/json'
    }
  });

  if (resp.ok) return true;
  else return false;
};