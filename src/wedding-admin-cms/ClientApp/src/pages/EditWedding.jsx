import React, { useEffect, useMemo, useState } from 'react';
import {
  Col, Dropdown, DropdownItem, DropdownMenu,
  DropdownToggle, Nav, NavItem, NavLink, Row,
  TabContent, TabPane, FormGroup, UncontrolledAlert,
  Label, Input, Button, Table, Form
} from 'reactstrap';
import { useMsal } from '@azure/msal-react';

import { addRole, getRoles } from '../apis/roleApi';
import { addEntourage, editMessageApi, getWedding } from '../apis/weddingApi';
import WeddingForm from '../components/EditWedding/WeddingForm';

const EditWedding = () => {
  const [activeTab, setActiveTab] = useState('1');
  const [entourage, setEntourage] = useState([]);
  const [entourageName, setEntourageName] = useState('');
  const [entourageRole, setEntourageRole] = useState(0);
  const [messageForEveryone, setMessageForEveryone] = useState('');
  const [openDropdown, setOpenDropdown] = useState(false);
  const [showSuccessAlert, setSuccessShowAlert] = useState(false);
  const [showErrorAlert, setErrorShowAlert] = useState(false);
  const [roles, setRoles] = useState([]);
  const [roleDescription, setRoleDescription] = useState('');
  const [roleName, setRoleName] = useState('');
  const [wedding, setWedding] = useState({ ceremonyDate: new Date(), receptionDate: new Date() });

  const msal = useMsal();
  const { instance, accounts } = msal;

  const silentRequest = useMemo(() => {
    return {
      scopes: ["https://syzmicb2c.onmicrosoft.com/weddingportalapi/user.access"],
      account: accounts[0]
    }
  }, [accounts]);

  const createEntourage = async (e) => {
    e.preventDefault();

    try {
      const tokenCache = await instance.acquireTokenSilent(silentRequest);
      const newEntourage = await addEntourage(
        {
          name: entourageName, roleIdOfEntourage: entourageRole,
          entourageOfWeddingId: wedding.weddingId, token: tokenCache.accessToken
        }
      );

      setSuccessShowAlert(true);
      setTimeout(() => setSuccessShowAlert(false), 3000);

      setEntourage([...entourage, newEntourage]);
    }
    catch (error) {
      console.error(error);
      setErrorShowAlert(true);
      setTimeout(() => setErrorShowAlert(false), 3000);
    }
  };

  const createRole = async (e) => {
    e.preventDefault();

    try {
      const tokenCache = await instance.acquireTokenSilent(silentRequest);
      const newRole = await addRole({ description: roleDescription, name: roleName, token: tokenCache.accessToken });
      setRoles([...roles, newRole]);

      setSuccessShowAlert(true);
      setTimeout(() => setSuccessShowAlert(false), 3000);
    }
    catch (error) {
      console.error(error);
      setErrorShowAlert(true);
      setTimeout(() => setErrorShowAlert(false), 3000);
    }
  };

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
      {showSuccessAlert && <UncontrolledAlert>Success!</UncontrolledAlert>}
      {showErrorAlert && <UncontrolledAlert color='danger'>Failed! Please try again</UncontrolledAlert>}
      <TabContent activeTab={activeTab}>
        <TabPane tabId="1">
          {/* TODO: switch to redux? */}
          <WeddingForm wedding={wedding} setErrorShowAlert={setErrorShowAlert}
            setSuccessShowAlert={setSuccessShowAlert} setWedding={setWedding} />
        </TabPane>
        <TabPane tabId="2">
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