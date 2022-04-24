import React, { useEffect, useMemo, useState } from 'react';
import { Col, Container, Row, Table } from 'reactstrap';
import { useMsal } from '@azure/msal-react';

import { getSongs } from '../apis/songApi';

const Song = () => {
  const [songs, setSongs] = useState([]);
  const msal = useMsal();
  const { instance, accounts } = msal;

  const silentRequest = useMemo(() => {
    return {
      scopes: ["https://syzmicb2c.onmicrosoft.com/weddingportalapi/user.access"],
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
  }, []);

  return (
    <Container>
      <Row>
        <Col xs={12}>
          <Table responsive hover striped size='sm'>
            <thead>
              <tr>
                <th>Song/Genre Name</th>
              </tr>
            </thead>
            <tbody>
              {
                songs.map(song => (
                  <tr key={song?.songRequestId}>
                    <td>{song?.songName}</td>
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