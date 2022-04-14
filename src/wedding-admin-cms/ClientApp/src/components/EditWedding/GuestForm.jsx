import React, { useMemo, useState } from 'react';
import {
  Button, Col, Form, FormGroup, FormText,
  Input, Label, Spinner
} from 'reactstrap';
import { useMsal } from '@azure/msal-react';

const GuestForm = () => {
  const [inputs, setInputs] = useState({});
  const [loading, setLoading] = useState(false);

  const msal = useMsal();
  const { instance, accounts } = msal;

  const silentRequest = useMemo(() => {
    return {
      scopes: ["https://syzmicb2c.onmicrosoft.com/weddingportalapi/user.access"],
      account: accounts[0]
    }
  }, [accounts]);

  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.files[0];
    setInputs({ name, value });
  };

  const formSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const tokenCache = await instance.acquireTokenSilent(silentRequest);
      const formData = new FormData();
      formData.append('file', inputs.value);

      const resp = await fetch('/api/Guest', {
        method: "POST",
        body: formData,
        headers: {
          'Authorization': `Bearer ${tokenCache.accessToken}`
        }
      });

      console.log(resp);
    }
    catch (error) {
      console.error('failed to upload excel', error);
    }
    finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Form encType="multipart/form-data" onSubmit={formSubmit} style={{ padding: '15px' }}>
        <FormGroup row>
          <Label for="file" sm={2}>File</Label>
          <Col sm={10}>
            <Input id="file" name="file" type="file" onChange={handleChange} />
            <FormText>Please upload .xlsx or .xls files with the correct format in order to process properly</FormText>
          </Col>
        </FormGroup>
        <FormGroup>
          <Button color="primary" type="submit" style={{ width: '100%' }}>Upload</Button>
        </FormGroup>
      </Form>
      {
        !loading
          ? <>{/* TODO: show a table of the guests */}</>
          : (
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <Spinner />
            </div>
          )
      }
    </>
  );
};

export default GuestForm;