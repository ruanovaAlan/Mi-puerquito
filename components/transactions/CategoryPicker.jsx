import { View, Text, Pressable, ScrollView } from 'react-native';
import React, { useState } from 'react';
import { AddCategoryIcon } from '../Icons';

const CATEGORIES = {
  Comida: '🍔',
  Transporte: '🚗',
  Diversión: '🎮',
  Salud: '🏥',
  Educación: '📚',
  Ropa: '👗',
  Regalos: '🎁',
  Otros: '💸',
};

export default function CategoryPicker({ selectedCategory, setSelectedCategory, setModalOpen }) {

  const handleChangeCategory = (name, category) => {
    const emoji = CATEGORIES[category]; // Obtén el emoji basado en el nombre de la categoría
    setSelectedCategory(name, emoji); // Pasa el emoji a setSelectedCategory
    setModalOpen(false); // Cierra el modal
  };

  return (
    <View>
      <ScrollView>
        <View className="flex flex-wrap flex-row justify-normal gap-8 mt-4 mx-auto">
          {Object.keys(CATEGORIES).map((category) => (
            <Pressable
              key={category}
              onPress={() => handleChangeCategory('category', category)}
              className="items-center"
            >
              <View
                className={`w-16 h-16 rounded-full flex items-center justify-center ${selectedCategory === category ? 'bg-[#FFD046]' : 'bg-[#18181B] opacity-90'
                  }`}
              >
                <Text className="text-2xl">{CATEGORIES[category]}</Text>
              </View>
              <Text
                className={`mt-2 text-sm ${selectedCategory === category ? 'text-[#FFD046] font-medium' : 'text-[#fff] opacity-60'
                  }`}
              >
                {category}
              </Text>
            </Pressable>
          ))}
        </View>
      </ScrollView>

    </View>
  );
}
