import { View, ScrollView } from 'react-native'
import React from 'react'

export default function HorizontalScroll({ children, style }) {
  return (
    <ScrollView horizontal={true} showsHorizontalScrollIndicator={true} >
      <View className="flex flex-row" style={{ gap: 20 }}>
        {children}
      </View>
    </ScrollView>
  )
}