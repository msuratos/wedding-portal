import React, { useEffect, useMemo, useState } from 'react';
import { Button, Col, Form, Input, Label, Row } from 'reactstrap';
import { useMsal } from '@azure/msal-react';

import { editMessageApi } from '../../apis/weddingApi';

const MessageForm = (props) => {
  const { setErrorShowAlert, setSuccessShowAlert, wedding } = props;
  const [messageForEveryone, setMessageForEveryone] = useState('');

  const msal = useMsal();
  const { instance, accounts } = msal;

  const silentRequest = useMemo(() => {
    return {
      scopes: [`${process.env.REACT_APP_B2C_URL}/${process.env.REACT_APP_B2C_SCOPES}`],
      account: accounts[0]
    }
  }, [accounts]);

  const editMessage = async (e) => {
    e.preventDefault();
    try {
      const tokenCache = await instance.acquireTokenSilent(silentRequest);
      const respData = await editMessageApi({ messageForEveryone, weddingId: wedding.weddingId }, tokenCache.accessToken);
      console.log('message has been updated', respData);
      setSuccessShowAlert(true);
      setTimeout(() => setSuccessShowAlert(false), 3000);
    }
    catch (error) {
      console.log(error);
      setErrorShowAlert(true);
      setTimeout(() => setErrorShowAlert(false), 3000);
    }
  };

  useEffect(() => { setMessageForEveryone(wedding.messageToEveryone); }, [wedding]);

  return (
    <Form onSubmit={editMessage}>
      <Row style={{ marginTop: '15px' }}>
        <Col sm={12}>
          <Label for="messageForEveryone" sm={2}>Message for guests</Label>
          <Col sm={10}>
            <Input id="messageForEveryone" name="messageForEveryone" placeholder="Message..." rows={15}
              type="textarea" value={messageForEveryone} onChange={e => setMessageForEveryone(e.target.value)} />
          </Col>
        </Col>
      </Row>
      <Row style={{ marginTop: '15px' }}>
        <Col sm={6}><Button style={{ width: '100%' }} type='submit' color='primary'>Submit</Button></Col>
        <Col sm={6}><Button style={{ width: '100%' }} color='secondary'>Cancel</Button></Col>
      </Row>
    </Form>
  );
};

export default MessageForm;