import React, {useState} from 'react';
import {View, Text, Image} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import QuantitySelector from '../QuantitySelector/index';
import styles from './styles';
import {CartProduct} from '../../models/index';
import {DataStore} from 'aws-amplify';

const CartProductItem = ({Cartitem = {}}) => {
  // console.log('data', Cartitem);

  const {id, quantity, option, product, ...cartProduct} = Cartitem;
  // const [quantities, setQuantities] = useState(quantity);
  // console.log('item', Cartitem.item);

  const updateQuantity = async newQuantity => {
    const original = await DataStore.query(CartProduct, cartProduct.id);
    await DataStore.save(
      CartProduct.copyOf(original, updated => {
        updated.title = newQuantity;
      }),
    );
  };

  return (
    <View style={styles.root}>
      <View style={styles.row}>
        <Image
          style={styles.image}
          source={{
            uri: product.image,
          }}
        />
        <View style={styles.rightContainer}>
          <Text style={styles.title} numberOfLines={3}>
            {product.title}
          </Text>
          <View style={styles.ratingsContainer}>
            {[0, 0, 0, 0, 0].map((el, i) => (
              <FontAwesome
                key={`${id}-${i}`}
                style={styles.star}
                name={i < Math.floor(product.avgRating) ? 'star' : 'star-o'}
                size={18}
                color={'#e47911'}
              />
            ))}
            <Text>{product.ratings}</Text>
          </View>
          <Text style={styles.price}>
            from $ {product.price}
            {product.oldPrice && (
              <Text style={styles.oldprice}> $ {product.oldPrice}</Text>
            )}
          </Text>
        </View>
      </View>
      <View style={styles.quantityContainer}>
        <QuantitySelector quantity={quantity} setQuantity={updateQuantity} />
      </View>
    </View>
  );
};

export default CartProductItem;
