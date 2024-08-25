import React from 'react';
import { View, Text, SafeAreaView, Keyboard, Alert } from 'react-native';
import { COLORS, FontSize } from '../../constants';
import { UIButton, UIInput, UILoader } from '../../components';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome';
import { loginApi } from '../../apis/API';

const LoginScreen = ({ navigation }) => {
  const [inputs, setInputs] = React.useState({ email: '', password: '' });
  const [errors, setErrors] = React.useState({});
  const [loading, setLoading] = React.useState(false);

  const validate = () => {
    Keyboard.dismiss();
    let isValid = true;
    if (!inputs.email) {
      handleError('Please input email', 'email');
      isValid = false;
    }
    if (!inputs.password) {
      handleError('Please input password', 'password');
      isValid = false;
    }
    if (isValid) {
      login();
    }
  };

  const login = async () => {
    setLoading(true);
    try {
      const response = await loginApi(inputs);

      if (response && response.accessToken) {
        const userData = {
          ...response.user,
          accessToken: response.accessToken,
        };
        await AsyncStorage.setItem('userData', JSON.stringify(userData));
        await AsyncStorage.setItem('userToken', response.accessToken); // Đảm bảo token được lưu
        navigation.navigate('HomeScreen');
      } else {
        // Xử lý lỗi dựa trên phản hồi API
        if (response.error === 'invalid_credentials') {
          handleError('Invalid email or password', 'email');
        } else {
          Alert.alert('Error', response.message || 'Wrong account or password');
        }
      }
    } catch (error) {
      // console.error('Login API Error:', error);
      Alert.alert('Error', 'Sai tài khoản hoặc mật khẩu');
    } finally {
      setLoading(false);
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
      <View style={{ paddingTop: 50, paddingHorizontal: 20 }}>
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
            iconName="email-outline"
            label="Email"

            placeholder="Enter your email address"
            error={errors.email}
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
          <Text
            onPress={() => navigation.navigate('ForgotScreen')}
            style={{
              color: COLORS.grey,
              fontWeight: '500',
              textAlign: 'right',
              fontSize: FontSize.h5,
            }}>
            Forgot password?
          </Text>
          <UIButton
            title="Log In"
            onPress={validate}
            textColor="white"
            borderColor={COLORS.Main}
            btnColor="#0C66E4"
            marginVer={30}
          />

          <View style={{ justifyContent: 'center', flexDirection: 'column' }}>
            <UIButton
              iconName="facebook"
              title="Facebook"
              btnColor={COLORS.white}
              borderColor={COLORS.Main}
              textColor="#0C66E4"
              marginVer={10}
            />
            <UIButton
              iconName="google"
              title="Google"
              btnColor={COLORS.white}
              borderColor={COLORS.Main}
              textColor="#0C66E4"
            />
          </View>

          <Text
            onPress={() => navigation.navigate('RegistrationScreen')}
            style={{
              marginTop: 50,
              color: COLORS.black,
              fontWeight: '500',
              textAlign: 'center',
              fontSize: 16,
            }}>
            Don't have an account? Register
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default LoginScreen;
