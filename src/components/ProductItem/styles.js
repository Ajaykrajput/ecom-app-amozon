import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    margin: 10,
    borderWidth: 1,
    borderColor: '#d1d1d1',
    borderRadius: 5,
    backgroundColor: '#fff',
    marginVertical: 5,
  },
  rightContainer: {
    padding: 10,
    flex: 3,
  },
  image: {
    height: 150,
    width: 150,
    flex: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  ratingsContainer: {
    flexDirection: 'row',
  },
  star: {
    margin: 2,
  },
  oldprice: {
    fontSize: 12,
    fontWeight: 'normal',
    textDecorationLine: 'line-through',
    paddingHorizontal: 10,
  },
  price: {},
});

export default styles;
