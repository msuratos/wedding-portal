import React, { useEffect, useMemo, useState } from 'react';
import { useMsal } from '@azure/msal-react';

import Button from '@mui/material/Button';
import Collapse from '@mui/material/Collapse';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
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
      {/* Section to add food item */}
      <Typography variant='subtitle2'>Add Food Item</Typography>
      <Grid container spacing={1}>
        <Grid item xs={12} md={6}>
          <TextField id="food-name" label="Food" variant="outlined" fullWidth />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField id="food-type" label="Food Type" variant="outlined" fullWidth select>
            <MenuItem key='Appetizer' value={1}>
              Appetizer
            </MenuItem>
            <MenuItem key='Entree' value={1}>
              Entree
            </MenuItem>
            <MenuItem key='Dessert' value={1}>
              Dessert
            </MenuItem>
          </TextField>
        </Grid>
        <Grid item xs={12}>
          <TextField id="food-desc" label="Description" variant="outlined" multiline fullWidth />
        </Grid>
        <Grid item xs={12}>
          <Button variant="contained">Add Food</Button>
        </Grid>
      </Grid>

      <Divider sx={{ mb: '15px', mt: '15px' }} />

      {/* Section to list all the food items for the selcted wedding */}
      <Typography variant='subtitle2'>Food Item(s)</Typography>
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
                            {/* TODO: put a delete icon button, to delete the selected food item */}
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