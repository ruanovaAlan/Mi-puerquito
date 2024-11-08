import { View, Text, Pressable, TextInput, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native'
import React, { useState, useEffect } from 'react'
import { Link, useRouter } from 'expo-router'
import ScreenLayout from '../components/ScreenLayout'
import BlobLogin from '../components/BlobLogin'
import Logo from '../components/Logo'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { crearTablaUsers, obtenerUsers, insertarUser } from '../utils/db'


export default function index() {
  const router = useRouter()
  const [userName, setUserName] = useState('')
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const initDb = async () => {
      try {
        await crearTablaUsers();
        const fetchedUsers = await obtenerUsers();
        setUsers(fetchedUsers);

        if (fetchedUsers.length > 0) {
          console.log('Usuarios encontrados:', fetchedUsers);
          router.replace('/(auth)/home');
        }
      } catch (error) {
        console.log('Error al inicializar la base de datos:', error);
      }
    };
    initDb();
  }, [router]);

  const handleCreateUser = async () => {
    if (userName.trim() === '') return;
    try {
      await insertarUser(userName);
      setUserName('');

      const updatedUsers = await obtenerUsers();
      setUsers(updatedUsers);

      if (updatedUsers.length > 0) {
        router.replace('/(auth)/home');
      }
    } catch (error) {
      console.log('Error al crear usuario:', error);
    }

  }

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <SafeAreaProvider className='bg-[#18181B]'>
        <BlobLogin className='bg-[#18181B]' />
        <View className="items-center absolute top-16 w-full">
          <Logo />
        </View>

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
        >
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16 }} className='top-52'>
            <View className="items-center w-full top-[-50]">
              <Text className='text-center text-[#F0FDF5] font-extrabold text-4xl '>Mi Puerquito</Text>
            </View>
            <TextInput
              style={{
                width: '70%',
                height: 40,
                borderColor: '#ccc',
                borderBottomWidth: 1,
                marginTop: 20,
                color: 'white',
                paddingLeft: 10,
              }}
              placeholder="Ingresa tu usuario"
              placeholderTextColor="gray"
              value={userName}
              onChangeText={setUserName}
            />

            <Pressable
              style={{
                backgroundColor: '#1EC968',
                width: '70%',
                padding: 15,
                borderRadius: 8,
                marginTop: 20,
              }}
              onPress={handleCreateUser}
            >
              <Text style={{ textAlign: 'center', fontSize: 18, fontWeight: 'bold' }}>Crear Usuario</Text>
            </Pressable>
          </View>
        </KeyboardAvoidingView>



      </SafeAreaProvider>
    </TouchableWithoutFeedback>
  )
}