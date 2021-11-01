import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import countryList from 'country-list';
import Button from '../../components/Button';
import styles from './styles';
import {DataStore, Auth, API, qraphqlOperation} from 'aws-amplify';
import {useNavigation, useRoute} from '@react-navigation/native';
import {useStripe} from '@stripe/stripe-react-native';
import {Order, OrderProduct, CartProduct} from '../../models';
import {createPaymentIntent} from '../../graphql/mutations';

const countries = countryList.getData();

const AddressScreen = () => {
  //   console.log('CountryList', countryList.getCodeList());
  const [country, setCountry] = useState(countries[0].code);
  const [fullname, setFullname] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [addressError, setAddessError] = useState('Invalid Address');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [clientSecret, setClientSecret] = useState(null);

  const {initPaymentSheet, presentPaymentSheet} = useStripe();
  const navigation = useNavigation();
  const route = useRoute();
  const amount = Math.floor(route.params?.totalPrice * 100 || 0);

  useEffect(() => {
    fetchPaymentIntent();
  }, []);

  useEffect(() => {
    if (clientSecret) {
      initializePaymentSheet();
    }
  }, [clientSecret]);

  const fetchPaymentIntent = async () => {
    const response = await API.graphql(
      qraphqlOperation(createPaymentIntent, {amount}),
    );
    setClientSecret(response.data.createPaymentIntent.clientSecret);
    console.log(response);
  };

  const initializePaymentSheet = async () => {
    if (!clientSecret) {
      return;
    }
    const {error} = await initPaymentSheet({
      paymentIntentClientSecret: await clientSecret,
      // allowsDelayedPaymentMethods: true,
    });
    if (error) {
      Alert.alert(error);
    }
  };

  const openPaymentSheet = async () => {
    if (!clientSecret) {
      return;
    }
    const {error} = await presentPaymentSheet();

    if (error) {
      Alert.alert(`Error code: ${error.code}`, error.message);
    } else {
      saveOrder();
      Alert.alert('Success', 'Your payment is confirmed!');
    }
  };

  //   console.log('selected country', country);
  console.log('Name', fullname);

  const saveOrder = async () => {
    // get user details
    const userData = await Auth.currentAuthenticatedUser();
    // create a new oreder
    const newOrder = await DataStore.save(
      newOrder({
        userSub: userData.attributes.sub,

        fullName: fullname,
        phoneNumber: phone,
        country,
        city,
        address,
      }),
    );

    // fetch all cart items
    const cartItems = await DataStore.query(CartProduct, cp =>
      cp.userSub('eq', userData.attributes.sub),
    );
    // attach all cart items to the oreder
    await Promise.all(
      cartItems.map(cartItem =>
        DataStore.save(
          new OrderProduct({
            quantity: cartItem.quantity,
            option: cartItem.option,
            productID: cartItem.productID,
            orderID: newOrder.id,
          }),
        ),
      ),
    );
    // delet all cart items
    await Promise.all(cartItems.map(cartItem => DataStore.delete(cartItem)));
    //redirect home
    navigation.navigate('Home');
  };

  const onCheckout = () => {
    if (addressError) {
      Alert.alert('Fix all error before Checkout');
      return;
    }

    if (!fullname) {
      Alert.alert('Please fill the FullName field');
      return;
    }
    if (!phone) {
      Alert.alert('Please fill the Phone Number field');
      return;
    }
    // console.warn('Scuccess CheckOut');
    // saveOrder();
    openPaymentSheet();
  };

  const validateAddress = () => {
    if (address.length < 3) {
      setAddessError('Address is too short');
    }
  };
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 15 : 0}>
      <ScrollView style={styles.root}>
        <View style={styles.row}>
          <Picker selectedValue={country} onValueChange={setCountry}>
            {countries.map((country, index) => (
              <Picker.Item
                key={index}
                value={country.code}
                label={country.name}
              />
            ))}
          </Picker>
        </View>
        {/* Full Name */}
        <View style={styles.row}>
          <Text style={styles.label}> Full Name (First and Last name)</Text>
          <TextInput
            style={styles.input}
            placeholder="Full Name"
            value={fullname}
            onChangeText={setFullname}
          />
        </View>
        {/* Phone Number */}
        <View style={styles.row}>
          <Text style={styles.label}> Phone Number</Text>
          <TextInput
            style={styles.input}
            placeholder="Phone Number"
            value={phone}
            onChangeText={setPhone}
            keyboardType={'number-pad'}
          />
        </View>
        {/* Address */}
        <View style={styles.row}>
          <Text style={styles.label}> Address</Text>
          <TextInput
            style={styles.input}
            placeholder="Address"
            value={address}
            onEndEditing={validateAddress}
            onChangeText={text => {
              setAddress(text);
              setAddessError('');
            }}
          />
          {!!addressError && (
            <Text style={styles.errorLabel}>{addressError}</Text>
          )}
        </View>
        {/* City */}
        <View style={styles.row}>
          <Text style={styles.label}> City</Text>
          <TextInput
            style={styles.input}
            placeholder="City"
            value={city}
            onChangeText={setCity}
          />
        </View>
        {/* State */}
        <View style={styles.row}>
          <Text style={styles.label}> State</Text>
          <TextInput
            style={styles.input}
            placeholder="State"
            value={state}
            onChangeText={setState}
          />
        </View>
        <Button text="CheckOut" onPress={onCheckout} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default AddressScreen;
