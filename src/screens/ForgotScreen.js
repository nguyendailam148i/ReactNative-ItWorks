import React, { useState } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  Keyboard,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { COLORS, FontSize } from '../constants';
import { UIButton, UIInput } from '../components';
import Icon from 'react-native-vector-icons/FontAwesome';
import { APIForgot } from '../apis/API';

const ForgotScreen = ({ navigation }) => {
  const [inputs, setInputs] = React.useState({
    email: '',
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

    if (isValid) {
      forgotPassword();
    }
  };

  const handleOnchange = (text, input) => {
    setInputs(prevState => ({ ...prevState, [input]: text }));
    handleError(null, input);
  };

  const handleError = (error, input) => {
    setErrors(prevState => ({ ...prevState, [input]: error }));
  };

  const forgotPassword = async () => {
    setLoading(true);
    try {
      const response = await APIForgot({ email: inputs.email });
      console.log(response);
      if (
        response &&
        response.accepted &&
        response.response.startsWith('250')
      ) {
        Alert.alert('Success', 'Password reset link sent to your email');
        setLoading(false);
      } else {
        // Xử lý các trường hợp lỗi khác từ API
        Alert.alert('Error', response?.message || 'Something went wrong');
      }
    } catch (error) {
      // Xử lý lỗi mạng
      if (error.message === 'Network Error') {
        Alert.alert(
          'Error',
          'Network error. Please check your internet connection.',
        );
      } else {
        Alert.alert('Error', 'Something went wrong');
      }
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ backgroundColor: COLORS.white, flex: 1 }}>
      <View style={{ paddingTop: 50, paddingHorizontal: 20 }}>
        {/* ... (Các component khác) */}
        <View style={{ alignItems: 'center' }}>
          <Text>
            <Icon name="trello" size={35} color={COLORS.Main} />{' '}
            <Text
              style={{ fontWeight: 'bold', fontSize: 35, color: COLORS.Main }}>
              ItWorks
            </Text>
          </Text>
          <Text
            style={{
              color: COLORS.Main,
              fontSize: FontSize.h3,
              fontWeight: 'bold',
            }}>
            Log in to continue
          </Text>
        </View>
        <View style={{ marginVertical: 20 }}>
          <UIInput
            onChangeText={text => handleOnchange(text, 'email')}
            onFocus={() => handleError(null, 'email')}
            iconName="lock-outline"
            label="Email"
            placeholder="Enter your email address"
            error={errors.email}
          />

          <UIButton
            title="Forgot password"
            onPress={validate}
            textColor="white"
            borderColor={COLORS.Main}
            btnColor="#0C66E4"
            marginVer={10}
          />

          {loading && <ActivityIndicator size="large" color={COLORS.Main} />}

          <Text
            onPress={() => navigation.navigate('LoginScreen')}
            style={{
              marginTop: 10,
              color: COLORS.black,
              fontWeight: '500',
              textAlign: 'center',
              fontSize: 16,
            }}>
            You have account ? Login
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default ForgotScreen;
