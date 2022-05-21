import React, { useEffect, useMemo, useState } from 'react';
import { Col, Container, Row, Table } from 'reactstrap';
import { useMsal } from '@azure/msal-react';

import { getSongs } from '../apis/songApi';

// TODO: make it more like a queue
const Song = () => {
  const [songs, setSongs] = useState([]);
  const msal = useMsal();
  const { instance, accounts } = msal;

  const silentRequest = useMemo(() => {
    return {
      scopes: [`${process.env.REACT_APP_B2C_URL}/${process.env.REACT_APP_B2C_SCOPES}`],
      account: accounts[0]
    }
  }, [accounts]);

  useEffect(() => {
    async function getSongRequests() {
      const tokenCache = await instance.acquireTokenSilent(silentRequest);
      const resp = await getSongs(tokenCache.accessToken);

      setSongs(resp);
    }

    getSongRequests();
  }, [instance, silentRequest]);

  return (
    <Container>
      <Row>
        <Col xs={12}>
          <Table responsive hover striped size='sm'>
            <thead>
              <tr>
                <th>Song/Genre Name</th>
                <th>Requested By</th>
                <th>Requested Date</th>
              </tr>
            </thead>
            <tbody>
              {
                songs.map(song => (
                  <tr key={song?.songRequestId}>
                    <td>{song?.songName}</td>
                    <td>{song?.requestedBy}</td>
                    <td>{song?.requestedDate ? new Date(song?.requestedDate).toLocaleString('en-US') : null}</td>
                  </tr>
                ))
              }
            </tbody>
          </Table>
        </Col>
      </Row>
    </Container>
  );
};

export default Song;