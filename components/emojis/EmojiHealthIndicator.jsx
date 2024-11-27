import { HappyFace, JudgeFace, WorriedFace } from './Emoji'

export default function EmojiHealthIndicator({ currentAmount, limitAmount, isSavings, isStats }) {

  const calculateHealth = () => {

    const health = isSavings ?
      (Math.abs(limitAmount - currentAmount) * 100) / limitAmount
      :
      (currentAmount * 100 / limitAmount);

    if (isStats) {
      if (health >= 80) {
        return <WorriedFace />
      } else if (health >= 50 && health < 80) {
        return <JudgeFace />
      } else {
        return <HappyFace />
      }
    } else {
      if (health >= 70) {
        return <HappyFace />
      } else if (health >= 35) {
        return <JudgeFace />
      } else {
        return <WorriedFace />
      }
    }

  }

  return (
    calculateHealth()
  )
}