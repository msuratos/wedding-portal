import React, { useEffect, useMemo, useState } from 'react';
import {
  Col, Dropdown, DropdownItem, DropdownMenu,
  DropdownToggle, Nav, NavItem, NavLink, Row,
  TabContent, TabPane, FormGroup,
  Label, Input, Button, Table, Form
} from 'reactstrap';
import { useMsal } from '@azure/msal-react';

import WeddingTable from '../components/WeddingTable';
import { addRole, getRoles } from '../apis/roleApi';
import { addEntourage, createWedding, editMessageApi, getWedding, updateWedding } from '../apis/weddingApi';

const EditWedding = () => {
  const [activeTab, setActiveTab] = useState('1');
  const [bride, setBride] = useState('');
  const [ceremony, setCeremony] = useState('');
  const [ceremonyDate, setCeremonyDate] = useState(undefined);
  const [entourage, setEntourage] = useState([]);
  const [entourageName, setEntourageName] = useState('');
  const [entourageRole, setEntourageRole] = useState(0);
  const [groom, setGroom] = useState('');
  const [lastName, setLastName] = useState('');
  const [loading, setLoading] = useState(false);
  const [messageForEveryone, setMessageForEveryone] = useState('');
  const [openDropdown, setOpenDropdown] = useState(false);
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

    const formData = { bride, groom, lastName, ceremonyLocation: ceremony, ceremonyDate, receptionLocation: reception, receptionDate };
    const tokenCache = await instance.acquireTokenSilent(silentRequest);
    const respData = await createWedding(formData, tokenCache);

    setWedding(respData);
    setLoading(false);
  };

  const createEntourage = async (e) => {
    e.preventDefault();
    const tokenCache = await instance.acquireTokenSilent(silentRequest);
    const newEntourage = await addEntourage(
      {
        name: entourageName, roleIdOfEntourage: entourageRole,
        entourageOfWeddingId: wedding.weddingId, token: tokenCache.accessToken
      }
    );

    setEntourage([...entourage, newEntourage]);
  };

  const createRole = async (e) => {
    e.preventDefault();
    const tokenCache = await instance.acquireTokenSilent(silentRequest);
    const newRole = await addRole({ description: roleDescription, name: roleName, token: tokenCache.accessToken });
    setRoles([...roles, newRole]);
  };

  const callUpdateWedding = async () => {
    setLoading(true);

    const tokenCache = await instance.acquireTokenSilent(silentRequest);
    const respData = await updateWedding({
      bride, groom, lastName, ceremonyDate, ceremonyLocation: ceremony,
      receptionLocation: reception, receptionDate
    }, tokenCache);

    setWedding(respData);
    setLoading(false);
  };

  const editMessage = async (e) => {
    e.preventDefault();
    const tokenCache = await instance.acquireTokenSilent(silentRequest);
    const respData = await editMessageApi({ messageForEveryone, weddingId: wedding.weddingId }, tokenCache.accessToken);
    console.log('message has been updated', respData);
  };

  useEffect(() => {
    const init = async () => {
      const tokenCache = await instance.acquireTokenSilent(silentRequest);

      // call getRoles and getWedding at the same time
      const rolesPromise = getRoles(tokenCache.accessToken);
      const weddingPromise = getWedding(tokenCache);

      // wait for the promises to resolve
      const resp = await Promise.all([rolesPromise, weddingPromise]);
      const wedding = resp[1];

      setWedding(wedding);
      setBride(wedding.bride);
      setGroom(wedding.groom);
      setLastName(wedding.lastName);
      setCeremonyDate(new Date(wedding.ceremonyDate).toISOString().split('Z')[0]);
      setCeremony(wedding.ceremonyLocation);
      setReceptionDate(new Date(wedding.receptionDate).toISOString().split('Z')[0]);
      setReception(wedding.receptionLocation);
      setMessageForEveryone(wedding.messageToEveryone);

      setRoles(resp[0]);
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
          <NavLink active={activeTab === '2'} onClick={() => setActiveTab('2')}>Edit Message</NavLink>
        </NavItem>
        <NavItem>
          <NavLink active={activeTab === '3'} onClick={() => setActiveTab('3')}>Edit Roles</NavLink>
        </NavItem>
        <NavItem>
          <NavLink active={activeTab === '4'} onClick={() => setActiveTab('4')}>Edit Entourage</NavLink>
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
                  <p>This tab lists information about your wedding.</p>
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
                      <Col xs={12} sm={6}>
                        <Button block color="primary" onClick={callCreateWedding}>Create Wedding</Button>
                      </Col>
                      <Col xs={12} sm={6}>
                        <Button block color="secondary" onClick={callUpdateWedding}>Update Wedding</Button>
                      </Col>
                    </FormGroup>
                  </Form>
                  <WeddingTable weddings={[wedding]} />
                </div>
              )
          }
        </TabPane>
        <TabPane tabId="2">
          <Form onSubmit={editMessage}>
            <Row style={{ marginTop: '15px' }}>
              <Col sm={12}>
                <Label for="messageForEveryone" sm={2}>Message for guests</Label>
                <Col sm={10}>
                  <Input id="messageForEveryone" name="messageForEveryone" placeholder="Message..."
                    type="textarea" value={messageForEveryone} onChange={e => setMessageForEveryone(e.target.value)} />
                </Col>
              </Col>
            </Row>
            <Row style={{ marginTop: '15px' }}>
              <Col sm={6}><Button style={{ width: '100%' }} type='submit' color='primary'>Submit</Button></Col>
              <Col sm={6}><Button style={{ width: '100%' }} color='secondary'>Cancel</Button></Col>
            </Row>
          </Form>
        </TabPane>
        <TabPane tabId="3">
          <Row style={{ marginTop: '15px' }}>
            <Col sm={12}>
              <Form onSubmit={createRole}>
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
                  <Col sm={6}><Button block type='submit' color='primary'>Submit</Button></Col>
                  <Col sm={6}><Button block color='secondary'>Cancel</Button></Col>
                </Row>
              </Form>
            </Col>
          </Row>
          <Row style={{ marginTop: '15px' }}>
            <Col sm={12}>
              <Table responsive hover striped>
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
        <TabPane tabId="4">
          <Row style={{ marginTop: '15px' }}>
            <Col sm={12}>
              <Form onSubmit={createEntourage}>
                <FormGroup row>
                  <Label for="name" sm={2}>Entourage Name</Label>
                  <Col sm={10}>
                    <Input id="name" name="name" placeholder="Name of entourage" type="text" value={entourageName} onChange={e => setEntourageName(e.target.value)} />
                  </Col>
                </FormGroup>
                <FormGroup row>
                  <Label for="entourage-role" sm={2}>Entourage Role</Label>
                  <Col sm={10}>
                    <Dropdown toggle={() => setOpenDropdown(!openDropdown)} isOpen={openDropdown}>
                      <DropdownToggle caret outline>
                        {entourageRole !== 0 ? entourageRole : 'Assign a role'}
                      </DropdownToggle>
                      <DropdownMenu>
                        {roles.map((el, i) => {
                          return <DropdownItem key={`role-item-${i}`} onClick={() => setEntourageRole(el.id)}>{el.name}</DropdownItem>
                        })}
                      </DropdownMenu>
                    </Dropdown>
                  </Col>
                </FormGroup>
                <Row>
                  <Col sm={6}><Button style={{ width: '100%' }} type='submit' color='primary'>Submit</Button></Col>
                  <Col sm={6}><Button style={{ width: '100%' }} color='secondary'>Cancel</Button></Col>
                </Row>
              </Form>
            </Col>
          </Row>
          <Row style={{ marginTop: '15px' }}>
            <Col sm={12}>
              <Table className='table table-striped'>
                <thead>
                  <tr>
                    <th scope="row">Name</th>
                    <th scope="row">Role</th>
                  </tr>
                </thead>
                <tbody>
                  {entourage.map(el => (
                    <tr key={el.entourageId}>
                      <td>{el.name}</td>
                      <td>{el.roleIdOfEntourage}</td>
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