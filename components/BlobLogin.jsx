import Svg, { Path } from "react-native-svg"
import { useWindowDimensions, Image } from 'react-native';

const BlobLogin = (props) => {
  const { width, height } = useWindowDimensions();
  console.log(width, height)

  return (
    <Image
      source={require('../components/assets/blobPng.png')}
      style={{
        width: width,
        height: height,
        position: 'absolute',
        top: -200,
        zIndex: -1,
      }}
    />
  )
}
export default BlobLogin
