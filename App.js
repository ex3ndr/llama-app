import { Boot } from './src/boot';
import * as SplashScreen from 'expo-splash-screen';
SplashScreen.preventAutoHideAsync();

export default function App() {
  return (<Boot />);
}