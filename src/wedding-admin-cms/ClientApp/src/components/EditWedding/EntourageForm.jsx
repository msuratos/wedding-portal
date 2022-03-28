import React, { useEffect, useMemo, useState } from 'react';
import {
  Button, Col, Dropdown, DropdownItem, DropdownMenu,
  DropdownToggle, Form, FormGroup, Input, Label, Row, Table
} from 'reactstrap';
import { useMsal } from '@azure/msal-react';

import { addEntourage } from '../../apis/weddingApi';
import { getRoles } from '../../apis/roleApi';

const EntourageForm = (props) => {
  const { setErrorShowAlert, setSuccessShowAlert, wedding } = props;

  const [entourage, setEntourage] = useState([]);
  const [entourageName, setEntourageName] = useState('');
  const [entourageRole, setEntourageRole] = useState(0);
  const [openDropdown, setOpenDropdown] = useState(false);
  const [roles, setRoles] = useState([]);

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
      const rolesResp = await getRoles(tokenCache.accessToken);

      setRoles(rolesResp);
    };

    init();
  }, []);

  return (
    <>
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
    </>
  );
};

export default EntourageForm;