import { View, Text, StyleSheet, Image, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { UIInput, UIButton, UILoader } from '../../components';
import { COLORS } from '../../constants';
import RNPickerSelect from 'react-native-picker-select';
import { launchImageLibrary } from 'react-native-image-picker';
import { updateWorkspaceAPI, uploadImageAPI } from '../../apis/API';
import { useNavigation, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const EditWorkspaceScreen = () => {
    const route = useRoute();
    const navigation = useNavigation();
    const [token, setToken] = useState(null);

    const [workspaceType, setWorkspaceType] = useState(route.params.workspacesType);
    const [title, setTitle] = useState(route.params.workspacesTitle);
    const [description, setDescription] = useState(route.params.workspaceDescription);
    const [selectedImage, setSelectedImage] = useState(route.params.workspacesAvatar);
    const [imageFile, setImageFile] = React.useState(null); // Đổi tên biến
    const { workspacesAvatar, workspaceId, workspacesTitle, workspaceDescription, workspacesType } = route.params;
    const [loading, setLoading] = React.useState(false);
    useEffect(() => {
        // Lấy token từ AsyncStorage khi màn hình này được load
        const fetchToken = async () => {
            const savedToken = await AsyncStorage.getItem('userToken');
            setToken(savedToken);
        };
        fetchToken();
    }, []);


    const handleChooseFileAvatar = () => {
        launchImageLibrary({ mediaType: 'photo', quality: 1 }, response => {
            if (response.didCancel) {
                console.log('User canceled image picker');
            } else if (response.errorCode) {
                console.log('ImagePicker Error: ', response.errorMessage);
                Alert.alert('Error', 'An error occurred while selecting the image.');
            } else {
                setSelectedImage(response.assets[0].uri);
                setImageFile(response.assets[0]); // Cập nhật biến imageFile
            }
        });
    };
    const updatedWorkspace = async () => {
        // Kiểm tra độ dài tối thiểu của title và description
        // if (title.length < 4 || description.length < 4) {
        //     Alert.alert('Validation Error', 'Title and description must be at least 4 characters long.');
        //     return;
        // }

        setLoading(true);
        try {
            let imageUrl = null;
            if (imageFile) {
                const formData = new FormData();
                formData.append('image', {
                    uri: imageFile.uri,
                    type: imageFile.type,
                    name: imageFile.fileName || 'image.jpg',
                });
                imageUrl = await uploadImageAPI(formData);
                console.log('đây là url của ảnh', imageUrl);
                if (!imageUrl) {
                    throw new Error('Image URL is not returned from API');
                }
            }

            const updatedWorkspace = {
                _id: workspaceId,
                title: title,
                description: description,
                type: workspaceType,
            };
            // nếu có ảnh thêm ảnh vào gửi
            if (imageUrl) {
                updatedWorkspace.avatar = imageUrl;
            }

            const response = await updateWorkspaceAPI(updatedWorkspace);
            if (response) {
                navigation.goBack();
                console.log('Update successfully')
            } else {
                Alert.alert('Error', 'Failed to create workspace.');
            }
        } catch (error) {
            console.error('Error creating workspace:', error.message);
            Alert.alert('Error', `An error occurred: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = () => {
        if (!loading) {
            Alert.alert(
                'Confirm Update',
                'Are you sure you want to update this workspace?',
                [
                    {
                        text: 'Cancel',
                        onPress: () => console.log('Update canceled'),
                        style: 'cancel',
                    },
                    {
                        text: 'OK',
                        onPress: () => {
                            updatedWorkspace(); // Gọi hàm cập nhật khi người dùng xác nhận


                        },
                    },
                ],
                { cancelable: false } // Người dùng phải chọn Cancel hoặc OK, không được tắt bằng cách bấm ra ngoài
            );
        }
    };


    return (
        <SafeAreaView style={{
            flex: 1,
            backgroundColor: 'white',
            paddingHorizontal: 20,
            paddingTop: 30,
        }}>
            <View style={{ flexDirection: 'row', marginBottom: 30 }}>
                <View>
                    <Image
                        source={selectedImage ? { uri: selectedImage } : require('../../assets/imgs/background.png')}
                        style={{
                            width: 150,
                            height: 100,
                            borderRadius: 10,
                            backgroundColor: COLORS.grey
                        }}
                    />
                </View>
                <View style={{ flexDirection: 'column' }}>
                    {/* Cập nhật hiển thị thông tin theo các state */}
                    <View style={{ flexDirection: 'row' }}><Text style={styles.workspacesText} >Tittle:</Text><Text style={styles.workspacesTextValue}>{title}</Text></View>
                    <View style={{ flexDirection: 'row' }}><Text style={styles.workspacesText} >Type:</Text><Text style={styles.workspacesTextValue}>{workspaceType}</Text></View>
                    <View style={{}}><Text style={styles.workspacesText} >Description:</Text><Text style={styles.workspacesTextValue}>{description}</Text></View>
                </View>

            </View>
            <View>
                <UIInput
                    iconName="briefcase-account"
                    label="Workspace title"
                    placeholder={workspacesTitle}
                    value={title}
                    onChangeText={setTitle}
                />
                <UIInput
                    iconName="border-color"
                    label="Description"
                    placeholder={workspaceDescription}
                    value={description}
                    onChangeText={setDescription}
                />
                <Text style={{
                    marginTop: 10,
                    marginBottom: 10,
                    fontSize: 16,
                    color: COLORS.TextPrimary,
                }}>Select Workspace Type:</Text>
                <View style={{
                    borderRadius: 10,
                    borderWidth: 1,
                    borderColor: COLORS.Main,
                    marginBottom: 30,
                }}>
                    <RNPickerSelect
                        onValueChange={(value) => setWorkspaceType(value)}
                        items={[
                            { label: 'Public', value: 'Public' },
                            { label: 'Private', value: 'Private' },
                        ]}
                        placeholder={{ label: "Select TYPE", value: null }}
                        value={workspaceType} // Use the state variable here
                        useNativeAndroidPickerStyle={false}
                    />
                </View>
                <UIButton
                    title="Choose file avatar"
                    onPress={handleChooseFileAvatar}
                    textColor="white"
                    borderColor={COLORS.Main}
                    iconName='photo'
                    btnColor="#0C66E4"
                    marginVer={30}
                />
                <UIButton
                    title="Submit"
                    onPress={handleSubmit}
                    textColor="white"
                    borderColor={COLORS.Main}
                    iconName='check'
                    btnColor="#0C66E4"
                    marginVer={30}
                />
                {loading && <UILoader />}
            </View>
        </SafeAreaView>
    )
}
const styles = StyleSheet.create({
    workspacesText: {
        marginStart: 10,
        flexDirection: 'row',
        fontSize: 14,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        width: 100,
    },
    workspacesTextValue: {
        marginStart: 10,
        fontSize: 16,
        // fontWeight: 'bold',
    },


})
export default EditWorkspaceScreen