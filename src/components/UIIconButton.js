import React from 'react';
import { TouchableOpacity, Text, View, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
const UIIconButton = ({ iconName, iconColor = "", iconSize = 24, onPress, width, height, borderRadius, borderWidth, marginStart, backgroundColor }) => {
    return (
        <TouchableOpacity onPress={onPress} style={[
            styles.iconButton,
            { width, height, borderRadius, borderWidth, marginStart, backgroundColor }
        ]} >
            <Icon name={iconName} size={iconSize} color={iconColor} />
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    iconButton: {
        borderColor: 'black',
        justifyContent: 'center',
        alignItems: 'center'
    }

});

export default UIIconButton;