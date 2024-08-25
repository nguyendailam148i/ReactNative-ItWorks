import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, Image, TextInput, FlatList } from 'react-native';
import { useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { COLORS } from '../../constants';
import { UIIconButton } from '../../components';
import { useNavigation } from '@react-navigation/native';
import { CheckBox, Button } from 'react-native-elements';
import { updateTaskCardAPI, addCommentAPI, getUser, getBoardDetailsAPI, updateBoardDetailsAPI } from '../../apis/API';
import { ScrollView } from 'react-native-gesture-handler';
import { Colors } from 'react-native/Libraries/NewAppScreen';



const DetailsCardScreen = () => {
    const route = useRoute();
    const { card, boardId } = route.params;
    const navigation = useNavigation();
    const [modalVisible, setModalVisible] = useState(false);
    const [checkedTasks, setCheckedTasks] = useState(card.tasks.map(task => task.taskStatus)); // Khởi tạo state để lưu trữ trạng thái của tất cả các checkbox
    const [newComment, setNewComment] = useState('');
    const [cardData, setCardData] = useState(card);
    const [userData, setUserData] = useState(null);

    const handleIconPress = () => {
        setModalVisible(true);
    };
    const closeModal = () => {
        setModalVisible(false);
    };

    useEffect(() => {
        if (cardData && cardData.comments) {
            // Cập nhật trạng thái checkedTasks dựa trên cardData mới
            setCheckedTasks(cardData.tasks.map(task => task.taskStatus));
        }

    }, [cardData]);
    const handleTaskUpdate = async (taskIndex, newStatus) => {
        try {
            // Log các giá trị đầu vào để xác nhận
            console.log("Task Name:", card.tasks[taskIndex].taskName);
            console.log("Task Status:", newStatus);
            console.log("Card ID to send:", card._id);

            // Gọi API
            const response = await updateTaskCardAPI({
                cardId: card._id,
                taskName: card.tasks[taskIndex].taskName,
                taskStatus: newStatus,
            });

            // Log toàn bộ response
            console.log('Full response:', response);
            const createdAt = 1724480695466;
            const date = new Date(createdAt);

            console.log(date.toString()); // Hiển thị ngày giờ đầy đủ
            console.log(date.toLocaleString());
            // Cập nhật trạng thái checkbox sau khi thành công
            if (response.message === "Update successfully") {
                const updatedCheckedTasks = [...checkedTasks];
                updatedCheckedTasks[taskIndex] = newStatus;
                setCheckedTasks(updatedCheckedTasks);
            }
        } catch (error) {
            console.error('Error updating task:', error);
        }
    };

    const renderComment = ({ item }) => (
        <View>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 10 }}>
                {/* avatar */}
                <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                    <View>
                        <Image
                            source={{ uri: item.user.avatar || 'https://via.placeholder.com/50' }}
                            style={{
                                width: 20,
                                height: 20,
                                borderRadius: 30,
                                borderWidth: 1,
                                borderColor: 'red',
                                marginHorizontal: 10
                            }}
                        />
                    </View>
                    <View>
                        <Text>{item.user.username}</Text>
                        <Text style={{ fontSize: 10 }}>
                            {/* Format createdAt here if needed */}
                            {new Date(item.createdAt).toLocaleString()}
                        </Text>
                    </View>
                </View>
                <UIIconButton
                    iconName="more-vert"
                    iconColor="black"
                    iconSize={17}
                    onPress={() => { }}
                />
            </View>
            <View style={{ marginStart: 5, marginTop: 10, backgroundColor: COLORS.white }}>
                <Text style={{ padding: 5 }}>{item.content}</Text>
            </View>
        </View>
    );

    const handleSendComment = async () => {
        if (newComment.trim() === '') return;

        if (!userData) {
            console.error('User data is not yet loaded.');
            return;
        }
        try {
            const commentData = {
                cardId: card._id,
                user: {
                    _id: userData._id,
                    email: userData.email,
                    username: userData.username,
                    avatar: userData.avatar
                },
                content: newComment
            };
            const response = await addCommentAPI(commentData);
            // Log toàn bộ phản hồi để xem cấu trúc
            console.log('Full API response:', response);
            const updatedCard = await updateBoardDetailsAPI(boardId);
            // Find the updated card within the board details
            const updatedCardDetails = updatedCard?.columns?.flatMap(column => column.cards).find(c => c._id === card._id);
            console.log(updateTaskCardAPI)
            setCard(updatedCardDetails); // Update the card state
            setNewComment('');
        } catch (error) {
            console.error('Error adding comment:', error);
        }
    };

    return (
        <View style={[styles.container]}>
            {/* Header */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                    <UIIconButton
                        iconName="close"
                        iconColor="red"
                        iconSize={24}
                        onPress={() => {
                            navigation.goBack();
                        }}
                    />
                    <Text style={{ fontSize: 20, fontWeight: 'bold', marginStart: 20 }}>{card.title}</Text>
                </View>
                {/* <Text>Title: {card.title}</Text> */}
                {/* <Text>Description: {card.description}</Text> */}
                <UIIconButton
                    iconName="arrow-drop-own"
                    iconColor="black"
                    iconSize={34}
                    onPress={handleIconPress}
                />

            </View>
            <View>
                {/* container */}
                <View style={{ height: '90%' }}>
                    {/* Joined members */}
                    <View >
                        <View style={{ flexDirection: 'row', marginVertical: 10, alignItems: 'center' }}>
                            <Icon name='people' size={20} color={COLORS.Main} />
                            <Text style={{ fontSize: 16, fontWeight: 'bold', marginStart: 5 }}>Joined members</Text>
                        </View>
                        <View style={{ flexDirection: 'row' }}>
                            {card.members.length > 0 && (
                                <View style={{ flexDirection: 'row' }}>
                                    {card.members.map(member => (
                                        <Image
                                            key={member._id}
                                            source={{ uri: member.avatar || 'https://via.placeholder.com/50' }}
                                            style={{
                                                width: 30,
                                                height: 30,
                                                borderRadius: 30,
                                                borderWidth: 1,
                                                borderColor: 'red',
                                                marginRight: -10, // Add some spacing between avatars
                                            }}
                                        />
                                    ))}
                                </View>
                            )}
                            <UIIconButton
                                iconName="person-add-alt"
                                iconColor="black"
                                iconSize={18}
                                onPress={{}}
                                height={30}
                                width={30}
                                borderRadius={30}
                                borderWidth={1}
                                marginStart={-3}
                                backgroundColor='white'
                            />
                        </View>

                    </View>
                    {/* Description */}
                    <View>
                        <View style={{ flexDirection: 'row', marginVertical: 10, alignItems: 'center' }}>
                            <Icon name='segment' size={20} color={COLORS.Main} />
                            <Text style={{ fontSize: 16, fontWeight: 'bold', marginStart: 5 }}>Description</Text>
                        </View>
                        <Text>{card.description}</Text>
                    </View>
                    {/* Task list */}
                    <View style={{ justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center' }}>
                        <View style={{ flexDirection: 'row', marginVertical: 10, alignItems: 'center' }}>
                            <Icon name='my-library-books' size={20} color={COLORS.Main} />
                            <Text style={{ fontSize: 16, fontWeight: 'bold', marginStart: 5 }}>TASK LIST</Text>
                        </View>
                        {/* modal add list */}
                        <UIIconButton
                            iconName="post-add"
                            iconColor={COLORS.grey}
                            iconSize={20}
                            onPress={{}}
                        />
                    </View>
                    <View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <View>
                                {/* Display all tasks from card.tasks */}
                                {card.tasks.map((task, index) => (
                                    <View key={index} style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <CheckBox
                                            title={task.taskName}
                                            containerStyle={{ borderWidth: 0, backgroundColor: 'transparent' }}

                                            checkedIcon={<Icon name='check-box' size={20} color={COLORS.Main} />}
                                            uncheckedIcon={<Icon name='check-box-outline-blank' size={20} color={COLORS.Main} />}
                                            checked={checkedTasks[index]}
                                            onPress={() => handleTaskUpdate(index, !checkedTasks[index])}
                                        />
                                        {/* You can add more details here like deadline, assigned user, etc. */}
                                        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                            <View>
                                                <Text>15:32 20/08</Text>
                                            </View>
                                            <Image
                                                source={{ uri: 'https://via.placeholder.com/50' }}
                                                style={{
                                                    width: 15,
                                                    height: 15,
                                                    borderRadius: 30,
                                                    borderWidth: 1,
                                                    borderColor: 'red',
                                                    marginHorizontal: 10
                                                }}
                                            />
                                            <UIIconButton
                                                iconName="close"
                                                iconColor="black"
                                                iconSize={17}
                                                onPress={{}}
                                            />
                                        </View>
                                    </View>
                                ))}
                            </View>
                        </View>

                    </View>
                    {/* Comment */}
                    <View style={{ justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center' }}>
                        <View style={{ flexDirection: 'row', marginVertical: 10, alignItems: 'center' }}>
                            <Icon name='comment' size={20} color={COLORS.Main} />
                            <Text style={{ fontSize: 16, fontWeight: 'bold', marginStart: 5 }}>COMMENT</Text>
                        </View>
                    </View>
                    {/* List Comment */}
                    <View style={{ marginHorizontal: 10, flex: 1 }}>
                        <FlatList
                            data={card.comments}
                            renderItem={renderComment}
                            keyExtractor={(item) => item._id}
                        />
                    </View>


                </View>
                {/* input comment */}

                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 30 }}>
                    {/* avatar */}

                    {/* Input */}
                    <View style={{ paddingHorizontal: 10, backgroundColor: COLORS.white, height: 40, borderRadius: 10, justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row', flex: 1, }}>
                        <TextInput
                            style={{ fontSize: 12, flex: 1 }}
                            placeholder="Add new Comment"
                            value={newComment}
                            onChangeText={setNewComment}
                        />
                        <TouchableOpacity onPress={handleSendComment}>
                            <Text>
                                <Icon name="send" size={20} color={COLORS.black} />
                            </Text>
                        </TouchableOpacity>

                    </View>

                </View>

            </View>


            {/* Modal */}
            <Modal
                animationType="none"
                transparent={true}
                visible={modalVisible}
                onRequestClose={closeModal}
            >
                <TouchableOpacity style={styles.overlay} onPress={closeModal}>
                    <View style={styles.modalContent}>
                        {/* Nội dung của modal */}
                        <TouchableOpacity onPress={closeModal} style={styles.option}>
                            <Text style={styles.optionText}>Share card link</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={closeModal} style={styles.option}>
                            <Text style={styles.optionText}>Watch</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={closeModal} style={styles.option}>
                            <Text style={styles.optionText}>Move card</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={closeModal} style={styles.option}>
                            <Text style={styles.optionText}>Copy card</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={closeModal} style={styles.option}>
                            <Text style={styles.optionText}>Archive</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={closeModal} style={styles.option}>
                            <Text style={styles.optionText}>Pin to home screen</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={closeModal} style={styles.option}>
                            <Text style={[styles.optionText, { color: 'red' }]}>Delete</Text>
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    iconButton: {
        position: 'absolute',
        top: 10, // Điều chỉnh để đảm bảo dấu chấm nằm đúng vị trí
        right: 10, // Đặt dấu chấm ở góc phải
    },
    overlay: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'flex-end',
    },
    modalContent: {
        width: 200,
        backgroundColor: 'white',
        borderRadius: 8,
        padding: 8,
        position: 'absolute',
        top: 40, // Khoảng cách từ dấu chấm đến modal (điều chỉnh theo ý bạn)
        right: 20, // Khoảng cách từ mép phải màn hình đến modal
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 5,
    },
    option: {
        padding: 12,
    },
    optionText: {
        fontSize: 16,
    },
});

export default DetailsCardScreen;
