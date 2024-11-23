import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  StyleSheet,
  Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Iconos para las flechas

export default function CustomExpirationDateSelector(
  {
    selectedMonth,
    selectedYear,
    setMonth,
    setYear,
  }) {

  const [modalVisible, setModalVisible] = useState({ month: false, year: false });

  const months = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0')); // Meses del 01 al 12
  const years = Array.from({ length: 30 }, (_, i) => String(new Date().getFullYear() + i)); // Años desde el actual

  const handleSelect = (type, value) => {
    if (type === 'month') setMonth(value);
    if (type === 'year') setYear(value);
    setModalVisible({ ...modalVisible, [type]: false });
  };

  const renderModal = (type, options) => (
    <Modal
      visible={modalVisible[type]}
      transparent
      animationType="fade"
      onRequestClose={() => setModalVisible({ ...modalVisible, [type]: false })}
    >
      <Pressable
        style={styles.modalOverlay}
        onPress={() => setModalVisible({ ...modalVisible, [type]: false })}
      >
        <View style={styles.modalContent}>
          <FlatList
            data={options}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.modalItem}
                onPress={() => handleSelect(type, item)}
              >
                <Text style={styles.modalItemText}>{item}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      </Pressable>
    </Modal>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Fecha de expiración</Text>
      <View style={styles.row}>
        <View style={styles.inputContainer}>
          {/* Selector de Mes */}
          <TouchableOpacity
            style={styles.selector}
            onPress={() => setModalVisible({ ...modalVisible, month: true })}
          >
            <View className='flex flex-row items-center gap-4'>

              <Text style={styles.value}>{selectedMonth || 'MM'}</Text>

              <View style={{ alignItems: 'center' }}>
                <Ionicons name="chevron-up-outline" size={12} color="white" />
                <Ionicons name="chevron-down-outline" size={12} color="white" />
              </View>

            </View>
          </TouchableOpacity>
          <Text>  </Text>


          <Text style={styles.separator}>/</Text>

          {/* Selector de Año */}
          <TouchableOpacity
            style={styles.selector}
            onPress={() => setModalVisible({ ...modalVisible, year: true })}
          >

            <View className='flex flex-row items-center gap-4'>
              <Text style={styles.value}>{selectedYear || 'YYYY'}</Text>


              <View style={{ alignItems: 'center' }}>
                <Ionicons name="chevron-up-outline" size={12} color="white" />
                <Ionicons name="chevron-down-outline" size={12} color="white" />
              </View>

            </View>
          </TouchableOpacity>
        </View>
      </View>

      {/* Modales */}
      {renderModal('month', months)}
      {renderModal('year', years)}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  label: {
    color: 'white',
    fontSize: 14,
    marginBottom: 10,
    fontWeight: 'bold',
    marginTop: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputContainer: {
    backgroundColor: '#565661',
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 15,
    justifyContent: 'space-between',
  },
  selector: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  value: {
    color: 'white',
    fontSize: 14,
  },
  separator: {
    color: 'white',
    fontSize: 16,
    marginHorizontal: 10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#2C2C34',
    borderRadius: 10,
    width: '30%',
    maxHeight: '50%',
    padding: 15,
  },
  modalItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#444',
  },
  modalItemText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
});
