import React, { useState } from 'react';
import { Col, Row } from 'reactstrap';

const FetchData = () => {
  const [loading, setLoading] = useState(false);
  const [wedding, setWedding] = useState({});
  const [bride, setBride] = useState('');
  const [groom, setGroom] = useState('');
  const [ceremonyDate, setCeremonyDate] = useState(undefined);

  const createWedding = async () => {
    setLoading(true);

    const formData = { bride, groom, ceremonyDate };
    console.log('form data', formData);

    const response = await fetch('wedding', { method: 'POST', body: JSON.stringify(formData), headers: { 'Content-Type': 'application/json' } });
    const respData = await response.json();
    console.log(respData);

    setWedding(respData);
    setLoading(false);
  };

  const WeddingTable = ({ wedding }) => {
    return (
      <table className='table table-striped' aria-labelledby="tabelLabel">
        <thead>
          <tr>
            <th>Wedding Id</th>
            <th>Date</th>
            <th>Bride</th>
            <th>Groom</th>
          </tr>
        </thead>
        <tbody>
          <tr key={wedding?.weddingId}>
            <td>{wedding?.weddingId}</td>
            <td>{wedding?.ceremonyDate ? new Date(wedding.ceremonyDate).toLocaleString('en-US') : null}</td>
            <td>{wedding?.bride}</td>
            <td>{wedding?.groom}</td>
          </tr>
        </tbody>
      </table>
    );
  };

  return (
    <>
      {
        loading
          ? <p><em>Loading...</em></p>
          : (
            <div>
              <h1 id="tabelLabel">Wedding</h1>
              <p>This component demonstrates fetching data from the server.</p>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <Row>
                  <Col md={2}><label htmlFor="bride">Bride</label></Col>
                  <Col md={10}><input type="text" id="bride" value={bride} onChange={e => setBride(e.target.value)} /></Col>
                </Row>
                <Row>
                  <Col md={2}><label htmlFor="groom">Groom</label></Col>
                  <Col md={10}><input type="text" id="groom" value={groom} onChange={e => setGroom(e.target.value)} /></Col>
                </Row>
                <Row>
                  <Col md={2}><label htmlFor="date">Cremony Date</label></Col>
                  <Col md={10}><input type="datetime-local" id="date" value={ceremonyDate} onChange={e => setCeremonyDate(e.target.value)} /></Col>
                </Row>
              </div>
              <div style={{ display: 'flex', flexDirection: 'row', marginBottom: '15px' }}>
                <input type="submit" className="btn btn-primary" value="Create Wedding" onClick={createWedding} />
                <input type="button" className="btn btn-secondary" value="Get Wedding" />
              </div>
              <WeddingTable wedding={wedding} />
            </div>
          )
      }
    </>
  );
};

export default FetchData;