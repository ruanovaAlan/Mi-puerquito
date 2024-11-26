import { View, Text, Pressable } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import ScreenLayout from '../../components/ScreenLayout';
import HorizontalScroll from '../../components/HorizontalScroll';
import CreditCard from '../../components/wallet/CreditCard';
import { AuthContext } from '../../context/AuthContext';
import { CardsContext } from '../../context/CardsContext';
import { colors } from '../../utils/colors';
import { getSavingGoal, getTotalSavings, getSavingLimit, deleteSavings } from '../../utils/database';
import { AddIcon } from '../../components/Icons';
import CustomModal from '../../components/CustomModal';
import SavingGoal from '../../components/savings/SavingGoal';
import AddSavingGoal from '../../components/savings/AddSavingGoal';
import UpdateSavingGoal from '../../components/savings/UpdateSavingGoal';
import SavingLimit from '../../components/savings/SavingLimit';
import AddSavingLimit from '../../components/savings/AddSavingLimit';
import UpdateSavingLimit from '../../components/savings/UpdateSavingLimit';


export default function Savings() {
  const { userId } = useContext(AuthContext);
  const { cards } = useContext(CardsContext);
  const [savings, setSavings] = useState(0);
  const [objectiveModal, setObjectiveModal] = useState(false);
  const [limitModal, setLimitModal] = useState(false);
  const [addObjectiveLimit, setAddObjectiveLimit] = useState({
    objective: false,
    limit: false,
  });
  const [count, setCount] = useState(0);
  const [savingGoal, setSavingGoal] = useState(null); // Almacena el objetivo actual
  const [savingGoalId, setSavingGoalId] = useState(null); // Almacena el ID del objetivo actual
  const [savingLimit, setSavingLimit] = useState(null); // Almacena el límite actual
  const [savingLimitId, setSavingLimitId] = useState(null); // Almacena el ID del límite actual

  const debitAndSavings = cards.filter(
    (account) => account.account_type === 'debit' || account.account_type === 'savings'
  );

  // Obtener el total de ahorros al cargar el componente
  useEffect(() => {
    const fetchSavings = async () => {
      try {
        // await deleteSavings();
        const data = await getTotalSavings(userId);
        setSavings(data[0]?.total_balance || 0);
      } catch (error) {
        console.log('Error al obtener ahorros:', error);
      }
    };

    fetchSavings();
  }, [userId, cards]);

  // Obtener el objetivo de ahorro actual
  useEffect(() => {
    const fetchSavingGoal = async () => {
      try {
        const goal = await getSavingGoal(userId);
        if (goal.length > 0) {
          setSavingGoal(goal[0].target_amount);
          setSavingGoalId(goal[0].id);
          setAddObjectiveLimit((prev) => ({ ...prev, objective: true }));
        } else {
          setSavingGoal(null);
          setSavingGoalId(null);
          setAddObjectiveLimit((prev) => ({ ...prev, objective: false }));
        }
      } catch (error) {
        console.log('Error al obtener objetivo de ahorro:', error);
      }
    };

    fetchSavingGoal();
  }, [userId, count]);

  // Obtener el límite de gastos actual
  useEffect(() => {
    const fetchSavingLimit = async () => {
      try {
        const limit = await getSavingLimit(userId);
        if (limit.length > 0) {
          setSavingLimit(limit[0].min_amount); // Asegúrate de usar la propiedad correcta
          setSavingLimitId(limit[0].id);
          setAddObjectiveLimit((prev) => ({ ...prev, limit: true }));
        } else {
          setSavingLimit(null);
          setSavingLimitId(null);
          setAddObjectiveLimit((prev) => ({ ...prev, limit: false }));
        }
      } catch (error) {
        console.log('Error al obtener límite de ahorro:', error);
      }
    };

    fetchSavingLimit();
  }, [userId, count]);

  // Manejar la apertura de los modales
  const handleOpenModal = (type) => {
    if (type === 'addGoal' || type === 'modifyGoal') setObjectiveModal(true);
    if (type === 'addLimit' || type === 'modifyLimit') setLimitModal(true);
  };

  return (
    <ScreenLayout>
      {/* Efectivo/Tarjeta */}
      <View className="flex flex-col gap-8 pt-4 mb-8">
        <View className="flex flex-row items-center">
          <Text className="text-white text-xl font-bold">Efectivo/Tarjeta</Text>
          <View className="px-12">
            <Text className="text-black text-xl font-extrabold bg-[#1EC96899] rounded-lg px-6 py-0">
              ${savings}
            </Text>
          </View>
        </View>
      </View>

      {debitAndSavings.length > 0 ? (
        <HorizontalScroll heigth={145}>
          {debitAndSavings.map((card, index) => (
            <CreditCard key={card.id} card={card} color={colors[index % colors.length]} />
          ))}
        </HorizontalScroll>
      ) : (
        <Text className="text-white text-lg text-center opacity-50">
          No tienes tarjetas registradas
        </Text>
      )}

      {/* Objetivo de ahorro */}
      <View className="flex flex-row items-center justify-between pt-3 mb-3">
        <Text className="text-white text-xl font-bold">Objetivo de ahorro</Text>
        <Pressable
          onPress={() =>
            savingGoal !== null ? handleOpenModal('modifyGoal') : handleOpenModal('addGoal')
          }
        >
          <View className="flex flex-row items-center">
            <AddIcon className="scale-90" color="#60606C" />
            <Text className="text-[#60606C] text-lg font-bold ml-3">
              {savingGoal !== null ? 'Modificar' : 'Agregar'}
            </Text>
          </View>
        </Pressable>
      </View>

      <View className="mx-auto py-3">
        <SavingGoal
          userId={userId}
          savings={savings}
          count={count}
          setAddObjectiveLimit={setAddObjectiveLimit}
        />
      </View>

      <CustomModal
        isOpen={objectiveModal}
        title={savingGoal !== null ? 'Modificar objetivo' : 'Nuevo objetivo'}
        setIsOpen={setObjectiveModal}
      >
        {savingGoal !== null ? (
          <UpdateSavingGoal
            userId={userId}
            savingsId={savingGoalId}
            currentTarget={savingGoal}
            closeModal={setObjectiveModal}
            setCount={setCount}
          />
        ) : (
          <AddSavingGoal
            userId={userId}
            closeModal={setObjectiveModal}
            setCount={setCount}
          />
        )}
      </CustomModal>

      {/* Límite de gastos */}
      <View className="flex flex-row items-center justify-between pt-3 mb-1">
        <Text className="text-white text-xl font-bold">Límite de ahorro</Text>
        <Pressable
          onPress={() =>
            savingLimit !== null ? handleOpenModal('modifyLimit') : handleOpenModal('addLimit')
          }
        >
          <View className="flex flex-row items-center">
            <AddIcon className="scale-90" color="#60606C" />
            <Text className="text-[#60606C] text-lg font-bold ml-3">
              {savingLimit !== null ? 'Modificar' : 'Agregar'}
            </Text>
          </View>
        </Pressable>
      </View>

      <View className="py-0">
        <SavingLimit
          userId={userId}
          count={count}
          savings={savings}
          setAddObjectiveLimit={setAddObjectiveLimit}
        />
      </View>

      <CustomModal
        isOpen={limitModal}
        title={savingLimit !== null ? 'Modificar límite' : 'Nuevo límite'}
        setIsOpen={setLimitModal}
      >
        {savingLimit !== null ? (
          <UpdateSavingLimit
            userId={userId}
            savingsId={savingLimitId}
            currentLimit={savingLimit}
            closeModal={setLimitModal}
            setCount={setCount}
          />
        ) : (
          <AddSavingLimit
            userId={userId}
            closeModal={setLimitModal}
            setCount={setCount}
          />
        )}
      </CustomModal>
    </ScreenLayout>
  );
}
