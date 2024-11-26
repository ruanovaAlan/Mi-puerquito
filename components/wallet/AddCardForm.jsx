import { View, Text, Pressable, ScrollView, Alert } from 'react-native';
import React, { useState, useEffect, useContext } from 'react';
import { useFetchCards } from '../../hooks/useFetchCards';
import SwitchButton from '../SwitchButton';
import CustomInput from '../CustomInput';
import CustomDropdownSelector from './CustomDropdownSelector';
import { insertAccount } from '../../utils/database';
import { AppContext } from '../../context/AppContext';

export default function AddCardForm({ userId, closeModal }) {
  const [selectedOption, setSelectedOption] = useState(1); // 1: Crédito, 2: Débito, 3: Efectivo
  const { setCount } = useFetchCards(userId);
  const { reloadWallet } = useContext(AppContext);

  const SwhitchOptions = { 1: 'credit', 2: 'debit', 3: 'savings' };

  const [formData, setFormData] = useState({
    last_four: '',
    expiration_month: '',
    expiration_year: '',
    issuer: '',
    billing_date: '',
    balance_limit: '',
    available_balance: '',
  });

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      account_type: SwhitchOptions[selectedOption],
    }));
  }, [selectedOption]);

  const handleChangeInput = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleCreateWallet = async () => {
    try {

      const currentDate = new Date();
      const currentMonth = currentDate.getMonth() + 1;
      const currentYear = currentDate.getFullYear();

      const expirationYear = parseInt(formData.expiration_year, 10);
      const expirationMonth = parseInt(formData.expiration_month, 10);

      // Define los campos obligatorios para cada tipo de tarjeta
      const requiredFields = {
        1: ['last_four', 'expiration_month', 'expiration_year', 'issuer', 'billing_date', 'balance_limit'], // Credit
        2: ['last_four', 'expiration_month', 'expiration_year', 'issuer', 'available_balance'], // Debit
        3: ['issuer', 'available_balance'], // Savings
      };

      // Verifica si algún campo obligatorio está vacío
      const missingField = requiredFields[selectedOption].find((field) => !formData[field]);
      if (missingField) {
        const type = selectedOption === 1 ? 'crédito' : selectedOption === 2 ? 'débito' : 'efectivo';
        Alert.alert('Ups...', `Todos los campos son obligatorios.`);
        return;
      }

      // Validación de last_four
      if (selectedOption !== 3 && (!/^\d{4}$/.test(formData.last_four))) {
        Alert.alert('Ups...', 'Los últimos 4 dígitos deben ser numéricos y tener 4 caracteres.');
        return;
      }

      // Validación de billing_date
      if (selectedOption === 1 && (parseInt(formData.billing_date, 10) < 1 || parseInt(formData.billing_date, 10) > 31)) {
        Alert.alert('Ups...', 'El día de corte debe estar entre 1 y 31.');
        return;
      }

      // Validación de fecha de expiración
      if (
        expirationYear < currentYear ||
        (expirationYear === currentYear && expirationMonth < currentMonth)
      ) {
        Alert.alert('Ups...', 'Parece que tu tarjeta ya expiró :(');
        return;
      }

      const expiration_date = `${formData.expiration_month}/${formData.expiration_year.slice(-2)}`;

      console.log(await insertAccount(
        userId,
        SwhitchOptions[selectedOption],
        formData.last_four || null,
        expiration_date,
        formData.issuer,
        parseInt(formData.billing_date, 10),
        parseFloat(formData.balance_limit || null),
        parseFloat(selectedOption === 1 ? formData.balance_limit : formData.available_balance || null)
      ));
      closeModal(false);
      setCount((prev) => prev + 1);
      reloadWallet();
    } catch (error) {
      console.error('Error al crear la tarjeta:', error);
    }
  };

  return (
    <View style={{ marginTop: 20, padding: 15, backgroundColor: '#2C2C34', borderRadius: 10 }}>
      <SwitchButton
        optionOne="Crédito"
        optionTwo="Débito"
        optionThree="Efectivo"
        selectedOption={selectedOption}
        setSelectedOption={setSelectedOption}
      />

      <ScrollView>
        {/* Banco o Nombre */}
        <CustomInput
          value={formData.issuer}
          label={selectedOption === 3 ? 'Nombre' : 'Banco'}
          placeholder={selectedOption === 3 ? 'Ingresa el nombre' : 'Ingresa el banco'}
          handleChange={(text) => handleChangeInput('issuer', text)}
        />

        {/* Campos específicos */}
        {selectedOption === 1 && (
          <CustomInput
            value={formData.balance_limit}
            label="Límite de crédito"
            placeholder="Ingresa el límite de crédito"
            handleChange={(text) => handleChangeInput('balance_limit', text)}
            type="numeric"
          />
        )}

        {selectedOption === 2 && (
          <CustomInput
            value={formData.available_balance}
            label="Saldo Disponible"
            placeholder="Ingresa el saldo disponible"
            handleChange={(text) => handleChangeInput('available_balance', text)}
            type="numeric"
          />
        )}

        {(selectedOption === 1 || selectedOption === 2) && (
          <CustomInput
            value={formData.last_four}
            label="Últimos 4 dígitos"
            placeholder="Ingresa los últimos 4 dígitos"
            handleChange={(text) => handleChangeInput('last_four', text)}
            type="numeric"
            maxLength={4}
          />
        )}

        {selectedOption === 1 && (
          <CustomInput
            value={formData.billing_date}
            label="Día de corte"
            placeholder="Ingresa el día de corte"
            handleChange={(text) => {
              if (/^\d{0,2}$/.test(text)) { // Validar que solo permita hasta 2 dígitos
                handleChangeInput('billing_date', text);
              }
            }}
            type="numeric"
            maxLength={2} // Limita la entrada a 2 caracteres
          />
        )}


        {/* Fecha de Expiración */}
        {(selectedOption === 1 || selectedOption === 2) && (
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
            <CustomDropdownSelector
              selectedMonth={formData.expiration_month}
              selectedYear={formData.expiration_year}
              setMonth={(value) => handleChangeInput('expiration_month', value)}
              setYear={(value) => handleChangeInput('expiration_year', value)}
            />
          </View>
        )}

        {selectedOption === 3 && (
          <CustomInput
            value={formData.available_balance}
            label="Efectivo Disponible"
            placeholder="Ingresa el efectivo disponible"
            handleChange={(text) => handleChangeInput('available_balance', text)}
            type="numeric"
          />
        )}
      </ScrollView>

      {/* Botón Guardar */}
      <Pressable
        style={{
          backgroundColor: '#1EC968',
          width: '100%',
          padding: 10,
          borderRadius: 8,
          marginTop: 20,
        }}
        onPress={handleCreateWallet}
      >
        <Text style={{ textAlign: 'center', color: 'white', fontSize: 16, fontWeight: 'bold' }}>
          Guardar
        </Text>
      </Pressable>
    </View>
  );
}
