import React, { useEffect, useState } from 'react';

import Card from '@mui/material/Card';
import Collapse from '@mui/material/Collapse';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';

import ListPageLayout from '../components/ListPageLayout';
import { getFoodItems } from '../apis/foodItemApi';

const FoodMenu = () => {
  const [foodItems, setFoodItems] = useState([]);
  const [foodTypes, setFoodTypes] = useState([]);

  useEffect(() => {
    const init = async () => {
      const foodItems = await getFoodItems();
      const foodTypes = foodItems.map(el => el.type).filter((value, index, self) => self.indexOf(value) === index); // gets distinct food types

      setFoodItems(foodItems);
      setFoodTypes(foodTypes);
    };

    init();
  }, []);

  return (
    <ListPageLayout>
      <Typography variant='subtitle1'>Food Menu</Typography>
      <Grid container>
        <Grid item xs={12}>
          {/* show a 'loading' message if no menu exists */}
          {foodTypes.length < 1
            ? <Typography variant='subtitle1' gutterBottom>Still trying out different recipes...</Typography>
            : (
              <List>
                {/* create different sections based on food types, then display a list of food items for each type */}
                {foodTypes.map(foodType => (
                  <Card key={foodType} sx={{mb: '7.5px', mt: '7.5px'}}>
                    <ListItemText sx={{ textAlign: 'center' }}>
                      <Typography variant='h5'>{foodType}</Typography>
                    </ListItemText>
                    {foodItems.find(foodItem => foodItem.type === foodType)
                      ? (
                        <Collapse in={true}>
                          <List component="div" dense disablePadding>
                            {foodItems.map(foodItem => {
                              if (foodItem.type === foodType)
                                return (
                                  <ListItemButton sx={{ pl: 4 }}>
                                    <ListItemText primary={foodItem.food} secondary={foodItem.description} />
                                  </ListItemButton>
                                );
                              else return <></>;
                            })}
                          </List>
                        </Collapse>
                      )
                      : <></>
                    }
                  </Card>
                ))}
              </List>
            )
          }
        </Grid>
      </Grid>
    </ListPageLayout>
  );
};

export default FoodMenu;