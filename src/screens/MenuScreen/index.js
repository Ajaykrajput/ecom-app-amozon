import React from 'react';
import {SafeAreaView} from 'react-native';
import {Auth} from 'aws-amplify';
import Button from '../../components/Button';

const onLogout = () => {
  Auth.signOut();
};

const MenuScreen = () => {
  return (
    <SafeAreaView>
      <Button text="Sign-Out" onPress={onLogout} />
    </SafeAreaView>
  );
};

export default MenuScreen;
