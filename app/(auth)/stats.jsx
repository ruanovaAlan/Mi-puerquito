import React, { useState, useContext, useEffect } from 'react';
import { View, Text, Pressable } from 'react-native';
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

        <View className="flex flex-row items-center justify-between  pt-4 mb-10">
          <Text className="text-white text-xl font-bold">Estadísticas</Text>
          <GenerateReport userId={userId} date={date} />
        </View>

        <ChartStats userId={userId} />

      </View>
    </ScreenLayout>
  );
}
