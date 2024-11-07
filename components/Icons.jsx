import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import FontAwesome from '@expo/vector-icons/FontAwesome';

export const HomeIcon = (props) => {
  return <FontAwesome5 name="home" size={33} color="#60606C" {...props} />
}

export const ChartIcon = (props) => {
  return <FontAwesome6 name="chart-simple" size={33} color="#60606C" {...props} />
}

export const AddIcon = (props) => {
  return <FontAwesome name="plus-circle" size={40} color="#60606C" {...props} />
}

export const CardIcon = (props) => {
  return <FontAwesome name="credit-card-alt" size={33} color="#60606C" {...props} />
}

export const PiggyIcon = (props) => {
  return <FontAwesome6 name="piggy-bank" size={33} color="#60606C" {...props} />
}