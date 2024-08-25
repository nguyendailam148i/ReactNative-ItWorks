import React from 'react';
import { TouchableOpacity, Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import COLORS from '../constants/index';
import { Colors } from 'react-native/Libraries/NewAppScreen';

const UIButton = ({
  title,
  onPress = () => { },
  iconName,
  textColor,
  marginVer,
  marginTop,
  btnColor,
  height = 55,
  width = '100%',
  borderColor,
  borderRadius = 10,
  borderWidth = 2,
  fontSize,

}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={{
        height: height,
        width: width,
        backgroundColor: btnColor,
        marginVertical: marginVer,
        marginTop: marginTop,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: borderWidth, // Độ dày của viền
        borderColor: borderColor, // Màu sắc của viền
        borderRadius: borderRadius, // Bo tròn góc (tùy chọn)
      }}>
      <Icon
        name={iconName}
        size={20}
        color={textColor}
        style={{ marginRight: 10 }}
      />
      <Text style={{ color: textColor, fontWeight: 'bold', fontSize: fontSize }}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

export default UIButton;
