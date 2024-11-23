import { View, Text, Pressable, Alert } from 'react-native';
import React, { useState } from 'react';
import { updateAccountById, deleteAccountById } from '../../utils/database';
import CustomInput from '../CustomInput';
import CustomDropdownSelector from './CustomDropdownSelector';
import CreditCard from './CreditCard';

export default function EditCardForm({ card, closeModal }) {
  const [formData, setFormData] = useState({
    last_four: card.last_four ? String(card.last_four) : '',
    expiration_month: card.expiration_date ? card.expiration_date.split('/')[0] : '',
    expiration_year: card.expiration_date ? card.expiration_date.split('/')[1] : '',
    issuer: card.issuer || '',
    billing_date: card.billing_date || '',
    balance_limit: card.balance_limit || '',
    available_balance: card.available_balance || '',
  });

  const isCredit = card.account_type === 'credit';
  const isDebit = card.account_type === 'debit';
  const isSavings = card.account_type === 'savings';

  const handleChangeInput = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: String(value) }));
  };

  const handleSaveChanges = async () => {
    try {

      // Validación de last_four
      if (isCredit && (!/^\d{4}$/.test(String(formData.last_four)))) {
        Alert.alert('Ups...', 'Los últimos 4 dígitos deben ser numéricos y tener 4 caracteres.');
        return;
      }

      // Validación de billing_date
      if (isCredit && (parseInt(formData.billing_date, 10) < 1 || parseInt(formData.billing_date, 10) > 31)) {
        Alert.alert('Ups...', 'El día de corte debe estar entre 1 y 31.');
        return;
      }

      // Validación de expiration_date no sea en el pasado
      const currentDate = new Date();
      const currentYear = parseInt(String(currentDate.getFullYear()).slice(-2), 10);
      const currentMonth = currentDate.getMonth() + 1;

      const expirationYear = formData.expiration_year
        ? parseInt(formData.expiration_year.slice(-2), 10)
        : parseInt(card.expiration_date.split('/')[1], 10);

      const expirationMonth = formData.expiration_month
        ? parseInt(formData.expiration_month, 10)
        : parseInt(card.expiration_date.split('/')[0], 10);

      // Validación
      if (
        expirationYear < currentYear ||
        (expirationYear === currentYear && expirationMonth < currentMonth)
      ) {
        Alert.alert('Ups...', 'Parece que tu tarjeta ya expiró :(');
        return;
      }
      

      const updates = {
        last_four: isSavings ? null : String(formData.last_four),
        expiration_date: `${formData.expiration_month}/${formData.expiration_year.slice(-2)}`,
        issuer: String(formData.issuer),
        billing_date: formData.billing_date ? String(formData.billing_date) : '',
        balance_limit: formData.balance_limit ? parseFloat(formData.balance_limit) : null,
        available_balance: isCredit ? parseFloat(formData.balance_limit || null) : parseFloat(formData.available_balance || null),
      };

      await updateAccountById(card.id, updates);
      closeModal(false);
    } catch (error) {
      console.error('Error al actualizar la tarjeta:', error);
    }
  };


  return (
    <View
      style={{
        marginTop: 20,
        padding: 15,
        backgroundColor: '#2C2C34',
        borderRadius: 10,
      }}
    >
      {/* Muestra la tarjeta al principio */}
      <View style={{ alignItems: 'center', marginBottom: 15 }}>
        <CreditCard color="#FFD046" card={card} onEdit={() => { }} />
      </View>

      {/* Campos Editables */}
      <CustomInput
        value={formData.issuer}
        label={isSavings ? 'Nombre' : 'Banco'}
        placeholder={card.issuer || (isSavings ? 'Ingresa el nombre' : 'Ingresa el banco')}
        handleChange={(text) => handleChangeInput('issuer', text)}
      />

      {isCredit && (
        <CustomInput
          value={formData.balance_limit}
          label="Límite de crédito"
          placeholder={card.balance_limit ? String(card.balance_limit) : 'Ingresa el límite de crédito'}
          handleChange={(text) => handleChangeInput('balance_limit', text)}
          type="numeric"
        />
      )}

      {(isDebit || isSavings) && (
        <CustomInput
          value={formData.available_balance}
          label={isSavings ? 'Efectivo Disponible' : 'Saldo Disponible'}
          placeholder={
            card.available_balance
              ? String(card.available_balance)
              : isSavings
                ? 'Ingresa el efectivo disponible'
                : 'Ingresa el saldo disponible'
          }
          handleChange={(text) => handleChangeInput('available_balance', text)}
          type="numeric"
        />
      )}

      {(isCredit || isDebit) && (
        <CustomInput
          value={formData.last_four}
          label="Últimos 4 dígitos"
          placeholder={card.last_four ? String(card.last_four) : 'Ingresa los últimos 4 dígitos'}
          handleChange={(text) => handleChangeInput('last_four', text)}
          type="numeric"
          maxLength={4}
        />
      )}

      {isCredit && (
        <CustomInput
          value={formData.billing_date}
          label="Día de corte"
          placeholder={card.billing_date || 'Ingresa el día de corte'}
          handleChange={(text) => handleChangeInput('billing_date', text)}
          type="numeric"
        />
      )}

      {(isCredit || isDebit) && (
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
          <CustomDropdownSelector
            selectedMonth={formData.expiration_month}
            selectedYear={formData.expiration_year}
            setMonth={(value) => handleChangeInput('expiration_month', value)}
            setYear={(value) => handleChangeInput('expiration_year', value)}
          />
        </View>
      )}

      {/* Botón Guardar */}
      <Pressable
        style={{
          backgroundColor: '#1EC968',
          width: '100%',
          padding: 10,
          borderRadius: 8,
          marginTop: 20,
          alignSelf: 'center',
        }}
        onPress={handleSaveChanges}
      >
        <Text style={{ textAlign: 'center', color: 'white', fontSize: 16, fontWeight: 'bold' }}>
          Guardar
        </Text>
      </Pressable>

      {/* Botón Eliminar */}
      <Pressable
        style={{
          backgroundColor: '#565661',
          width: '100%',
          padding: 10,
          borderRadius: 8,
          marginTop: 10,
          alignSelf: 'center',
        }}
        onPress={async () => {
          Alert.alert('Confirmar eliminación','¿Estás seguro de que deseas eliminar esta cuenta?', [
            {
              text: 'Cancelar',
              onPress: () => {},
              style: 'cancel',
            },
            {
              text: 'Eliminar',
              onPress: async () => {
                try {
                  await deleteAccountById(card.id);
                  closeModal(false);
                } catch (error) {
                  console.error('Error al eliminar la tarjeta:', error);
                }
              }
            },
          ]);
        }}

      >
        <Text style={{ textAlign: 'center', color: '#FF3D71', fontSize: 16, fontWeight: 'bold' }}>
          Eliminar
        </Text>
      </Pressable>
    </View>
  );
}
