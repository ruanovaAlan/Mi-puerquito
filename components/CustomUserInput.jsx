import React, { useState } from 'react';
import { View, Text, Pressable, TextInput, StyleSheet } from 'react-native';

export default function UserInput({ placeholder, value, onChangeText }) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <Pressable
      onPress={() => setIsFocused(true)} 
      style={styles.container}
    >
      <View style={[styles.input, isFocused && styles.inputFocused]}>
        {isFocused ? (
          <TextInput
            value={value}
            autoFocus
            onChangeText={onChangeText}
            style={styles.textInput}
            onBlur={() => setIsFocused(false)} 
            placeholder={placeholder}
            placeholderTextColor="#A9A9A9" 
          />
        ) : (
          <Text style={[styles.text, !value && styles.placeholder]}>
            {value || placeholder}
          </Text>
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '70%',
    marginBottom: 10,
  },
  input: {
    height: 40,
    borderBottomWidth: 1,
    borderColor: '#ccc',
    justifyContent: 'center',
    paddingLeft: 10,
  },
  inputFocused: {
    borderColor: 'blue', 
  },
  text: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  placeholder: {
    color: '#A9A9A9', 
  },
  textInput: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    padding: 0,
    margin: 0,
  },
});
