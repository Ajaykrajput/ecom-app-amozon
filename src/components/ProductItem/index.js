import React from 'react';
import {View, Text, Image, Pressable} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {useNavigation} from '@react-navigation/native';
import styles from './styles';

const ProductItem = ({item = {}}) => {
  const navigation = useNavigation();
  const {
    id,
    title = 'title',
    image = 'string',
    avgRating = 4,
    ratings = 'string',
    price = 452,
    oldPrice = 2555,
  } = item;
  // console.log('data', item);

  const onPress = () => {
    // console.warn('item pressed');
    navigation.navigate('ProductDetails', {id: item.id});
  };
  return (
    <Pressable onPress={onPress} style={styles.root}>
      <Image
        style={styles.image}
        source={{
          uri: item.image,
        }}
      />
      <View style={styles.rightContainer}>
        <Text style={styles.title} numberOfLines={3}>
          {item.title}
        </Text>
        <View style={styles.ratingsContainer}>
          {[0, 0, 0, 0, 0].map((el, i) => (
            <FontAwesome
              key={`${item.id}-${i}`}
              style={styles.star}
              name={i < Math.floor(item.avgRating) ? 'star' : 'star-o'}
              size={18}
              color={'#e47911'}
            />
          ))}
          <Text>{item.ratings}</Text>
        </View>
        <Text style={styles.price}>
          from $ {item.price.toFixed(2)}
          {item.oldPrice && (
            <Text style={styles.oldprice}> $ {item.oldPrice.toFixed(2)}</Text>
          )}
        </Text>
      </View>
    </Pressable>
  );
};

export default ProductItem;
