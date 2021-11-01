import * as React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import ShopingCartScreen from '../screens/ShoppingCartScreen';
import AddressScreen from '../screens/AddressScreen';

const Stack = createStackNavigator();

const ShoppinCartStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        component={ShopingCartScreen}
        name="Cart"
        options={{title: 'Shopping Cart'}}
      />
      <Stack.Screen
        component={AddressScreen}
        name="Address"
        options={{title: 'AddressCart'}}
      />
    </Stack.Navigator>
  );
};

export default ShoppinCartStack;
