import React, { useEffect, useMemo, useState } from 'react';
import { useMsal } from '@azure/msal-react';

import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';

import { getWedding } from '../apis/weddingApi';
import EntourageForm from '../components/EditWedding/EntourageForm';
import FoodMenuForm from '../components/EditWedding/FoodMenuForm';
import GuestForm from '../components/EditWedding/GuestForm';
import MessageForm from '../components/EditWedding/MessageForm';
import PhotoForm from '../components/EditWedding/PhotoForm';
import RoleForm from '../components/EditWedding/RoleForm';
import ScheduleForm from '../components/EditWedding/ScheduleForm';
import TriviaForm from '../components/EditWedding/TriviaForm';
import WeddingForm from '../components/EditWedding/WeddingForm';

// custom component to show a certain panel when a certain tab is active
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

// helper function to help create id and aria-controls props for Tab component
function a11yProps(index) {
  return {
    id: `vertical-tab-${index}`,
    'aria-controls': `vertical-tabpanel-${index}`,
  };
}

const EditWedding = () => {
  const [activeTab, setActiveTab] = useState(1);
  
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

  const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
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
      {/* TODO: possibly only make the first tab active until a valid wedding exists */}
      <Box sx={{ width: '100%' }}>
        {showSuccessAlert && <Alert severity='success'>Success!</Alert>}
        {showErrorAlert && <Alert severity='error'>Failed! Please try again</Alert>}
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          aria-label="Edit Wedding Table"
          textColor="primary"
        >
          <Tab value={1} label="Edit Wedding" {...a11yProps(1)} />
          <Tab value={2} label="Edit Message" {...a11yProps(2)} />
          <Tab value={3} label="Edit Guest" {...a11yProps(3)} />
          <Tab value={4} label="Edit Entourage" {...a11yProps(4)} />
          <Tab value={5} label="Edit Photos" {...a11yProps(5)} />
          <Tab value={6} label="Edit Schedule" {...a11yProps(6)} />
          <Tab value={7} label="Edit Food Menu" {...a11yProps(7)} />
          <Tab value={8} label="Edit Trivia" {...a11yProps(8)} />
          <Tab value={9} label="Edit Roles" {...a11yProps(9)} />
        </Tabs>
        <Divider />
        <TabPanel value={activeTab} index={1}>
          {/* TODO: switch to redux? */}
          <WeddingForm wedding={wedding} setErrorShowAlert={setErrorShowAlert}
          setSuccessShowAlert={setSuccessShowAlert} setWedding={setWedding} />
        </TabPanel>
        <TabPanel value={activeTab} index={2}>
          <MessageForm wedding={wedding} setErrorShowAlert={setErrorShowAlert} setSuccessShowAlert={setSuccessShowAlert} />
        </TabPanel>
        <TabPanel value={activeTab} index={3}>
          <GuestForm />
        </TabPanel>
        <TabPanel value={activeTab} index={4}>
          <EntourageForm wedding={wedding} setErrorShowAlert={setErrorShowAlert} setSuccessShowAlert={setSuccessShowAlert} />
        </TabPanel>
        <TabPanel value={activeTab} index={5}>
          <PhotoForm wedding={wedding} setErrorShowAlert={setErrorShowAlert} setSuccessShowAlert={setSuccessShowAlert} />
        </TabPanel>
        <TabPanel value={activeTab} index={6}>
          <ScheduleForm weddingId={wedding.weddingId} setErrorShowAlert={setErrorShowAlert} setSuccessShowAlert={setSuccessShowAlert} />
        </TabPanel>
        <TabPanel value={activeTab} index={7}>
          <FoodMenuForm weddingId={wedding.weddingId} setErrorShowAlert={setErrorShowAlert} setSuccessShowAlert={setSuccessShowAlert} />
        </TabPanel>
        <TabPanel value={activeTab} index={8}>
          <TriviaForm weddingId={wedding.weddingId} setErrorShowAlert={setErrorShowAlert} setSuccessShowAlert={setSuccessShowAlert} />
        </TabPanel>
        <TabPanel value={activeTab} index={9}>
          <RoleForm setErrorShowAlert={setErrorShowAlert} setSuccessShowAlert={setSuccessShowAlert} />
        </TabPanel>
      </Box>
    </div>
  );
};

export default EditWedding;