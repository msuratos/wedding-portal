import React, { useState } from 'react';
import {
  Col, Nav, NavItem, NavLink, Row,
  TabContent, TabPane, Form, FormGroup,
  Label, Input, Button, Card, CardBody, Table
} from 'reactstrap';

const FetchData = () => {
  const [activeTab, setActiveTab] = useState('1');
  const [bride, setBride] = useState('');
  const [ceremonyDate, setCeremonyDate] = useState(undefined);
  const [groom, setGroom] = useState('');
  const [loading, setLoading] = useState(false);
  const [roles, setRoles] = useState([]);
  const [wedding, setWedding] = useState({});

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
    <div>
      <Nav tabs>
        <NavItem>
          <NavLink active={activeTab === '1'} onClick={() => setActiveTab('1')}>Edit Wedding</NavLink>
        </NavItem>
        <NavItem>
          <NavLink active={activeTab === '2'} onClick={() => setActiveTab('2')}>Edit Roles</NavLink>
        </NavItem>
      </Nav>
      <TabContent activeTab={activeTab}>
        <TabPane tabId="1">
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
        </TabPane>
        <TabPane tabId="2">
          <Card>
            <CardBody>
              <Row>
                <Col sm={12}>
                  <Form>
                    <FormGroup row>
                      <Label for="role-name" sm={2}>Role Name</Label>
                      <Col sm={10}>
                        <Input id="role-name" name="name" placeholder="Name of role" type="text" />
                      </Col>
                    </FormGroup>
                    <FormGroup row>
                      <Label for="role-desc" sm={2}>Description</Label>
                      <Col sm={10}>
                        <Input id="role-desc" name="description" placeholder="Describe the role" type="textarea" />
                      </Col>
                    </FormGroup>
                    <Row>
                      <Col sm={6}><Button style={{ width: '100%' }} type='submit' color='primary'>Submit</Button></Col>
                      <Col sm={6}><Button style={{ width: '100%' }} color='secondary'>Cancel</Button></Col>
                    </Row>
                  </Form>
                </Col>
              </Row>
              <Row style={{marginTop: '15px'}}>
                <Col sm={12}>
                  <Table className='table table-striped'>
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Name</th>
                        <th>Description</th>
                      </tr>
                    </thead>
                    <tbody>
                      {roles.map(el => (
                        <tr key={el.id}>
                          <td scope="row">{el.name}</td>
                          <td scope="row">{el.description}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </Col>
              </Row>
            </CardBody>
          </Card>
        </TabPane>
      </TabContent>
    </div>
  );
};

export default FetchData;