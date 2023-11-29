import '@azure/core-asynciterator-polyfill';
import './src/styles/Theme.css';
import { Boot } from './src/boot';
// import * as SplashScreen from 'expo-splash-screen';
// SplashScreen.preventAutoHideAsync();

export default function App() {
  return (<Boot />);
}