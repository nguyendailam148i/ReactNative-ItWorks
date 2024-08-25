// #region Import
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
    SafeAreaView,
    Text,
    View,
    Image,
    FlatList,
    Modal,
    TouchableWithoutFeedback,
    TouchableOpacity,
    StyleSheet,
    RefreshControl,
    Alert,
} from 'react-native';
import { COLORS } from '../../constants';
import { UIButton, UIIconButton } from '../../components';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { getUser, deleteWorkspaceAPI } from '../../apis/API';
import React, { useState } from 'react';

//#endregion




const HomeScreen = ({ navigation }) => {
    const [userDetails, setUserDetails] = React.useState();
    const [workspaces, setWorkspaces] = React.useState([]);
    const [refreshing, setRefreshing] = React.useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [settingWorkspacesModalVisible, setSettingWorkspacesModalVisible] = useState(false);
    const [selectedWorkspaceId, setSelectedWorkspaceId] = useState(null);


    const openSettingWorkspacesModal = (workspaceId) => {
        setSelectedWorkspaceId(workspaceId);
        setSettingWorkspacesModalVisible(true);
    }
    const closeSettingWorkspacesModal = () => setSettingWorkspacesModalVisible(false);
    //#endregion

    React.useEffect(() => {
        getUserData();
        fetchWorkspaces();
    }, []);
    const getUserData = async () => {
        const userData = await AsyncStorage.getItem('userData');
        if (userData) {
            setUserDetails(JSON.parse(userData));
        }
    };
    const fetchWorkspaces = async () => {
        try {
            const accessToken = await AsyncStorage.getItem('userToken');
            const response = await getUser({
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            // console.log('API Response:', response);
            console.log(
                'API Response: username',
                response.email + ' id' + response._id,
            );

            setWorkspaces(response.workspaces);
        } catch (error) {
            console.log('Full error object:', error);
            // console.error('Error fetching workspaces:', error);
            // Xử lý lỗi cụ thể hơn nếu cần, ví dụ: hiển thị thông báo lỗi cho người dùng
        }
    };
    const onRefresh = React.useCallback(async () => {
        setRefreshing(true);
        try {
            await fetchWorkspaces();
        } catch (error) {
            // console.error('Error refreshing workspaces:', error);
            console.log('Error refreshing workspaces:', error);
        } finally {
            setRefreshing(false);
        }
    }, []);
    const handleDeleteWorkspace = async (workspaceId, workspaceTitle) => {
        try {
            Alert.alert(
                'Xác nhận xóa',
                `Bạn có chắc chắn muốn xóa workspace "${workspaceTitle}" ?`,
                [
                    {
                        text: 'Hủy',
                        style: 'cancel',
                    },
                    {
                        text: 'Xóa',
                        onPress: async () => {
                            try {
                                const response = await deleteWorkspaceAPI({ _id: workspaceId });
                                console.log("response", response)
                                await fetchWorkspaces();
                            } catch (error) {
                                console.error('Lỗi khi xóa workspace:', error);
                            }
                        },
                    },
                ]
            );
        } catch (error) {
            console.error('Lỗi không xác định:', error);
            // Xử lý các lỗi khác có thể xảy ra
        }
    };

    const renderWorkspace = ({ item }) => {
        // Kiểm tra xem userDetails đã được khởi tạo chưa
        const isOwner = userDetails && item.ownerId === userDetails._id;

        // Kiểm tra xem item.managers có phải là một mảng không
        const members = Array.isArray(item.managers) ? item.managers : [];
        const handleIconButtonPress = () => {
            openSettingWorkspacesModal(item._id);
        };
        return (
            <TouchableOpacity
                onPress={() =>
                    navigation.navigate('BroadsScreen', {
                        workspaceId: item._id,
                        boards: item.boards,
                        workspaceTitle: item.title,

                        refreshWorkspaces: fetchWorkspaces,
                    })
                }
                style={{
                    padding: 14,
                    backgroundColor: 'transparent',
                    borderColor: 'red',
                    // borderWidth: 1,
                    borderRadius: 10,
                }}>
                <View
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                    }}>
                    <View style={{ flexDirection: 'row' }}>
                        <Image
                            source={item.avatar ? { uri: item.avatar } : require('../../assets/imgs/background.png')}
                            style={{
                                width: 100,
                                height: 75,
                                borderRadius: 10,
                                borderWidth: 1, borderColor: COLORS.gray,
                                backgroundColor: COLORS.grey
                            }}
                        />
                        <View style={{ marginStart: 20 }}>
                            {/* Titile */}
                            <View
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    paddingBottom: 10,
                                }}>
                                <Text
                                    style={{
                                        fontWeight: 'bold',
                                        fontSize: 20,
                                        color: COLORS.black,
                                    }}>
                                    {item.title}
                                </Text>
                                <Text style={styles.userRole}>
                                    {' '}
                                    ({isOwner ? 'Admin' : 'Member'})
                                </Text>
                            </View>
                            {/* Member */}
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Text
                                    style={[
                                        styles.type,
                                        {
                                            paddingVertical: 2, // Thêm padding vertical để tạo không gian xung quanh text
                                            paddingHorizontal: 1,
                                            textAlign: 'center',
                                            width: 50,
                                            height: 18,
                                            backgroundColor:
                                                item.type === 'Public' ? COLORS.Main : 'red', // Màu nền động
                                            color: item.type === 'Public' ? '#ffff' : 'white', // Màu chữ động
                                        },
                                    ]}>
                                    {item.type}
                                </Text>
                                <View
                                    style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        marginStart: 10,
                                        backgroundColor: COLORS.Main,
                                        borderRadius: 10,
                                        width: 50,
                                    }}>
                                    <Icon
                                        name="supervisor-account"
                                        size={17}
                                        color={COLORS.white}
                                    />
                                    <Text style={styles.memberCount}>
                                        {members.length + (isOwner ? 0 : 1)}
                                    </Text>
                                </View>
                            </View>
                        </View>
                    </View>
                    <UIIconButton
                        iconName="more-vert"
                        iconColor="black"
                        iconSize={25}
                        onPress={() => { openSettingWorkspacesModal(item._id) }}
                    />
                    <SettingWorkspacesModal
                        visible={settingWorkspacesModalVisible && selectedWorkspaceId === item._id}
                        onClose={closeSettingWorkspacesModal}
                        onEdit={() => {
                            // Handle edit action here
                            navigation.navigate('EditWorkspaceScreen', {
                                workspaceId: item._id,
                                workspacesTitle: item.title,
                                workspaceDescription: item.description,
                                workspacesType: item.type,
                                workspacesAvatar: item.avatar,
                                refreshWorkspaces: fetchWorkspaces,
                            })

                            console.log('Edit workspace:', item._id);
                            closeSettingWorkspacesModal();
                        }}
                        onDelete={() => {
                            // Handle delete action here
                            console.log('Delete workspace:', item._id);
                            handleDeleteWorkspace(item._id, item.title)
                            closeSettingWorkspacesModal();
                        }}
                    />
                </View>
            </TouchableOpacity>
        );
    };

    const handleAddPress = () => {
        setModalVisible(true);
    };

    const handleCloseModal = () => {
        setModalVisible(false);
    };
    //#region Modal
    const SettingWorkspacesModal = ({ visible, onClose, onEdit, onDelete }) => {
        return (

            <Modal
                transparent={true}
                visible={visible}
                animationType="slide"
                onPress={() => { onClose }}
            >
                <TouchableWithoutFeedback onPress={onClose}>
                    <View
                        style={{
                            flex: 1,
                            justifyContent: 'center',
                            alignItems: 'center',
                            backgroundColor: 'rgba(0,0,0,0.5)',
                        }}
                    >
                        <View
                            style={{
                                width: 300,
                                padding: 20,
                                backgroundColor: 'white',
                                borderRadius: 10,
                            }}
                        >
                            <Text
                                style={{
                                    fontSize: 18,
                                    marginBottom: 10,
                                }}
                            >
                                Settings
                            </Text>
                            <UIButton
                                title="Edit workspace"
                                onPress={onEdit}
                                iconName={'gear'}
                                borderColor={COLORS.Main}
                                btnColor={COLORS.white}
                                textColor={COLORS.Main}
                                borderRadius={5}
                                height={40}
                                width={'100%'}
                                fontSize={14}
                            />
                            <UIButton
                                title="Delete workspace"
                                onPress={onDelete}
                                iconName={'trash-o'}
                                borderColor={COLORS.Main}
                                btnColor={COLORS.white}
                                textColor={COLORS.Main}
                                borderRadius={5}
                                marginTop={30}
                                height={40}
                                width={'100%'}
                                fontSize={14}
                            />
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        );
    };

    //#endregion

    return (
        <SafeAreaView style={styles.container}>
            <FlatList
                data={workspaces}
                keyExtractor={item => item._id}
                renderItem={renderWorkspace}
                style={{ marginTop: 10 }}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            />
            {/* MODAL */}
            <View style={{ flex: 1 }}>
                {/* MODAL */}
                <Modal
                    animationType="fade"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={handleCloseModal}>
                    <TouchableWithoutFeedback onPress={handleCloseModal}>
                        <View style={styles.modalBackdrop} />
                    </TouchableWithoutFeedback>
                    <View style={styles.modalContent}>
                        {/* Displaying the "X" icon inside the modal */}
                        <TouchableOpacity
                            onPress={() => {
                                console.log('Browse Templates');
                                handleCloseModal();
                            }}
                            style={styles.modalButton}>
                            <Icon name="report" size={20} color="#fff" />
                            <Text style={styles.modalButtonText}>Report</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => {
                                console.log('Create Card');
                                handleCloseModal();
                            }}
                            style={styles.modalButton}>
                            <Icon name="note-add" size={20} color="#fff" />
                            <Text style={styles.modalButtonText}> New Broad</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => {
                                if (userDetails && userDetails._id) {
                                    navigation.navigate('NewWorkspaceScreen', {
                                        ownerId: userDetails._id,
                                        onWorkspaceCreated: fetchWorkspaces, // Truyền hàm fetchWorkspaces làm prop
                                    });
                                    handleCloseModal();
                                } else {
                                    console.log('User details are not yet loaded.');
                                    Alert.alert(
                                        'Error',
                                        'User details are not loaded. Please try again.',
                                    );
                                }
                            }}
                            style={styles.modalButton}>
                            <Icon name="dashboard" size={20} color="#fff" />
                            <Text style={styles.modalButtonText}>New Workspaces</Text>
                        </TouchableOpacity>
                    </View>
                </Modal>

                {/* Floating Button */}
                <TouchableOpacity
                    onPress={handleAddPress}
                    style={styles.floatingButton}>
                    <Icon name={modalVisible ? 'close' : 'add'} size={30} color="#fff" />
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: COLORS.lightWhite,
        paddingHorizontal: 5,
    },
    quickAddText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: COLORS.black,
        marginVertical: 10,
    },
    quickAddContainer: {
        backgroundColor: COLORS.white,
        borderRadius: 10,
        padding: 15,
        marginBottom: 20,
    },
    quickAddContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
    },
    button: {
        backgroundColor: 'green',
        position: 'absolute',
        bottom: 20,
        right: 20,
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalBackdrop: {
        flex: 1,
        zIndex: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        position: 'absolute',
        bottom: 100,
        right: 30,
        alignItems: 'flex-end',
    },
    modalButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#4CAF50',
        paddingVertical: 10,
        paddingHorizontal: 15,
        marginBottom: 10,
        borderRadius: 25,
    },
    modalButtonText: {
        color: '#fff',
        fontSize: 16,
        marginLeft: 10,
    },
    floatingButton: {
        height: 50,
        width: 50,
        backgroundColor: '#4CAF50',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 25,
        position: 'absolute',
        bottom: 20,
        right: 20,
        zIndex: 0,
    },
    type: {
        borderRadius: 10,
        width: 'auto',
        backgroundColor: COLORS.Main,
        color: '#ffff',
        fontSize: 10,
        color: COLORS.gray,
    },
    userRole: {
        fontSize: 14,
        color: COLORS.gray,
        marginTop: 5,
        textAlign: 'center',
    },
    memberCount: {
        fontSize: 13,
        color: COLORS.white,
        marginStart: 10,
    },
});

export default HomeScreen;
