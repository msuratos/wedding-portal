import React, { useEffect, useMemo, useState } from 'react';
import {
  Col, Nav, NavItem, NavLink, Row,
  TabContent, TabPane, FormGroup,
  Label, Input, Button, Table
} from 'reactstrap';
import { useMsal } from '@azure/msal-react';

import WeddingTable from '../components/WeddingTable';
import { addRole, getRoles } from '../apis/roleApi';
import { createWedding, getWedding } from '../apis/weddingApi';

const EditWedding = () => {
  const [activeTab, setActiveTab] = useState('1');
  const [bride, setBride] = useState('');
  const [ceremony, setCeremony] = useState('');
  const [ceremonyDate, setCeremonyDate] = useState(undefined);
  const [groom, setGroom] = useState('');
  const [loading, setLoading] = useState(false);
  const [reception, setReception] = useState('');
  const [receptionDate, setReceptionDate] = useState(undefined);
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

  const callCreateWedding = async () => {
    setLoading(true);

    const formData = { bride, groom, ceremonyLocation: ceremony, ceremonyDate, receptionLocation: reception, receptionDate };
    const tokenCache = await instance.acquireTokenSilent(silentRequest);
    const respData = await createWedding(formData, tokenCache);

    setWedding(respData);
    setLoading(false);
  };

  const createRole = async (e) => {
    e.preventDefault();
    const tokenCache = await instance.acquireTokenSilent(silentRequest);
    const newRole = await addRole({ description: roleDescription, name: roleName, token: tokenCache.accessToken });
    setRoles([...roles, newRole]);
  };

  const callGetWedding = async () => {
    setLoading(true);

    const tokenCache = await instance.acquireTokenSilent(silentRequest);
    const respData = await getWedding(tokenCache);

    setWedding(respData);
    setLoading(false);
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
                      <Col md={2}><label htmlFor="ceremony-date">Cremony Date</label></Col>
                      <Col md={10}><input type="datetime-local" id="ceremony-date" value={ceremonyDate} onChange={e => setCeremonyDate(e.target.value)} /></Col>
                    </Row>
                    <Row>
                      <Col md={2}><label htmlFor="ceremony">Cremony Location</label></Col>
                      <Col md={10}><input id="ceremony" value={ceremony} onChange={e => setCeremony(e.target.value)} /></Col>
                    </Row>
                    <Row>
                      <Col md={2}><label htmlFor="reception-date">Reception Date</label></Col>
                      <Col md={10}><input type="datetime-local" id="reception-date" value={receptionDate} onChange={e => setReceptionDate(e.target.value)} /></Col>
                    </Row>
                  <Row>
                      <Col md={2}><label htmlFor="reception">Reception Location</label></Col>
                      <Col md={10}><input id="reception" value={reception} onChange={e => setReception(e.target.value)} /></Col>
                    </Row>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'row', marginBottom: '15px' }}>
                    <input type="submit" className="btn btn-primary" value="Create Wedding" onClick={callCreateWedding} />
                    <input type="button" className="btn btn-secondary" value="Get Wedding" onClick={callGetWedding} />
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