import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator, StatusBar, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import HomeScreen from './src/screens/HomeScreen';
import DailyCheckInScreen from './src/screens/DailyCheckInScreen';
import QuestionnaireScreen from './src/screens/QuestionnaireScreen';
import ProgressScreen from './src/screens/ProgressScreen';
import ChatbotScreen from './src/screens/ChatbotScreen';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('login');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkLoginStatus = async () => {
      const token = await AsyncStorage.getItem('access_token');
      if (token) {
        setCurrentScreen('home');
      }
      setIsLoading(false);
    };
    checkLoginStatus();
  }, []);

  const handleLogin = () => setCurrentScreen('home');
  const handleLogout = async () => {
    await AsyncStorage.removeItem('access_token');
    setCurrentScreen('login');
  };

  if (isLoading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const renderScreen = () => {
    switch (currentScreen) {
      case 'login':
        return (
          <LoginScreen 
            onLoginSuccess={handleLogin}
            onGoToRegister={() => setCurrentScreen('register')}
          />
        );
      case 'register':
        return (
          <RegisterScreen 
            onRegisterSuccess={handleLogin}
            onGoToLogin={() => setCurrentScreen('login')}
          />
        );
      case 'home':
        return (
          <HomeScreen 
            onLogout={handleLogout}
            onNavigate={setCurrentScreen}
          />
        );
      case 'daily-checkin':
        return <DailyCheckInScreen onGoBack={() => setCurrentScreen('home')} />;
      case 'questionnaire':
        return <QuestionnaireScreen onGoBack={() => setCurrentScreen('home')} />;
      case 'progress':
        return <ProgressScreen onGoBack={() => setCurrentScreen('home')} />;
      case 'chatbot':
        return <ChatbotScreen onGoBack={() => setCurrentScreen('home')} />;
      default:
        return <LoginScreen onLoginSuccess={handleLogin} />;
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <StatusBar barStyle="dark-content" />
      {renderScreen()}
    </View>
  );
}

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
