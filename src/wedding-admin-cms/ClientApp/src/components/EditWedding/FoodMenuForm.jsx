import React, { useEffect, useMemo, useState } from 'react';
import { useMsal } from '@azure/msal-react';

import Collapse from '@mui/material/Collapse';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';

import FastfoodIcon from '@mui/icons-material/Fastfood';
import LocalDiningIcon from '@mui/icons-material/LocalDining';

import { getFoodItemsForWedding } from '../../apis/foodItemApi';

const FoodMenuForm = (props) => {
  const [foodItems, setFoodItems] = useState([]);
  const [foodTypes, setFoodTypes] = useState([]);
  const { weddingId } = props;

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
      const foodItems = await getFoodItemsForWedding(weddingId, tokenCache.accessToken);
      const foodTypes = foodItems.map(el => el.foodType).filter((value, index, self) => self.indexOf(value) === index); // gets distinct food types

      console.info('food items and food types', foodItems, foodTypes);

      setFoodItems(foodItems);
      setFoodTypes(foodTypes);
    };

    init();
  }, []);

  return (
    <>
      <Typography variant='subtitle2'>Food Menu</Typography>
      <List dense>
        {foodTypes.map(foodType => (
          <React.Fragment key={foodType}>
            <ListItemButton>
              <ListItemIcon>
                <LocalDiningIcon />
              </ListItemIcon>
              <Typography variant='subtitle1' gutterBottom>{foodType}</Typography>
            </ListItemButton>

            {/* if there are any food items for the food type, create a Collapse component that will
             * list the food items. If not, do not output anything */}
            {foodItems.find(el => el.foodType === foodType)
              ? (
                <Collapse in={true}>
                  <List component="div" dense disablePadding>
                    {foodItems.map(foodItem => {
                      if (foodItem.foodType === foodType)
                        return (
                          <ListItemButton sx={{ pl: 4 }}>
                            <ListItemIcon>
                              <FastfoodIcon />
                            </ListItemIcon>
                            <ListItemText primary={foodItem.food} secondary={foodItem.description} />
                          </ListItemButton>
                        );
                    })}
                  </List>
                </Collapse>
              )
              : <></>}
            <Divider />
          </React.Fragment>
        ))}
      </List>
    </>
  );
};

export default FoodMenuForm;