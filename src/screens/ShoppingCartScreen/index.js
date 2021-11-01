import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import CartProductItem from '../../components/CartProductItem';
import {useNavigation} from '@react-navigation/native';
import {Product, CartProduct} from '../../models/index';
import {DataStore, Auth} from 'aws-amplify';
import Button from '../../components/Button';

const ShoppingCartScreen = () => {
  const [cartProducts, setCartProducts] = useState(CartProduct[0]);
  const navigation = useNavigation();

  const fetchCartProducts = async () => {
    const userData = await Auth.currentAuthenticatedUser();
    DataStore.query(CartProduct, cp =>
      cp.userSub('eq', userData.attributes.sub),
    ).then(setCartProducts);
  };
  useEffect(() => {
    fetchCartProducts();
  }, []);

  useEffect(() => {
    if (cartProducts.filter(cp => !cp.product).length === 0) {
      return;
    }
    const fetchProducts = async () => {
      // query all products that are used in cart
      const products = await Promise.all(
        cartProducts.map(cartProduct =>
          DataStore.query(Product, cartProduct.product.ID),
        ),
      );
      setCartProducts(currentCartproducts =>
        currentCartproducts.map(cartProduct => ({
          ...cartProduct,
          product: products.find(p => p.id === cartProduct.productID),
        })),
      );
    };
    fetchProducts();
  }, [cartProducts]);

  useEffect(() => {
    const subscription = DataStore.observe(CartProduct).subscribe(msg =>
      fetchCartProducts(),
    );
    return subscription.unsubscribe;
  }, []);

  useEffect(() => {
    const subscriptions = cartProducts.map(cp =>
      DataStore.observe(CartProduct).subscribe(msg => {
        if (msg.opType === 'UPDATE') {
          setCartProducts(curCartProducts =>
            curCartProducts.map(cp => {
              if (cp.id !== msg.element.id) {
                console.log('different id');
                return cp;
              }
              return {
                ...cp,
                ...msg.element,
              };
            }),
          );
        }
        console.log(msg.model, msg.opType, msg.element);
      }),
    );
    return () => {
      subscriptions.forEach(sub => sub.unsubscribe());
    };
  }, [cartProducts]);

  const totalPrice = cartProducts.reduce(
    (summedPrice, product) =>
      summedPrice + (product.product.price || 0) * product.quantity,
    0,
  );
  const onCheckOut = () => {
    navigation.navigate('Address', {totalPrice});
  };

  // console.log('cartproduts', cartproducts);

  if (cartProducts.filter(cp => !cp.product).length !== 0) {
    return <ActivityIndicator />;
  }
  return (
    <View style={styles.page}>
      {/* <ProductItem item={products[2]} /> */}

      <FlatList
        data={cartProducts}
        renderItem={items => {
          //   console.log('dataitem', items.item);
          return <CartProductItem Cartitem={items.item} />;
        }}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={() => (
          <View>
            <Text style={{fontSize: 18}}>
              SubTotal ({cartProducts.length} items):{' '}
              <Text style={{color: '#e47911', fontWeight: 'bold'}}>
                ${totalPrice.toFixed(2)}
              </Text>
            </Text>
            <Button
              text="Proceed to Checkout"
              onPress={onCheckOut}
              containerStyles={{
                backgroundColor: '#f7e300',
                borderColor: '#c7b702',
              }}
            />
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  page: {
    flex: 1,
    // padding: 10,
  },
});

export default ShoppingCartScreen;
