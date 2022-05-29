export async function rsvpGuest(rsvpList) {
  const resp = await fetch('api/guest', {
    method: 'POST',
    body: JSON.stringify(rsvpList),
    headers: {
      'Content-Type': 'application/json'
    }
  });

  if (!resp.ok) throw new Error('updating guest rsvp failed');
}

export async function searchGuest(nameSearchValue) {
  const resp = await fetch(`api/guest?nameSearchValue=${nameSearchValue}`);
  return await resp.json();
}