import React, { useEffect, useMemo, useState } from 'react';
import {
  Button, Col, Form, FormGroup,
  Input, Label, Row, Table
} from 'reactstrap';
import { useMsal } from '@azure/msal-react';

import { addRole, getRoles } from '../../apis/roleApi';

const RoleForm = (props) => {
  const { setErrorShowAlert, setSuccessShowAlert } = props;

  const [roleDescription, setRoleDescription] = useState('');
  const [roleName, setRoleName] = useState('');
  const [roles, setRoles] = useState([]);

  const msal = useMsal();
  const { instance, accounts } = msal;

  const silentRequest = useMemo(() => {
    return {
      scopes: ["https://syzmicb2c.onmicrosoft.com/weddingportalapi/user.access"],
      account: accounts[0]
    }
  }, [accounts]);

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

  useEffect(() => {
    const init = async () => {
      const tokenCache = await instance.acquireTokenSilent(silentRequest);
      const rolesResp = await getRoles(tokenCache.accessToken);
      setRoles(rolesResp);
    }

    init();
  }, []);

  return (
    <>
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
    </>
  );
};

export default RoleForm;