import React from 'react';
import {
    SafeAreaView,
    Text,
    View,
    TouchableOpacity,
    StyleSheet,
    Modal,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { COLORS } from '../constants';
import { UIButton } from '../components';

const UserProfileScreens = () => {
    const [modalVisible, setModalVisible] = React.useState(false);

    const toggleModal = () => {
        setModalVisible(!modalVisible);
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Icon to open modal */}
            <TouchableOpacity onPress={toggleModal} style={styles.iconContainer}>
                <Icon name="settings" size={24} color={COLORS.black} />
                <Text style={styles.iconText}>Open Modal</Text>
            </TouchableOpacity>

            {/* Modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={toggleModal}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalView}>
                        <Text style={styles.modalTitle}>Visibility</Text>

                        <TouchableOpacity style={styles.modalOption}>
                            <Icon name="lock" size={20} color="black" />
                            <Text style={styles.modalOptionText}>Private</Text>
                            <Text style={styles.modalDescription}>
                                The board is private. Only people added to the board can view and edit it.
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.modalOption}>
                            <Icon name="group" size={20} color="black" />
                            <Text style={styles.modalOptionText}>Workspace</Text>
                            <Text style={styles.modalDescription}>
                                Anyone at your workspace can see this board.
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.modalOption}>
                            <Icon name="public" size={20} color="black" />
                            <Text style={styles.modalOptionText}>Public</Text>
                            <Text style={styles.modalDescription}>
                                The board is public. It's visible to anyone with the link and will show up in search engines like Google. Only people added to the board can edit it.
                            </Text>
                        </TouchableOpacity>

                        <UIButton
                            title="Save"
                            onPress={toggleModal}
                            height={40}
                            textColor="white"
                            borderColor={COLORS.Main}
                            btnColor="#0C66E4"
                            borderRadius={5}
                            marginTop={17}
                        />
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    iconContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconText: {
        marginLeft: 10,
        fontSize: 18,
        fontWeight: 'bold',
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalView: {
        width: '80%',
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    modalOption: {
        width: '100%',
        padding: 10,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
    },
    modalOptionText: {
        fontSize: 16,
        marginLeft: 10,
    },
    modalDescription: {
        fontSize: 12,
        color: '#666',
        marginTop: 5,
    },
});

export default UserProfileScreens;
