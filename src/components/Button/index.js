import React from 'react';
import {Pressable, Text, StyleSheet} from 'react-native';

const Button = ({text, onPress, containerStyles}) => {
  return (
    <Pressable style={[styles.root, containerStyles]} onPress={onPress}>
      <Text style={styles.text}>{text}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  root: {
    backgroundColor: '#f2953a',
    marginVertical: 10,
    // marginHorizontal: 10,
    height: 35,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#c96d12',
  },
  text: {
    fontSize: 16,
  },
});
export default Button;
