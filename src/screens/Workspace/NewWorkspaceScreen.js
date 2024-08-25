import { View, Text, StyleSheet, Image, Alert } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { UIInput, UIButton, UILoader } from '../../components';
import { COLORS } from '../../constants';
import RNPickerSelect from 'react-native-picker-select';
import { launchImageLibrary } from 'react-native-image-picker';
import { createNewWorkspaceAPI, uploadImageAPI } from '../../apis/API'; // Import API

const NewWorkspaceScreen = ({ route, navigation }) => {
    const { ownerId, onWorkspaceCreated } = route.params; // Nhận ownerId từ navigation params
    const [workspaceType, setWorkspaceType] = React.useState('');
    const [title, setTitle] = React.useState('');
    const [description, setDescription] = React.useState('');
    const [selectedImage, setSelectedImage] = React.useState(null);
    const [imageFile, setImageFile] = React.useState(null); // Đổi tên biến
    const [loading, setLoading] = React.useState(false);

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
    const createWorkspace = async () => {
        if (!title || !description || !workspaceType) {
            Alert.alert('Error', 'Please fill in all fields.');
            return;
        }
        setLoading(true);
        try {
            let imageUrl = '';
            if (imageFile) {
                const formData = new FormData();
                formData.append('image', {
                    uri: imageFile.uri,
                    type: imageFile.type,
                    name: imageFile.fileName || 'image.jpg',
                });

                // Sửa đổi để lấy URL chính xác
                imageUrl = await uploadImageAPI(formData);
                console.log('đây là url của ảnh', imageUrl);
                if (!imageUrl) {
                    throw new Error('Image URL is not returned from API');
                }
            }

            const workspaceData = {
                title,
                description,
                type: workspaceType,
                avatar: imageUrl,
                ownerId: ownerId,
            };

            const response = await createNewWorkspaceAPI(workspaceData);

            if (response) {
                Alert.alert('Success', 'Workspace created successfully!');
                navigation.navigate('BroadsScreen', {
                    workspaceId: response.workspaceId,
                    workspaceTitle: title,
                });
                route.params?.onWorkspaceCreated?.();
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
        // Đảm bảo không có vòng lặp khi submit
        if (!loading) {
            createWorkspace();
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <UILoader visible={loading} />
            <View style={styles.innerContainer}>
                <UIInput
                    iconName="briefcase-account"
                    label="Workspace title"
                    placeholder="Enter your workspace title"
                    value={title}
                    onChangeText={setTitle}
                />
                <UIInput
                    iconName="border-color"
                    label="Description"
                    placeholder={description}
                    value={description}
                    onChangeText={setDescription}
                />

                <Text style={styles.label}>Select Workspace Type:</Text>
                <View style={styles.pickerContainer}>
                    <RNPickerSelect
                        onValueChange={(value) => setWorkspaceType(value)}
                        items={[
                            { label: 'Public', value: 'Public' },
                            { label: 'Private', value: 'Private' },
                        ]}
                        placeholder={{ label: "Select TYPE", value: null }}
                        value={workspaceType}
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

                {selectedImage && (
                    <Image source={{ uri: selectedImage }} style={styles.image} />
                )}

                <UIButton
                    title="Create"
                    onPress={handleSubmit}
                    textColor="white"
                    borderColor={COLORS.Main}
                    iconName='photo'
                    btnColor="#0C66E4"
                    marginVer={30}
                />
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    innerContainer: {
        paddingTop: 10,
        paddingHorizontal: 20,
    },
    label: {
        marginTop: 20,
        marginBottom: 10,
        fontSize: 16,
        color: COLORS.TextPrimary,
    },
    pickerContainer: {
        borderRadius: 10,
        borderWidth: 1,
        borderColor: COLORS.Main,
        marginBottom: 30,
    },
    image: {
        width: 100,
        height: 100,
        marginTop: 20,
        borderRadius: 10,
    },
});

export default NewWorkspaceScreen;
