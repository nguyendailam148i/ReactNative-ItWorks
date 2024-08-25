import React from 'react';
import { View, Text, FlatList, StyleSheet, Image, RefreshControl, SafeAreaView, TouchableOpacity, } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { COLORS } from '../../constants';
import { getUser } from '../../apis/API';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const BroadsScreen = () => {
    const route = useRoute();
    const { workspaceId } = route.params; // Lấy ID của workspace từ params
    const [boards, setBoards] = React.useState([]);
    const [refreshing, setRefreshing] = React.useState(false);
    const navigation = useNavigation();
    const { workspaceTitle } = route.params;

    React.useEffect(() => {
        fetchBoards();
        navigation.setOptions({
            title: workspaceTitle,
        });
    }, [workspaceTitle, navigation, fetchBoards]);

    const fetchBoards = async () => {
        try {
            const accessToken = await AsyncStorage.getItem('userToken');
            const response = await getUser({
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            console.log('API Response: ok ');

            if (response && response.workspaces) {
                // Lọc boards theo workspaceId
                const currentWorkspace = response.workspaces.find(workspace => workspace._id === workspaceId);
                if (currentWorkspace && currentWorkspace.boards) {
                    setBoards(currentWorkspace.boards);
                } else {
                    console.log('No boards data received');
                }
            }
        } catch (error) {
            console.log('Error fetching workspaces:', error);
        }
    };
    const onRefresh = React.useCallback(async () => {
        setRefreshing(true);
        try {
            await fetchBoards();
        } catch (error) {
            console.log('Error refreshing', error);
        } finally {
            setRefreshing(false);
        }
    }, [workspaceId]);

    const renderBroads = ({ item }) => (
        <TouchableOpacity
            onPress={() =>
                navigation.navigate('DetailsBroadScreen', {
                    boardId: item._id,
                    columnOrderIds: item.columnOrderIds
                })}
            style={{

                padding: 14,
                backgroundColor: 'transparent',
                borderColor: 'red',
                // borderWidth: 1,
                borderRadius: 10,
            }}
        >
            <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
            }}>
                <Image
                    source={{ uri: item.avatar || 'https://via.placeholder.com/50' }}
                    style={{
                        width: 100,
                        height: 65,
                        borderRadius: 10,
                        backgroundColor: COLORS.blue
                    }}
                />
                <Text style={styles.boardTitle}>{item.title}</Text>
                <Text>{item.description}</Text>
            </View>
        </TouchableOpacity>
    );


    return (
        <SafeAreaView style={{ backgroundColor: COLORS.gray1, flex: 1 }}>
            <View style={styles.container}>
                <Text style={styles.title}>Boards in Workspace</Text>
                <FlatList
                    data={boards}
                    keyExtractor={item => item._id}
                    renderItem={renderBroads}
                    style={{ marginTop: 10 }}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                    }
                />
            </View >
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.lightWhite,
        padding: 10,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    boardItem: {
        padding: 10,
        backgroundColor: COLORS.white,
        borderRadius: 5,
        marginVertical: 5,
    },
    boardImage: {
        width: 60,
        height: 60,
        borderRadius: 10,
    },
    boardTitle: {
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default BroadsScreen;
