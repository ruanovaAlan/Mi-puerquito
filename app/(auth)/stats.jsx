import React, { useState, useContext, useEffect } from 'react';
import { View, Text } from 'react-native';
import { AuthContext } from '../../context/AuthContext';
import ScreenLayout from '../../components/ScreenLayout';
import GenerateReport from '../../components/stats/GenerateReport';
import ChartStats from '../../components/stats/ChartStats';

export default function Stats() {
  const { userId } = useContext(AuthContext);
  const date = new Date().toISOString().slice(0, 7);

  return (
    <ScreenLayout>
      <View>
        <Text className='text-white text-xl font-bold mt-4 mb-6'>Estadísticas</Text>
        <ChartStats userId={userId} />
        <GenerateReport userId={userId} date={date} />
      </View>
    </ScreenLayout>
  );
}
