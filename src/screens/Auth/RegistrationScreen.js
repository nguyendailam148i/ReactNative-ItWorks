import AsyncStorage from '@react-native-async-storage/async-storage';
import React from 'react';
import {
  View,
  Text,
  SafeAreaView,
  Keyboard,
  ScrollView,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { APIRegister } from '../../apis/API';
import { COLORS, FontSize } from '../../constants';
import { UIButton, UIInput, UILoader } from '../../components';

const RegistrationScreen = ({ navigation }) => {
  const [inputs, setInputs] = React.useState({
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = React.useState({});
  const [loading, setLoading] = React.useState(false);

  const validate = () => {
    Keyboard.dismiss();
    let isValid = true;

    if (!inputs.email) {
      handleError('Please input email', 'email');
      isValid = false;
    } else if (!inputs.email.match(/\S+@\S+\.\S+/)) {
      handleError('Please input a valid email', 'email');
      isValid = false;
    }

    if (!inputs.username) {
      handleError('Please input username', 'username');
      isValid = false;
    }

    if (!inputs.password) {
      handleError('Please input password', 'password');
      isValid = false;
    } else if (inputs.password.length < 5) {
      handleError('Min password length of 5', 'password');
      isValid = false;
    }

    if (!inputs.confirmPassword) {
      handleError('Please confirm your password', 'confirmPassword');
      isValid = false;
    } else if (inputs.password !== inputs.confirmPassword) {
      handleError('Passwords do not match', 'confirmPassword');
      isValid = false;
    }

    if (isValid) {
      register();
    }
  };


  const register = async () => {
    setLoading(true);

    try {
      const response = await APIRegister({
        email: inputs.email,
        username: inputs.username,
        password: inputs.password,
      });

      console.log(response);

      if (response && response.success) {
        setLoading(false);
        Alert.alert('Success', 'Registration successful!');
        navigation.navigate('LoginScreen');
      } else {
        setLoading(false);
        Alert.alert('Error', response?.message || 'Registration failed. Please try again.');
      }
    } catch (error) {
      setLoading(false);
      Alert.alert('Error', 'Something went wrong');
      console.error(error);
    }
  };


  const handleOnchange = (text, input) => {
    setInputs(prevState => ({ ...prevState, [input]: text }));
  };
  const handleError = (error, input) => {
    setErrors(prevState => ({ ...prevState, [input]: error }));
  };
  return (
    <SafeAreaView style={{ backgroundColor: COLORS.white, flex: 1 }}>
      <UILoader visible={loading} />
      <ScrollView
        contentContainerStyle={{ paddingTop: 50, paddingHorizontal: 20 }}>
        <View style={{ alignItems: 'center' }}>
          <Text style={{}}>
            <Icon name="trello" size={35} color={COLORS.Main} />{' '}
            <Text
              style={{
                fontWeight: 'bold',
                fontSize: FontSize.h1,
                color: COLORS.Main,
              }}>
              ItWorks
            </Text>
          </Text>
          <Text
            style={{
              color: COLORS.Main,
              fontSize: FontSize.h3,
              fontWeight: 'bold',
            }}>
            Register to continue
          </Text>
        </View>

        <View style={{ marginVertical: 20 }}>
          <UIInput
            onChangeText={text => handleOnchange(text, 'email')}
            onFocus={() => handleError(null, 'email')}
            iconName="email-outline"
            label="Email"
            placeholder="Enter your email address"
            error={errors.email}

          />

          <UIInput
            onChangeText={text => handleOnchange(text, 'username')}
            onFocus={() => handleError(null, 'username')}
            iconName="account-outline"
            label="Full name"
            placeholder="Enter your username"
            error={errors.username}

          />

          <UIInput
            onChangeText={text => handleOnchange(text, 'password')}
            onFocus={() => handleError(null, 'password')}
            iconName="lock-outline"
            label="Password"
            placeholder="Enter your password"
            error={errors.password}
            password

          />

          <UIInput
            onChangeText={text => handleOnchange(text, 'confirmPassword')}
            onFocus={() => handleError(null, 'confirmPassword')}
            iconName="lock-outline"
            label="Confirm password"

            placeholder="Enter your confirm password"
            error={errors.confirmPassword}
            password
          />

          <UIButton
            title="Register"
            onPress={validate}
            marginVer={30}
            borderColor={COLORS.Main}
            btnColor={COLORS.Main}
            textColor="white"
          />

          <Text
            onPress={() => navigation.navigate('LoginScreen')}
            style={{
              color: COLORS.black,
              fontWeight: '500',
              textAlign: 'center',
              fontSize: FontSize.h4,
            }}>
            Already have account ? Login
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default RegistrationScreen;
