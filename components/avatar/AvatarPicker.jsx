import { View, Text, TouchableOpacity, Image } from 'react-native';
import React, { useState } from 'react';
import CustomModal from '../CustomModal';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function AvatarPicker({ setUri }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [imageUri, setImageUri] = useState(null);

  const takePhoto = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        alert('Se requieren permisos para acceder a la cámara.');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        cameraType: ImagePicker.CameraType.front,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.cancelled) {
        saveImage(result.assets[0].uri);
      }
    } catch (error) {
      alert('Error al tomar la foto.');
    } finally {
      setModalVisible(false);
    }
  };

  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        alert('Se requieren permisos para acceder a la galería.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],

        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.cancelled) {
        saveImage(result.assets[0].uri);
      }
    } catch (error) {
      alert('Error al seleccionar la imagen.');
    } finally {
      setModalVisible(false);
    }
  };

  const saveImage = async (imageUri) => {
    await AsyncStorage.setItem('avatar', imageUri);
    setImageUri(imageUri);
    setUri(imageUri);
  };

  const deleteImage = async () => {
    await AsyncStorage.removeItem('avatar');
    setImageUri(null);
    setUri(null);
  };

  return (
    <View>
      <View className="flex flex-row justify-center items-center ">
        {imageUri ? (
          <TouchableOpacity onPress={() => setModalVisible(true)}>
            <Image
              source={{ uri: imageUri }}
              style={{ width: 100, height: 100, borderRadius: 50 }}
            />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={() => setModalVisible(true)}>
            <View>
              <View className="w-24 h-24 rounded-full bg-gray-700 justify-center items-center ">
                <FontAwesome name="user" size={60} color="white" />
              </View>
              <View className='absolute bottom-0 right-[0] '>
                <FontAwesome name="plus-circle" size={30} color="#FFD046" />
              </View>
            </View>
          </TouchableOpacity>

        )}
      </View>


      <CustomModal isOpen={modalVisible} setIsOpen={setModalVisible} title="Avatar">
        <View className="flex flex-row justify-around mt-10 mb-3">
          <TouchableOpacity onPress={takePhoto} className='flex flex-col items-center gap-2'>
            <FontAwesome name="camera" size={40} color="#FFD046" />
            <Text className="text-white text-base opacity-70">Cámara</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={pickImage} className='flex flex-col items-center gap-2'>
            <FontAwesome name="image" size={40} color="#FFD046" />
            <Text className="text-white text-base opacity-70">Galería</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={deleteImage} className='flex flex-col items-center gap-2'>
            <FontAwesome name="trash" size={40} color="#FFD046" />
            <Text className="text-white text-base opacity-70">Borrar</Text>
          </TouchableOpacity>
        </View>
      </CustomModal>
    </View >
  );
}

