import React, { useEffect, useState } from 'react';
import { Button, Col, Input, FormGroup, Row } from 'reactstrap';
import { useMsal } from '@azure/msal-react';

import WeddingTable from '../components/WeddingTable';
import { getWedding } from '../apis/weddingApi';

const Home = () => {
  const [weddingId, setWeddingId] = useState('');
  const [wedding, setWedding] = useState({});

  const msal = useMsal();
  const { accounts, instance } = msal;

  const addWedding = async () => {
    const silentRequest = {
      scopes: ["https://syzmicb2c.onmicrosoft.com/weddingportalapi/user.access"],
      account: accounts[0]
    };

    const tokenCache = await instance.acquireTokenSilent(silentRequest);
    const resp = await fetch(`wedding?weddingId=${weddingId}`, {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${tokenCache.accessToken}` }
    });
    console.log(resp);
  };

  useEffect(() => {
    async function getData() {
      const silentRequest = {
        scopes: ["https://syzmicb2c.onmicrosoft.com/weddingportalapi/user.access"],
        account: accounts[0]
      };

      try {
        const tokenCache = await instance.acquireTokenSilent(silentRequest);
        const respData = await getWedding(tokenCache);
        setWedding(respData);
      }
      catch (error) {
        console.error(error);
      }
    };

    getData();
  }, [accounts, instance]);

  return (
    <div>
      <h1>Welcome to your Wedding Portal,</h1>
      <p>where you can create your online wedding invitation, registry, about us page, and more!</p>
      <ul>
        <li><a href='/edit-wedding'>Edit Wedding</a> Click this to edit your wedding information!</li>
        <li><a href='/'>Edit Registory</a> Click this to edit your wedding registry!</li>
        <li><a href='/'>Edit About Us</a> Click this to edit your <i>About Us</i> page</li>
      </ul>
      <p>To help you get started, we have also set up:</p>
      <ul>
        <li><strong>Manage your entourage!</strong>. For example, click <em>Edit Weddings</em> to continue</li>
        <li><strong>Manage your roles in your entourage!</strong>. For example, click <em>Edit Weddings</em> to continue</li>
      </ul>
      <WeddingTable wedding={wedding} />
      <Row>
        <Col xs={12}>
          <FormGroup row>
            <Col xs={10}>
              <Input name="weddingid" placeholder="Wedding ID" value={weddingId} onChange={(e) => setWeddingId(e.target.value)} />
            </Col>
            <Col xs={2}>
              <Button color="primary" onClick={addWedding}>Add Wedding</Button>
            </Col>
          </FormGroup>
        </Col>
      </Row>
    </div>
  );
};

export default Home;