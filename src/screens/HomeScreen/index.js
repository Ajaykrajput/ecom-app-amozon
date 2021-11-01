import React, {useState, useEffect} from 'react';
import {View, StyleSheet, FlatList} from 'react-native';
import ProductItem from '../../components/ProductItem';
import {Product} from '../../models/index';
import {DataStore} from 'aws-amplify';
// import products from '../../data/products';

const HomeScreen = ({searchValue}) => {
  console.log('Product', Product);

  const [products, setProducts] = useState(Product[0]);

  useEffect(() => {
    DataStore.query(Product).then(setProducts);
    // const fetchProducts = async () => {
    //   const results = await DataStore.query(Product);
    //   // console.log('Results', results);
    //   setProducts(results);
    // };
    // fetchProducts();
  }, []);
  // console.log('HomeScreen', searchValue);
  return (
    <View style={styles.container}>
      {/* <ProductItem item={products[2]} /> */}
      <FlatList
        data={products}
        renderItem={({item}) => <ProductItem item={item} />}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default HomeScreen;
