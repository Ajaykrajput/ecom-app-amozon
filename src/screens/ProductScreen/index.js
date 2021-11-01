import React, {useState, useEffect} from 'react';
import {View, Text, ScrollView, ActivityIndicator} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import QuantitySelector from '../../components/QuantitySelector/index';
import {useRoute, useNavigation} from '@react-navigation/native';
import {Product, CartProduct} from '../../models/index';
import {DataStore, Auth} from 'aws-amplify';
import Button from '../../components/Button';
import styles from './styles';
// import product from '../../data/product';
import ImageCarousel from '../../components/ImageCarousel';

const ProductScreen = () => {
  const [product, setProduct] = useState(Product[0]);
  const [selectedOption, setSelectedOption] = useState(undefined);
  const [quantity, setQuantity] = useState(1);
  // console.log(selectedOption);
  const navigation = useNavigation();
  const route = useRoute();
  console.log(route.params);

  useEffect(() => {
    if (!route.params.id) {
      return;
    }
    DataStore.query(Product, route.params.id).then(setProduct);
  }, [route.params.id]);

  useEffect(() => {
    if (product?.options) {
      setSelectedOption(product.options[0]);
    }
  }, [product]);

  const onAddToCart = async () => {
    const userData = await Auth.currentAuthenticatedUser();
    console.log('userdata', userData);

    if (!product || !userData) {
      return;
    }

    const newCartProduct = new CartProduct({
      userSub: userData.attributes.sub,
      quantity,
      option: selectedOption,
      productID: product.id,
    });
    DataStore.save(newCartProduct);
    navigation.navigate('ShopingCart');
  };

  if (!product) {
    return <ActivityIndicator />;
  }
  return (
    <ScrollView style={styles.root}>
      <Text style={styles.title}>{product.title}</Text>
      <ImageCarousel images={product.images} />
      <View>
        <Picker
          selectedValue={selectedOption}
          onValueChange={itemValue => setSelectedOption(itemValue)}>
          {product.options.map(option => (
            <Picker.Item label={option} value={option} />
          ))}
        </Picker>
      </View>
      <Text style={styles.price}>
        from $ {product.price.toFixed(2)}
        {product.oldPrice && (
          <Text style={styles.oldPrice}> $ {product.oldPrice.toFixed(2)}</Text>
        )}
      </Text>
      <Text style={styles.description}> $ {product.description}</Text>
      <QuantitySelector quantity={quantity} setQuantity={setQuantity} />
      <Button
        text={'Add to Cart'}
        onPress={onAddToCart}
        containerStyles={{backgroundColor: '#e3c905'}}
      />
      <Button
        text={'Buy Now'}
        onPress={() => {
          console.warn('Buy Now');
        }}
      />
    </ScrollView>
  );
};
export default ProductScreen;
