import React, { useEffect, useMemo, useState } from 'react';
import {
  Nav, NavItem, NavLink,
  TabContent, TabPane, UncontrolledAlert
} from 'reactstrap';
import { useMsal } from '@azure/msal-react';

import { getWedding } from '../apis/weddingApi';
import MessageForm from '../components/EditWedding/MessageForm';
import RoleForm from '../components/EditWedding/RoleForm';
import WeddingForm from '../components/EditWedding/WeddingForm';
import EntourageForm from '../components/EditWedding/EntourageForm';
import GuestForm from '../components/EditWedding/GuestForm';
import PhotoForm from '../components/EditWedding/PhotoForm';

const EditWedding = () => {
  const [activeTab, setActiveTab] = useState('1');
  
  const [showSuccessAlert, setSuccessShowAlert] = useState(false);
  const [showErrorAlert, setErrorShowAlert] = useState(false);

  const [wedding, setWedding] = useState({
    ceremonyDate: new Date(), messageToEveryone: '', receptionDate: new Date()
  });

  const msal = useMsal();
  const { instance, accounts } = msal;

  const silentRequest = useMemo(() => {
    return {
      scopes: [`${process.env.REACT_APP_B2C_URL}/${process.env.REACT_APP_B2C_SCOPES}`],
      account: accounts[0]
    }
  }, [accounts]);

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
      {/* TODO: possibly only make the first tab active until a valid wedding exists */}
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
        <NavItem>
          <NavLink active={activeTab === '5'} onClick={() => setActiveTab('5')}>Edit Guest</NavLink>
        </NavItem>
        <NavItem>
          <NavLink active={activeTab === '6'} onClick={() => setActiveTab('6')}>Edit Photos</NavLink>
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
          <EntourageForm wedding={wedding} setErrorShowAlert={setErrorShowAlert} setSuccessShowAlert={setSuccessShowAlert} />
        </TabPane>
        <TabPane tabId="5">
          <GuestForm />
        </TabPane>
        <TabPane tabId="6">
          <PhotoForm wedding={wedding} setErrorShowAlert={setErrorShowAlert} setSuccessShowAlert={setSuccessShowAlert} />
        </TabPane>
      </TabContent>
    </div>
  );
};

export default EditWedding;