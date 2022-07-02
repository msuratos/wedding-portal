import React, { useEffect, useMemo, useState } from 'react';
import { Button, Col, Form, FormGroup, Input, Label } from 'reactstrap';
import { useMsal } from '@azure/msal-react';
import Typography from '@mui/material/Typography';

import WeddingTable from '../WeddingTable';
import { createWedding, updateWedding } from '../../apis/weddingApi';

const WeddingForm = (props) => {
  const { setErrorShowAlert, setSuccessShowAlert, setWedding, wedding } = props;

  const [bride, setBride] = useState('');
  const [ceremony, setCeremony] = useState('');
  const [ceremonyDate, setCeremonyDate] = useState(undefined);
  const [groom, setGroom] = useState('');
  const [lastName, setLastName] = useState('');
  const [loading, setLoading] = useState(false);
  const [passphrase, setPassphrase] = useState('');
  const [pictureUrl, setPictureUrl] = useState('');
  const [reception, setReception] = useState('');
  const [receptionDate, setReceptionDate] = useState(undefined);
  const [title, setTitle] = useState('');
  const [urlSubDomain, setUrlSubDomain] = useState('');
  const [weddingId, setWeddingId] = useState('');

  const msal = useMsal();
  const { instance, accounts } = msal;

  const silentRequest = useMemo(() => {
    return {
      scopes: [`${process.env.REACT_APP_B2C_URL}/${process.env.REACT_APP_B2C_SCOPES}`],
      account: accounts[0]
    }
  }, [accounts]);

  const callCreateWedding = async () => {
    setLoading(true);

    try {
      const formData = {
        bride, groom, lastName, ceremonyLocation: ceremony, ceremonyDate, passphrase,
        receptionLocation: reception, receptionDate, title, urlSubDomain, pictureUrl
      };
      const tokenCache = await instance.acquireTokenSilent(silentRequest);
      const respData = await createWedding(formData, tokenCache);

      setSuccessShowAlert(true);
      setTimeout(() => setSuccessShowAlert(false), 3000);

      setWedding(respData);
      setLoading(false);
    }
    catch (error) {
      console.error(error);
      setErrorShowAlert(true);
      setTimeout(() => setErrorShowAlert(false), 3000);
    }
  };

  const callUpdateWedding = async () => {
    setLoading(true);

    try {
      const tokenCache = await instance.acquireTokenSilent(silentRequest);
      const respData = await updateWedding({
        bride, groom, lastName, ceremonyDate, ceremonyLocation: ceremony, pictureUrl,
        receptionLocation: reception, receptionDate, title, weddingId, urlSubDomain, passphrase
      }, tokenCache);

      setWedding(respData); 
      setLoading(false);

      setSuccessShowAlert(true);
      setTimeout(() => setSuccessShowAlert(false), 3000);
    }
    catch (error) {
      console.error(error);
      setErrorShowAlert(true);
      setTimeout(() => setErrorShowAlert(false), 3000);
    }
  };

  useEffect(() => {
    setBride(wedding.bride);
    setGroom(wedding.groom);
    setLastName(wedding.lastName);
    setCeremonyDate(new Date(wedding.ceremonyDate).toISOString().split('Z')[0]);
    setCeremony(wedding.ceremonyLocation);
    setReceptionDate(new Date(wedding.receptionDate).toISOString().split('Z')[0]);
    setReception(wedding.receptionLocation);
    setPassphrase(wedding.passphrase);
    setPictureUrl(wedding.pictureUrl);
    setTitle(wedding.title);
    setUrlSubDomain(wedding.urlSubDomain);
    setWeddingId(wedding.weddingId);
  }, [wedding]);

  return (
    <div>
      {
        loading
          ? <p><em> Loading...</em></p>
          : (
            <>
              <Typography variant="subtitle2" gutterBottom component="div">
                This tab lists and edits information about your wedding.
              </Typography>
              <Form>
                <FormGroup row>
                  <Label xs={12} sm={2} for="bride">Bride</Label>
                  <Col xs={12} sm={10}>
                    <Input type="text" value={bride} onChange={e => setBride(e.target.value)} />
                  </Col>
                </FormGroup>
                <FormGroup row>
                  <Label xs={12} sm={2} for="groom">Groom</Label>
                  <Col xs={12} sm={10}>
                    <Input type="text" value={groom} onChange={e => setGroom(e.target.value)} />
                  </Col>
                </FormGroup>
                <FormGroup row>
                  <Label xs={12} sm={2} for="lastname">Family Name</Label>
                  <Col xs={12} sm={10}>
                    <Input type="text" value={lastName} onChange={e => setLastName(e.target.value)} />
                  </Col>
                </FormGroup>
                <FormGroup row>
                  <Label xs={12} sm={2} for="ceremony-date">Ceremony Date</Label>
                  <Col xs={12} sm={10}>
                    <Input type="datetime-local" value={ceremonyDate} onChange={e => setCeremonyDate(e.target.value)} />
                  </Col>
                </FormGroup>
                <FormGroup row>
                  <Label xs={12} sm={2} for="ceremony">Ceremony Location</Label>
                  <Col xs={12} sm={10}>
                    <Input type="text" value={ceremony} onChange={e => setCeremony(e.target.value)} />
                  </Col>
                </FormGroup>
                <FormGroup row>
                  <Label xs={12} sm={2} for="reception-date">Reception Date</Label>
                  <Col xs={12} sm={10}>
                    <Input type="datetime-local" value={receptionDate} onChange={e => setReceptionDate(e.target.value)} />
                  </Col>
                </FormGroup>
                <FormGroup row>
                  <Label xs={12} sm={2} for="reception">Reception Location</Label>
                  <Col xs={12} sm={10}>
                    <Input type="text" value={reception} onChange={e => setReception(e.target.value)} />
                  </Col>
                </FormGroup>
                <FormGroup row>
                  <Label xs={12} sm={2} for="title">Title</Label>
                  <Col xs={12} sm={10}>
                    <Input type="text" value={title} onChange={e => setTitle(e.target.value)} />
                  </Col>
                </FormGroup>
                <FormGroup row>
                  <Label xs={12} sm={2} for="picture-url">Picture Url</Label>
                  <Col xs={12} sm={10}>
                    <Input type="text" value={pictureUrl} onChange={e => setPictureUrl(e.target.value)} />
                  </Col>
                </FormGroup>
                <FormGroup row>
                  <Label xs={12} sm={2} for="wedding-url">Wedding Url</Label>
                  <Col xs={12} sm={10}>
                    <Input type="text" value={urlSubDomain} onChange={e => setUrlSubDomain(e.target.value)} />
                  </Col>
                </FormGroup>
                <FormGroup row>
                  <Label xs={12} sm={2} for="passphrase">Passphrase</Label>
                  <Col xs={12} sm={10}>
                    <Input type="password" value={passphrase} onChange={e => setPassphrase(e.target.value)} />
                  </Col>
                </FormGroup>
                <FormGroup row>
                  <Col xs={12} sm={6}>
                    <Button block color="primary" onClick={callCreateWedding}>Create Wedding</Button>
                  </Col>
                  <Col xs={12} sm={6}>
                    <Button block color="secondary" onClick={callUpdateWedding}>Update Wedding</Button>
                  </Col>
                </FormGroup>
              </Form>
              <WeddingTable weddings={[wedding]} />
            </>
          )
      }
    </div>
  );
};

export default WeddingForm;