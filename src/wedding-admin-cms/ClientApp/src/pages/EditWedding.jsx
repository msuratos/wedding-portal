import React, { useEffect, useMemo, useState } from 'react';
import {
  Col, Nav, NavItem, NavLink, Row,
  TabContent, TabPane, FormGroup,
  Label, Input, Button, Table
} from 'reactstrap';
import { useMsal } from '@azure/msal-react';
import { addRole, getRoles } from '../apis/roleApi';

const EditWedding = () => {
  const [activeTab, setActiveTab] = useState('1');
  const [bride, setBride] = useState('');
  const [ceremonyDate, setCeremonyDate] = useState(undefined);
  const [groom, setGroom] = useState('');
  const [loading, setLoading] = useState(false);
  const [roles, setRoles] = useState([]);
  const [roleDescription, setRoleDescription] = useState('');
  const [roleName, setRoleName] = useState('');
  const [wedding, setWedding] = useState({});

  const msal = useMsal();
  const { instance, accounts } = msal;

  const silentRequest = useMemo(() => {
    return {
      scopes: ["https://syzmicb2c.onmicrosoft.com/weddingportalapi/user.access"],
      account: accounts[0]
    }
  }, [accounts]);

  const createWedding = async () => {
    setLoading(true);

    const formData = { bride, groom, ceremonyDate };
    const tokenCache = await instance.acquireTokenSilent(silentRequest);
    const response = await fetch('wedding', {
      method: 'POST', body: JSON.stringify(formData),
      headers:
      {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${tokenCache.accessToken}`
      }
    });
    const respData = await response.json();

    setWedding(respData);
    setLoading(false);
  };

  const createRole = async (e) => {
    e.preventDefault();
    const tokenCache = await instance.acquireTokenSilent(silentRequest);
    const newRole = await addRole({ description: roleDescription, name: roleName, token: tokenCache.accessToken });
    setRoles([...roles, newRole]);
  };

  const getWedding = async () => {
    setLoading(true);

    const tokenCache = await instance.acquireTokenSilent(silentRequest);
    const response = await fetch('wedding', {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${tokenCache.accessToken}` }
    });
    const respData = await response.json();

    setWedding(respData);
    setLoading(false);
  };

  // TOOD: put this in a separate file in components folder(?)
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

  useEffect(() => {
    const init = async () => {
      const tokenCache = await instance.acquireTokenSilent(silentRequest);
      const roles = await getRoles(tokenCache.accessToken);
      setRoles(roles);
    };

    init();
  }, [instance, silentRequest]);

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
                    <input type="button" className="btn btn-secondary" value="Get Wedding" onClick={getWedding} />
                  </div>
                  <WeddingTable wedding={wedding} />
                </div>
              )
          }
        </TabPane>
        <TabPane tabId="2">
          <Row style={{ marginTop: '15px' }}>
            <Col sm={12}>
              <form onSubmit={createRole}>
                <FormGroup row>
                  <Label for="name" sm={2}>Role Name</Label>
                  <Col sm={10}>
                    <Input id="name" name="name" placeholder="Name of role" type="text" value={roleName} onChange={e => setRoleName(e.target.value)} />
                  </Col>
                </FormGroup>
                <FormGroup row>
                  <Label for="description" sm={2}>Description</Label>
                  <Col sm={10}>
                    <Input id="description" name="description" placeholder="Describe the role" type="textarea" value={roleDescription}
                      onChange={e => setRoleDescription(e.target.value)} />
                  </Col>
                </FormGroup>
                <Row>
                  <Col sm={6}><Button style={{ width: '100%' }} type='submit' color='primary'>Submit</Button></Col>
                  <Col sm={6}><Button style={{ width: '100%' }} color='secondary'>Cancel</Button></Col>
                </Row>
              </form>
            </Col>
          </Row>
          <Row style={{ marginTop: '15px' }}>
            <Col sm={12}>
              <Table className='table table-striped'>
                <thead>
                  <tr>
                    <th scope="row">#</th>
                    <th scope="row">Name</th>
                    <th scope="row">Description</th>
                  </tr>
                </thead>
                <tbody>
                  {roles.map(el => (
                    <tr key={el.id}>
                      <td>{el.id}</td>
                      <td>{el.name}</td>
                      <td>{el.description}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Col>
          </Row>
        </TabPane>
      </TabContent>
    </div>
  );
};

export default EditWedding;