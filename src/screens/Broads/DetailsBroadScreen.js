import { View, Text, FlatList, TextInput, TouchableOpacity } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../../constants';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useRoute, useNavigation, useFocusEffect } from '@react-navigation/native'; // Import useNavigation
import { useEffect, useState, useCallback } from 'react';
import { fetchBoardDetailsAPI } from '../../apis/API';


const DetailsBroadScreen = () => {
    const route = useRoute();
    const navigation = useNavigation(); // Get the navigation object
    const { boardId } = route.params;
    const [boardDetails, setBoardDetails] = useState(null);
    const [loading, setLoading] = useState(true);


    const handleIconPress = (column) => {
        console.log('Icon pressed for column:', column);
    };
    const fetchBoardData = async () => {
        try {
            const response = await fetchBoardDetailsAPI(boardId);
            setBoardDetails(response);
        } catch (error) {
            console.error('Error fetching board details:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBoardData();
    }, [boardId]);
    // Refetch dữ liệu khi màn hình được focus
    useFocusEffect(
        useCallback(() => {
            fetchBoardData();
        }, [])
    );

    const renderColumn = ({ item: column }) => (
        <View key={column._id}>
            <View
                style={{
                    marginStart: 15,
                    marginVertical: 20,
                    borderRadius: 10,
                    width: 250,
                    padding: 10,
                    height: 'auto',
                    backgroundColor: COLORS.grey,
                }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{column.title}</Text>
                    <View>
                        <TouchableOpacity onPress={() => handleIconPress(column)}>
                            <Text>
                                <Icon name="more-vert" size={20} color={COLORS.black} />
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <View>
                    <FlatList
                        data={column.cards}
                        renderItem={({ item: card }) => (
                            <TouchableOpacity
                                onPress={() =>
                                    navigation.navigate('DetailsCardScreen', {
                                        card: card,
                                        boardId: boardId,
                                        // Pass the card's ID
                                    })
                                }
                            >
                                <View
                                    key={card._id}
                                    style={{
                                        paddingHorizontal: 10,
                                        marginTop: 5,
                                        backgroundColor: COLORS.white,
                                        height: 32,
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        flexDirection: 'row',
                                        borderRadius: 8,
                                    }}>
                                    <Text style={{ fontSize: 12, color: COLORS.black }}>
                                        {card.title}
                                    </Text>
                                    <View
                                        style={{
                                            backgroundColor:
                                                card.status === 'Good'
                                                    ? 'green'
                                                    : card.status === 'Over time'
                                                        ? 'red'
                                                        : 'yellow',
                                            padding: 3,
                                            borderRadius: 5,
                                        }}>
                                        <Text
                                            style={{
                                                fontSize: 11,
                                                fontWeight: 'bold',
                                                color: COLORS.white,
                                            }}>
                                            {card.status}
                                        </Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        )}
                        keyExtractor={card => card._id}
                        contentContainerStyle={{ paddingBottom: 10 }}
                    />
                    {/* Input */}
                    <View style={{ paddingHorizontal: 10, backgroundColor: COLORS.white, height: 33, borderRadius: 10, justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row' }}>
                        <TextInput
                            style={{ fontSize: 12, flex: 1 }}
                            placeholder="Add new card"
                            value={{}}
                            onChangeText={{}}
                        />
                        <TouchableOpacity onPress={() => handleIconPress(column)}>
                            <Text>
                                <Icon name="add-circle-outline" size={20} color={COLORS.black} />
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
            <View style={{}}></View>
        </View>
    );

    if (loading) {
        return <Text>Loading...</Text>;
    }
    if (!boardDetails) {
        return <Text>Board not found</Text>;
    }

    return (
        <SafeAreaView style={{ backgroundColor: COLORS.blue, flex: 1 }}>
            <FlatList
                data={boardDetails.columns}
                renderItem={renderColumn}
                keyExtractor={column => column._id}
                horizontal={true}
                ListFooterComponent={() => (
                    <View
                        style={{
                            margin: 20,
                            borderRadius: 10,
                            width: 200,
                            padding: 10,
                            backgroundColor: COLORS.grey,
                        }}>
                        {/* Input */}
                        <View style={{ paddingHorizontal: 10, backgroundColor: COLORS.white, height: 33, borderRadius: 10, justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row' }}>
                            <TextInput
                                style={{ fontSize: 12, flex: 1 }}
                                placeholder="Add new colum"
                                value={{}}
                                onChangeText={{}}
                            />
                            <TouchableOpacity onPress={() => handleIconPress(column)}>
                                <Text>
                                    <Icon name="add-circle-outline" size={20} color={COLORS.black} />
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
            />
        </SafeAreaView>
    );
};

export default DetailsBroadScreen;