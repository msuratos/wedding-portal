export const addRole = async (role) => {
  const requestOptions = { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(role) };
  const resp = await fetch('api/role', requestOptions);
  return await resp.json();
};

export const getRoles = async () => {
  const resp = await fetch('api/role');
  return await resp.json();
};