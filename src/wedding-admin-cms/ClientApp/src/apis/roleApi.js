export const addRole = async ({description, name, token}) => {
  const requestOptions = { method: 'POST', body: JSON.stringify({description, name}), 
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    } 
  };

  const resp = await fetch('api/role', requestOptions);
  return await resp.json();
};

export const getRoles = async (accesstoken) => {
  const resp = await fetch('api/role', {
    headers: {
      "Authorization": `Bearer ${accesstoken}`
    }
  });
  return await resp.json();
};