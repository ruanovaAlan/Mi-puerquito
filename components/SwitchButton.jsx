import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';

export default function SwitchButton({ optionOne, optionTwo, optionThree, selectedOption, setSelectedOption, isDisabled }) {
  return (
    <View style={styles.container}>
      <Pressable
        onPress={() => !isDisabled && setSelectedOption(1)} 
        style={[
          styles.button,
          selectedOption === 1 && styles.activeButton,
        ]}
      >
        <Text
          style={[
            styles.text,
            selectedOption === 1 ? styles.activeText : styles.inactiveText,
          ]}
        >
          {optionOne}
        </Text>
      </Pressable>
      <Pressable
        onPress={() => !isDisabled && setSelectedOption(2)} 
        style={[
          styles.button,
          selectedOption === 2 && styles.activeButton,
        ]}
      >
        <Text
          style={[
            styles.text,
            selectedOption === 2 ? styles.activeText : styles.inactiveText,
          ]}
        >
          {optionTwo}
        </Text>
      </Pressable>
      {optionThree && (
        <Pressable
          onPress={() => !isDisabled && setSelectedOption(3)} 
          style={[
            styles.button,
            selectedOption === 3 && styles.activeButton,
          ]}
        >
          <Text
            style={[
              styles.text,
              selectedOption === 3 ? styles.activeText : styles.inactiveText,
            ]}
          >
            {optionThree}
          </Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#565661',
    borderRadius: 20,
    padding: 4,
  },
  button: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    borderRadius: 20,
  },
  activeButton: {
    backgroundColor: '#3C3C44',
  },
  text: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  activeText: {
    color: '#FFFFFF',
  },
  inactiveText: {
    color: '#A0A0A5',
  },
});
