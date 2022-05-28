import React from 'react';
import { Typography } from '@mui/material';
import ParkingPicture from '../../assets/parking.png';

const Parking = (
  <div>
    <img src={ParkingPicture} alt="parking-pic" title="parking-pic" width='100%' style={{ objectFit: 'cover' }}
      onClick={() => window.open(ParkingPicture)} />
    <Typography variant='body2' display='block' gutterBottom>
      We recommend to carpool with others. The parking lot directly near the venue is limited, though there is still parking in the lot perpendicular to the plaza.
    </Typography>
  </div>
);

export default Parking;