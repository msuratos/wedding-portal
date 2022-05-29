export async function getWeddingPhotos() {
  const resp = await fetch('/api/wedding/photos');

  if (resp.ok)
    return await resp.json();
  else
    throw new Error('Error getting images');
}

export async function validatePassphrase(passphrase) {
  console.debug('validating passphrase');
  const resp = await fetch('api/wedding', {
    method: 'POST',
    body: JSON.stringify({ passphrase }),
    headers: { 'Content-Type': 'application/json' }
  });

  if (!resp.ok) throw new Error('invalid passphrase');
  else return (await resp.text()).toLowerCase() === 'true';
}