import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { LoginScreen, RegistrationScreen, ForgotScreen, UserProfileScreens, NewWorkspaceScreen, BroadsScreen, DetailsBroadScreen, DetailsCardScreen } from '../screens';
import { UILoader } from '../components';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DrawerNavigator from './DrawerNavigator';

const Stack = createNativeStackNavigator();

const StackNavigator = () => {
    const [initialRouteName, setInitialRouteName] = React.useState(null);

    React.useEffect(() => {
        const checkUser = async () => {
            try {
                let userData = await AsyncStorage.getItem('userData');
                if (userData) {
                    userData = JSON.parse(userData);
                    setInitialRouteName(userData.loggedIn ? 'HomeScreen' : 'LoginScreen');
                } else {
                    setInitialRouteName('LoginScreen');
                }
            } catch (error) {
                console.error('Error checking user data:', error);
                setInitialRouteName('LoginScreen');
            }
        };

        checkUser();
    }, []);

    return (
        <>
            {initialRouteName ? (
                <Stack.Navigator initialRouteName={initialRouteName} screenOptions={{ headerShown: true }}>
                    <Stack.Screen name="LoginScreen" component={LoginScreen} options={{ headerShown: false }} />
                    <Stack.Screen name="RegistrationScreen" component={RegistrationScreen} options={{ headerShown: false }} />
                    <Stack.Screen name="ForgotScreen" component={ForgotScreen} options={{ headerShown: false }} />
                    <Stack.Screen name="UserProfileScreens" component={UserProfileScreens} options={{ title: 'Profile' }} />
                    <Stack.Screen name="NewWorkspaceScreen" component={NewWorkspaceScreen} options={{ title: 'New Workspaces' }} />
                    <Stack.Screen name="BroadsScreen" component={BroadsScreen} options={{ headerShown: true }} />
                    <Stack.Screen name="DetailsBroadScreen" component={DetailsBroadScreen} options={{ headerShown: true }} />
                    <Stack.Screen name="DetailsCardScreen" component={DetailsCardScreen} options={{ headerShown: false }} />
                    <Stack.Screen name="HomeScreen" component={DrawerNavigator} options={{ headerShown: false }} />
                </Stack.Navigator>
            ) : (
                <UILoader visible={true} />
            )}
        </>
    );
};

export default StackNavigator;
