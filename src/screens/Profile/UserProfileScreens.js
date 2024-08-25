import React from 'react';
import {
    SafeAreaView,
    Text,
    View,
    TouchableOpacity,
    StyleSheet,
    Modal,
    ScrollView,
} from 'react-native';
import { COLORS, FontSize } from '../../constants';
import { UIButton, UIInput, UILoader } from '../../components';

const UserProfileScreens = () => {
    return (
        <SafeAreaView style={{ backgroundColor: COLORS.white, flex: 1 }}>
            <ScrollView
                contentContainerStyle={{ paddingTop: 50, paddingHorizontal: 20, marginTop: -30 }}>
                {/* Header */}
                <View>
                    <View
                        style={{
                            flexDirection: 'row',
                            height: 100,
                            justifyContent: 'space-between',
                            alignItems: 'center',
                        }}>
                        <View
                            style={{
                                borderBlockColor: COLORS.Main,
                                borderWidth: 1,
                                height: 100,
                                width: 100,
                                backgroundColor: COLORS.black,
                                borderRadius: 100,
                            }}></View>
                        <UIButton
                            title="Edit Profile"
                            onPress={{}}
                            iconName={'pencil'}
                            borderColor={COLORS.Main}
                            btnColor={COLORS.white}
                            textColor={COLORS.Main}
                            borderRadius={5}
                            height={40}
                            width={120}
                            fontSize={14}
                        />
                    </View>
                </View>
                {/* Form */}
                <View style={{ marginVertical: 20 }}>
                    <UIInput

                        iconName="account-outline"
                        label="Full name"
                        placeholder="Nguyễn Đại Lâm"
                        editable={false}


                    />
                    <UIInput

                        iconName="email-outline"
                        label="Email"
                        placeholder="dailam.ndl148x@gmail.com"
                        editable={false}

                    />

                    <UIInput

                        iconName="lock-outline"
                        label="Password"
                        placeholder="*********"
                        editable={false}
                    />
                    <UIInput
                        iconName="lock-outline"
                        label="Confirm password"
                        placeholder="Enter your confirm password"
                        editable={false}
                    />
                    <UIButton
                        title="Confirm"
                        iconName={'check'}
                        onPress={{}}
                        marginVer={30}
                        borderColor={COLORS.Main}
                        btnColor={COLORS.Main}
                        textColor="white"
                    />
                    <UIButton
                        title="Delete Account"
                        onPress={{}}
                        iconName={'trash-o'}
                        borderColor={COLORS.Main}
                        btnColor={COLORS.white}
                        textColor={COLORS.Main}
                    />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({

});

export default UserProfileScreens;
