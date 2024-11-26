import { View, Text } from 'react-native'
import React, { useState, useEffect } from 'react'
import { PieChart } from "react-native-gifted-charts";
import { getExpensesByUser } from '../../utils/database';
import { transformToPieData } from '../../utils/helpers';

const ChartStats = ({ userId }) => {
  const [pieData, setPieData] = useState([]);
  const [maxCategory, setMaxCategory] = useState({});

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const transactions = await getExpensesByUser(userId);
        const { pieData, maxCategory } = transformToPieData(transactions);
        setPieData(pieData);
        setMaxCategory(maxCategory);
      } catch (error) {
        console.error('Error al obtener transacciones:', error);
      }
    };
    fetchTransactions();
  }, []);

  console.log(pieData);


  const renderDot = color => {
    return (
      <View
        style={{
          height: 10,
          width: 10,
          borderRadius: 5,
          backgroundColor: color,
          marginRight: 10,
        }}
      />
    );
  };

  const renderLegendComponent = (data) => {
    return (
      <View className='flex flex-row flex-wrap justify-between w-[80%] mx-auto'>
        {data.map((item, index) => (
          <View className='flex flex-row items-center mb-2' key={index}>
            {renderDot(item.color)}
            <Text style={{ color: 'white' }}>
              {item.label}: {item.percentage}%
            </Text>
          </View>
        ))}
      </View>
    );
  };


  return (

    <View
      style={{
        margin: 20,
        padding: 16,
        borderRadius: 20,
        backgroundColor: '#2E2E33',
      }}>
      <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>
        Categoría con mayor gasto
      </Text>
      <View style={{ padding: 20, alignItems: 'center' }}>
        <PieChart
          data={pieData}
          donut
          showGradient
          sectionAutoFocus
          radius={100}
          innerRadius={60}
          innerCircleColor={'#2E2E33'}
          centerLabelComponent={() => {
            return (
              <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                <Text
                  className='text-2xl text-white font-bold'>
                  {maxCategory.percentage}%
                </Text>
                <Text className='text-xl'>
                  {maxCategory.category}
                </Text>
              </View>
            );
          }}
        />
      </View>
      {renderLegendComponent(pieData)}
    </View>
  );
}

export default ChartStats;