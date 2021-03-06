import React, { useEffect, useMemo, useState } from 'react';
import {
  Button, Col, Form, FormGroup, FormText,
  Input, Label, Spinner, Table
} from 'reactstrap';
import { useMsal } from '@azure/msal-react';
import { createGuestsWithFile, getGuests } from '../../apis/guestApi';

const GuestForm = () => {
  const [guests, setGuests] = useState([]);
  const [inputs, setInputs] = useState({});
  const [loading, setLoading] = useState(false);

  const msal = useMsal();
  const { instance, accounts } = msal;

  const silentRequest = useMemo(() => {
    return {
      scopes: [`${process.env.REACT_APP_B2C_URL}/${process.env.REACT_APP_B2C_SCOPES}`],
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

      // create formdata, which the controller api expect, and call api to create guests by excel file
      formData.append('file', inputs.value);
      await createGuestsWithFile(formData, tokenCache.accessToken);

      // if create guest request succeeds, then get the newly created guests list
      const respData = await getGuests(tokenCache.accessToken);
      setGuests(respData);
    }
    catch (error) {
      console.error('failed to upload excel', error);
    }
    finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    async function init() {
      const tokenCache = await instance.acquireTokenSilent(silentRequest);
      const respData = await getGuests(tokenCache.accessToken);
      setGuests(respData);
    }

    init();
  }, [instance, silentRequest]);

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
      { loading
        ? (
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Spinner />
          </div>
        )
        : (
          <>
            <Table responsive striped hover>
              <thead>
                <tr>
                  <th>Guest Name</th>
                  <th>RSVP'd?</th>
                  <th>Response Date</th>
                  <th>Group By Value</th>
                </tr>
              </thead>
              <tbody>
                {
                  guests.map((guest, index) => {
                    return (
                      <tr key={guest.guestId}>
                        <td>{guest.name}</td>
                        <td>{guest.hasRsvpd ? 'Yes' : guest.rsvpDate !== null ? 'No' : 'No Response'}</td>
                        <td>{guest?.rsvpDate ? new Date(guest.rsvpDate).toLocaleString('en-US') : null}</td>
                        <td>{guest.groupValue}</td>
                      </tr>
                    );
                  })
                }
                {/* statistics row: Total guests, who responsed, respone value count */}
                <tr>
                  <td><b>Total Guests: {guests.length}</b></td>
                  <td><b>'Yes' Guests: {guests.filter(guest => guest.hasRsvpd === true).length}</b></td>
                  <td><b>'No' Guests: {guests.filter(guest => guest.hasRsvpd === false && guest.rsvpDate !== null).length}</b></td>
                  <td><b>'No Response' Guests: {guests.filter(guest => guest.hasRsvpd === false && guest.rsvpDate === null).length}</b></td>
                </tr>
              </tbody>
            </Table>
          </>
        )
      }
    </>
  );
};

export default GuestForm;