import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';

export default function SwitchButton({ optionOne, optionTwo, optionThree, selectedOption, setSelectedOption }) {
  return (
    <View style={styles.container}>
      <Pressable
        onPress={() => setSelectedOption(1)}
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
        onPress={() => setSelectedOption(2)}
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
          onPress={() => setSelectedOption(3)}
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
    backgroundColor: '#565661', // Color de fondo del contenedor
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
    backgroundColor: '#3C3C44', // Color del botón activo
  },
  text: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  activeText: {
    color: '#FFFFFF', // Color del texto activo
  },
  inactiveText: {
    color: '#A0A0A5', // Color del texto inactivo
  },
});
