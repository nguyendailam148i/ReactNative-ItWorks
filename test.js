import React, { useState, useRef } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Platform, ProgressBarAndroid, ProgressViewIOS } from 'react-native';
import CheckBox from '@react-native-community/checkbox'; // Import CheckBox từ gói mới

const TestComponent = () => {
    const [showOptions, setShowOptions] = useState(false);
    const optionsRef = useRef(null);

    const [checked, setChecked] = useState(new Array(10).fill(false)); // 5 checkboxes, initially unchecked
    const [progress, setProgress] = useState(0);

    const handlePressOutside = (event) => {
        if (optionsRef.current && !optionsRef.current.contains(event.target)) {
            setShowOptions(false);
        }
    };

    const toggleCheckbox = (index) => {
        const updatedChecked = [...checked];
        updatedChecked[index] = !updatedChecked[index];
        setChecked(updatedChecked);

        // Calculate progress based on checked checkboxes
        const completedTasks = updatedChecked.filter(Boolean).length;
        const newProgress = completedTasks / 5 * 100;
        setProgress(newProgress);
    };

    const getProgressColor = () => {
        if (progress >= 100) return 'green';
        if (progress >= 50) return 'yellow';
        if (progress >= 30) return 'red';
        return 'gray'; // Default color
    };

    return (
        <View style={styles.container} onStartShouldSetResponder={() => true} onResponderRelease={handlePressOutside}>
            {/* Nội dung khác của bạn */}

            <View style={styles.row}>
                {/* Checkboxes */}
                <View style={styles.checkboxContainer}>
                    {checked.map((value, index) => (
                        <View key={index} style={styles.checkboxRow}>
                            <CheckBox
                                value={value}
                                onValueChange={() => toggleCheckbox(index)}
                            />
                            <Text style={styles.checkboxLabel}>Task {index + 1}</Text>
                        </View>
                    ))}
                </View>

                {/* Progress Bar */}
                {Platform.OS === 'android' ? (
                    <ProgressBarAndroid
                        styleAttr="Horizontal"
                        indeterminate={false}
                        progress={progress / 100}
                        color={getProgressColor()}
                        style={styles.progressBar}
                    />
                ) : (
                    <ProgressViewIOS
                        progress={progress / 100}
                        progressTintColor={getProgressColor()}
                        style={styles.progressBar}
                    />
                )}
                <Text style={styles.progressText}>{progress}% Completed</Text>
            </View>

            <TouchableOpacity onPress={() => setShowOptions(!showOptions)}>
                <Text style={styles.icon}>...</Text>
            </TouchableOpacity>

            {showOptions && (
                <View style={styles.optionsContainer} ref={optionsRef}>
                    <TouchableOpacity style={styles.optionButton}>
                        <Text style={styles.optionText}>Edit</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.optionButton}>
                        <Text style={styles.optionText}>Delete</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    row: {
        flexDirection: 'column',
        alignItems: 'center',
        marginBottom: 20,
    },
    checkboxContainer: {
        flexDirection: 'column',
        alignItems: 'flex-start',
    },
    checkboxRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 5,
    },
    checkboxLabel: {
        marginLeft: 8,
    },
    progressBar: {
        width: '100%',
        height: 10,
        marginVertical: 10,
    },
    progressText: {
        fontSize: 16,
        marginTop: 5,
    },
    icon: {
        fontSize: 24,
    },
    optionsContainer: {
        position: 'absolute',
        right: 10,
        top: 40,
        backgroundColor: 'white',
        borderRadius: 5,
        elevation: 5,
        shadowColor: 'black',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
    },
    optionButton: {
        padding: 10,
    },
    optionText: {
        fontSize: 16,
    },
});

export default TestComponent;
