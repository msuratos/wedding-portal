import React, { useEffect, useMemo, useState } from 'react';
import {
  Col, Dropdown, DropdownItem, DropdownMenu,
  DropdownToggle, Nav, NavItem, NavLink, Row,
  TabContent, TabPane, FormGroup, UncontrolledAlert,
  Label, Input, Button, Table, Form
} from 'reactstrap';
import { useMsal } from '@azure/msal-react';

import { addEntourage, getWedding } from '../apis/weddingApi';
import MessageForm from '../components/EditWedding/MessageForm';
import RoleForm from '../components/EditWedding/RoleForm';
import WeddingForm from '../components/EditWedding/WeddingForm';

const EditWedding = () => {
  const [activeTab, setActiveTab] = useState('1');
  const [entourage, setEntourage] = useState([]);
  const [entourageName, setEntourageName] = useState('');
  const [entourageRole, setEntourageRole] = useState(0);
  const [openDropdown, setOpenDropdown] = useState(false);
  const [showSuccessAlert, setSuccessShowAlert] = useState(false);
  const [showErrorAlert, setErrorShowAlert] = useState(false);
  const [roles] = useState([]);

  const [wedding, setWedding] = useState({
    ceremonyDate: new Date(), messageToEveryone: '', receptionDate: new Date()
  });

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

  useEffect(() => {
    const init = async () => {
      const tokenCache = await instance.acquireTokenSilent(silentRequest);
      const wedding = await getWedding(tokenCache);
      setWedding(wedding);
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
          <MessageForm wedding={wedding} setErrorShowAlert={setErrorShowAlert} setSuccessShowAlert={setSuccessShowAlert} />
        </TabPane>
        <TabPane tabId="3">
          <RoleForm setErrorShowAlert={setErrorShowAlert} setSuccessShowAlert={setSuccessShowAlert} />
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