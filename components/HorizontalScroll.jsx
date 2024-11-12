import { View, ScrollView, Scroll } from 'react-native'
import React from 'react'

export default function HorizontalScroll({ children, heigth }) {
  return (
    <ScrollView
      horizontal={true}
      showsHorizontalScrollIndicator={true}
      indicatorStyle="white" //
      style={{ maxHeight: heigth }}
    >
      <View className="flex flex-row" style={{ gap: 20, }}>
        {children}
      </View>
    </ScrollView>
  )
}