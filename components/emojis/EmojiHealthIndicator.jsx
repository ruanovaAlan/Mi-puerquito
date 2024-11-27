import { HappyFace, JudgeFace, WorriedFace } from './Emoji'

export default function EmojiHealthIndicator({ currentAmount, limitAmount, isSavings }) {

  const calculateHealth = () => {
    const health = isSavings ?
      (Math.abs(limitAmount - currentAmount) * 100) / limitAmount
      :
      (currentAmount * 100 / limitAmount);

    if (health >= 70) {
      return <HappyFace />
    } else if (health >= 35) {
      return <JudgeFace />
    } else {
      return <WorriedFace />
    }
  }

  return (
    calculateHealth()
  )
}