import React from 'react';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import { View, Text, Image, Alert } from 'react-native';
import { COLORS } from '../constants';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { HomeScreen, RegistrationScreen, UserProfileScreens } from '../screens';
import { SafeAreaView } from 'react-native-safe-area-context';

const Drawer = createDrawerNavigator();

function CustomDrawerContent(props) {
    const handleLogout = async () => {
        Alert.alert(
            'Log out',
            'Are you sure you want to log out?',
            [
                { text: 'No', style: 'cancel' },
                {
                    text: 'Yes',
                    onPress: async () => {
                        try {
                            await AsyncStorage.removeItem('userData');
                            await AsyncStorage.removeItem('userToken');
                            props.navigation.navigate('LoginScreen');
                        } catch (error) {
                            console.error('Error logging out:', error);
                        }
                    },
                },
            ],
            { cancelable: false },
        );
    };

    const [userData, setUserData] = React.useState(null);

    React.useEffect(() => {
        const getUserData = async () => {
            try {
                const storedData = await AsyncStorage.getItem('userData');
                if (storedData) {
                    setUserData(JSON.parse(storedData));
                }
            } catch (error) {
                console.error('Error getting user data:', error);
            }
        };

        getUserData();
    }, []);

    return (
        <DrawerContentScrollView {...props}>
            <View
                style={{
                    flex: 1,
                    marginTop: -10,
                    padding: 20,
                    alignItems: 'flex-start',
                    backgroundColor: COLORS.Main,
                }}>
                {userData && userData.avatar ? (
                    <Image
                        source={{ uri: userData.avatar }}
                        style={{ width: 80, height: 80, borderRadius: 50, marginBottom: 10 }}
                    />
                ) : null}
                <Text style={{ fontWeight: 'bold', fontSize: 15, color: COLORS.white }}>
                    Welcome, {userData?.username || 'Guest'}!
                </Text>
                <Text style={{ fontWeight: '300', color: COLORS.white }}>
                    <Text style={{ fontWeight: 'bold' }}>Email:</Text> {userData?.email || 'Email'}
                </Text>
            </View>

            <DrawerItem
                label={() => (
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Icon name="trello" size={20} color="#0C66E4" style={{ marginRight: 0 }} />
                        <Text style={{ fontWeight: 'bold', fontSize: 16, marginStart: 20, color: COLORS.Main }}>
                            Broads
                        </Text>
                    </View>
                )}
                onPress={() => props.navigation.navigate('Home')}
            />

            <DrawerItem
                label={() => (
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Icon name="family-tree" size={20} color="#000" style={{ marginRight: 0 }} />
                        <Text style={{ fontWeight: '400', fontSize: 16, marginStart: 20, color: COLORS.black }}>
                            My Workspaces
                        </Text>
                    </View>
                )}
                onPress={() => props.navigation.navigate('RegistrationScreen')}
            />

            <DrawerItem
                label={() => (
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Icon name="card-bulleted-outline" size={20} color="#000" style={{ marginRight: 10 }} />
                        <Text style={{ fontWeight: '400', fontSize: 16, marginStart: 20, color: COLORS.black }}>
                            Profile
                        </Text>
                    </View>
                )}
                onPress={() => props.navigation.navigate('UserProfileScreens')} // Thay đổi theo nhu cầu
            />

            <DrawerItem
                label={() => (
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Icon name="logout-variant" size={20} color="#000" style={{ marginRight: 10 }} />
                        <Text style={{ fontWeight: '400', fontSize: 16, marginStart: 20, color: COLORS.black }}>
                            Log out
                        </Text>
                    </View>
                )}
                onPress={handleLogout}
            />
        </DrawerContentScrollView>
    );
}

const DrawerNavigator = () => {
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <Drawer.Navigator
                initialRouteName="Home"
                screenOptions={{
                    drawerLabelStyle: { fontWeight: 'bold' },
                    headerTitle: 'Workspaces',
                    headerStyle: { backgroundColor: COLORS.Main },
                    headerTintColor: COLORS.white,
                }}
                drawerContent={props => <CustomDrawerContent {...props} />}>
                <Drawer.Screen name="Home" component={HomeScreen} />
                {/* Uncomment if needed */}
                {/* <Drawer.Screen name="Profile" component={UserProfileScreens} /> */}
            </Drawer.Navigator>
        </SafeAreaView>
    );
};

export default DrawerNavigator;
