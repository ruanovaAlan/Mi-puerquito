import React, { useState, useContext } from 'react';
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
import { CardsContext } from '../../context/CardsContext';

export default function CustomCardSelector({ selectedAccount, setSelectedAccount }) {
  const { cards } = useContext(CardsContext);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedIcon, setSelectedIcon] = useState('');

  // Crear un array con objetos que incluyan tanto el displayName como el id
  const formattedCards = cards.map((card) => ({
    id: card.id,
    displayName: `${card.issuer}${card.account_type !== 'savings' ? ` - ${card.last_four}` : ''}`,
  }));


  const handleSelect = (id, icon) => {
    setSelectedAccount((prev) => ({ ...prev, wallet_id: id }));
    setSelectedIcon(icon);
    setModalVisible(false);
  };

  const renderModal = () => (
    <Modal
      visible={modalVisible}
      transparent
      animationType="fade"
      onRequestClose={() => setModalVisible(false)}
    >
      <Pressable
        style={styles.modalOverlay}
        onPress={() => setModalVisible(false)}
      >
        <View style={styles.modalContent}>
          <FlatList
            data={formattedCards}
            keyExtractor={(item) => `${item.id}`}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.modalItem}
                onPress={() => handleSelect(item.id, item.displayName)}
              >
                <Text style={styles.modalItemText}>{item.displayName}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      </Pressable>
    </Modal>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Selecciona una cuenta</Text>
      <TouchableOpacity
        style={styles.inputContainer}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.value}>
          {selectedIcon || 'Seleccionar cuenta'}
        </Text>
        <Ionicons name="chevron-down" size={20} color="white" />
      </TouchableOpacity>

      {/* Modal */}
      {renderModal()}
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
  inputContainer: {
    backgroundColor: '#565661',
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    paddingHorizontal: 15,
  },
  value: {
    color: 'white',
    fontSize: 14,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#2C2C34',
    borderRadius: 10,
    width: '60%',
    maxHeight: '60%',
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
