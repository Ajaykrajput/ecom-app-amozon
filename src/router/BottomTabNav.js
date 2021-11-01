import * as React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import MenuScreen from '../screens/MenuScreen';
import ShoppinCartStack from '../router/ShoppingCartStack';
// import {color} from 'react-native-reanimated';
import Entypo from 'react-native-vector-icons/Entypo';
import HomeStack from './HomeStack';

const Tab = createBottomTabNavigator();

const BottomTab = () => {
  return (
    <Tab.Navigator
      // tabBarOptions={{
      //   showLabel: false,
      // }}
      screenOptions={{
        tabBarShowLabel: false,
        // tabBarStyle: [
        //   {
        //     display: 'flex',
        //   },
        //   null,
        // ],
        tabBarInactiveTintColor: '#ffbd7d',
        tabBarActiveTintColor: '#e47911',
      }}>
      <Tab.Screen
        component={HomeStack}
        name="Home"
        options={{
          headerShown: false,
          tabBarIcon: ({color}) => (
            <Entypo name="home" color={color} size={24} />
          ),
        }}
      />
      <Tab.Screen
        component={HomeScreen}
        name="Profile"
        options={{
          headerShown: false,
          tabBarIcon: ({color}) => (
            <Entypo name="user" color={color} size={24} />
          ),
        }}
      />
      <Tab.Screen
        component={ShoppinCartStack}
        name="ShopingCart"
        options={{
          headerShown: false,
          tabBarIcon: ({color}) => (
            <Entypo name="shopping-cart" color={color} size={24} />
          ),
        }}
      />
      <Tab.Screen
        component={MenuScreen}
        name="more"
        options={{
          headerShown: false,
          tabBarIcon: ({color}) => (
            <Entypo name="menu" color={color} size={24} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomTab;
