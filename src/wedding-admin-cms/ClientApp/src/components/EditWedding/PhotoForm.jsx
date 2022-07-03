  import React, { useEffect, useCallback, useMemo, useState } from 'react';
import {
  Button, Col, FormGroup,
  Input, Label, Row
} from 'reactstrap';
import { useMsal } from '@azure/msal-react';

const PhotoForm = (props) => {
  const { setErrorShowAlert, setSuccessShowAlert, wedding } = props;
  const [files, setFiles] = useState([]);
  const [fileUrls, setFileUrls] = useState([]);
  const [fileValues, setFileValues] = useState('');
  const [loading, setLoading] = useState(false);
  const msal = useMsal();
  const { instance, accounts } = msal;

  const silentRequest = useMemo(() => {
    return {
      scopes: [`${process.env.REACT_APP_B2C_URL}/${process.env.REACT_APP_B2C_SCOPES}`],
      account: accounts[0]
    }
  }, [accounts]);

  const getPhotos = useCallback(async () => {
    const tokenCache = await instance.acquireTokenSilent(silentRequest);
    const resp = await fetch('/wedding/photos', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${tokenCache.accessToken}`
      }
    });

    if (resp.ok)
      setFileUrls(await resp.json());
    else
      console.error('failed getting photos', await resp.text(), resp.statusText);
  }, [instance, silentRequest]);

  const addPhotos = async (e) => {
    const tokenCache = await instance.acquireTokenSilent(silentRequest);

    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    for (let i = 0; i < files.length; i++)
      data.append("data", files[i]);

    const resp = await fetch(`/Wedding/Photos?weddingId=${wedding.weddingId}&forPage=About Us`, {
      method: 'POST',
      body: data,
      headers: {
        'Authorization': `Bearer ${tokenCache.accessToken}`
      }
    });

    if (resp.ok)
      setSuccessShowAlert(true);
    else
      setErrorShowAlert(false);

    setLoading(false);
    setFiles([]);
    setFileValues('');

    getPhotos();
  };

  useEffect(() => { getPhotos() }, [getPhotos]);

  return (
    <>
      {loading && <div>Loading...</div>} 
      <Row style={{ marginTop: '15px' }}>
        <Col sm={12}>
          <FormGroup row>
            <Label for="photos" sm={2}>Photos</Label>
            <Col sm={10}>
              <Input id="photos" name="photos" placeholder="Add Photos" type="file" multiple value={fileValues}
                onChange={e => {
                  setFiles(e.target.files);
                  setFileValues(e.target.value);
                }} />
            </Col>
          </FormGroup>
          <Row>
            <Col sm={6}><Button block type='submit' color='primary' onClick={addPhotos}>Submit</Button></Col>
            <Col sm={6}><Button block color='secondary'>Cancel</Button></Col>
          </Row>
        </Col>
      </Row>
      <Row style={{ marginTop: '15px' }}>
        <Col sm={12}>
          {/* TODO: switch to using Image List in MUI */}
          {fileUrls.map((val, index) => (
            <div style={{ margin: '5px' }}>
              <img src={val} alt={`file-${index}`} height={500} width={500} style={{ objectFit: 'scale-down' }} />
            </div>
          ))}
        </Col>
      </Row>
    </>
  );
};

export default PhotoForm;