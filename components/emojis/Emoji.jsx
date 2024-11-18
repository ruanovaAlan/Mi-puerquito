import { Image } from 'react-native'
import React from 'react'


export function HappyFace() {
  return (
    <Image
      source={require('../../components/assets/happy.png')}
    />
  )
}

export function JudgeFace() {
  return (
    <Image
      source={require('../../components/assets/mmh.png')}
    />
  )
}

export function WorriedFace() {
  return (
    <Image
      source={require('../../components/assets/anguished.png')}
    />
  )
}