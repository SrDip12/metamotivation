import React, { useState } from 'react';
import { 
  View, 
  TextInput, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Alert,
  Dimensions,
  ScrollView
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { theme } from '../styles/theme';

const { width } = Dimensions.get('window');
import { getApiUrl } from '../config/api';

const API_URL = getApiUrl();

export default function LoginScreen({ onLoginSuccess, onGoToRegister }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Por favor ingresa email y contraseña');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const formBody = `username=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`;
      const response = await fetch(`${API_URL}/api/v1/login/access-token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
        body: formBody,
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.detail || 'Error en el inicio de sesión.');
        return;
      }

      await AsyncStorage.setItem('access_token', data.access_token);
      onLoginSuccess();
    } catch (e) {
      setError('Error de red. Verifica tu conexión.');
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient
      colors={theme.colors.gradients.primary}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header con emojis */}
        <View style={styles.header}>
          <Text style={styles.emoji}>🚀✨</Text>
          <Text style={styles.title}>MetaMotivation</Text>
          <Text style={styles.subtitle}>Tu journey hacia el crecimiento personal</Text>
        </View>

        {/* Formulario */}
        <View style={styles.formContainer}>
          <Text style={styles.formTitle}>¡Bienvenido de vuelta! 👋</Text>
          
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>📧 Email</Text>
            <TextInput
              placeholder="tu@email.com"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              style={styles.input}
              placeholderTextColor={theme.colors.text.light}
            />
          </View>
          
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>🔒 Contraseña</Text>
            <TextInput
              placeholder="••••••••"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              style={styles.input}
              placeholderTextColor={theme.colors.text.light}
            />
          </View>
          
          {error ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>⚠️ {error}</Text>
            </View>
          ) : null}
          
          <TouchableOpacity
            style={[styles.loginButton, loading && styles.disabledButton]}
            onPress={handleLogin}
            disabled={loading}
          >
            <LinearGradient
              colors={theme.colors.gradients.success}
              style={styles.buttonGradient}
            >
              <Text style={styles.loginButtonText}>
                {loading ? "✨ Iniciando..." : "🎯 Iniciar Sesión"}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.linkButton} onPress={onGoToRegister}>
            <Text style={styles.linkText}>
              ¿Primera vez aquí? <Text style={styles.linkTextBold}>¡Únete ahora! 🌟</Text>
            </Text>
          </TouchableOpacity>
        </View>

        {/* Footer motivacional */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            "El primer paso hacia el cambio es la conciencia.{'\n'}
            El segundo paso es la aceptación." ✨
          </Text>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'space-between',
    paddingTop: 60
  },
  header: {
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.xl
  },
  emoji: {
    fontSize: 48,
    marginBottom: theme.spacing.md
  },
  title: {
    fontSize: theme.fonts.sizes.hero,
    fontWeight: theme.fonts.weights.bold,
    color: theme.colors.white,
    textAlign: 'center',
    marginBottom: theme.spacing.sm
  },
  subtitle: {
    fontSize: theme.fonts.sizes.lg,
    color: theme.colors.white,
    textAlign: 'center',
    opacity: 0.9
  },
  formContainer: {
    backgroundColor: theme.colors.white,
    marginHorizontal: theme.spacing.lg,
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing.xl,
    ...theme.shadows.large
  },
  formTitle: {
    fontSize: theme.fonts.sizes.xl,
    fontWeight: theme.fonts.weights.bold,
    color: theme.colors.text.primary,
    textAlign: 'center',
    marginBottom: theme.spacing.xl
  },
  inputContainer: {
    marginBottom: theme.spacing.lg
  },
  inputLabel: {
    fontSize: theme.fonts.sizes.md,
    fontWeight: theme.fonts.weights.medium,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm
  },
  input: {
    height: 56,
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.lg,
    fontSize: theme.fonts.sizes.md,
    color: theme.colors.text.primary,
    borderWidth: 2,
    borderColor: 'transparent'
  },
  errorContainer: {
    backgroundColor: '#FFE6E6',
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.sm,
    marginBottom: theme.spacing.lg
  },
  errorText: {
    color: theme.colors.error,
    textAlign: 'center',
    fontSize: theme.fonts.sizes.sm
  },
  loginButton: {
    borderRadius: theme.borderRadius.md,
    overflow: 'hidden',
    marginBottom: theme.spacing.lg,
    ...theme.shadows.medium
  },
  buttonGradient: {
    paddingVertical: theme.spacing.lg,
    alignItems: 'center'
  },
  disabledButton: {
    opacity: 0.7
  },
  loginButtonText: {
    color: theme.colors.white,
    fontSize: theme.fonts.sizes.lg,
    fontWeight: theme.fonts.weights.bold
  },
  linkButton: {
    alignItems: 'center',
    paddingVertical: theme.spacing.md
  },
  linkText: {
    fontSize: theme.fonts.sizes.md,
    color: theme.colors.text.secondary
  },
  linkTextBold: {
    fontWeight: theme.fonts.weights.bold,
    color: theme.colors.primary
  },
  footer: {
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.lg,
    alignItems: 'center'
  },
  footerText: {
    fontSize: theme.fonts.sizes.sm,
    color: theme.colors.white,
    textAlign: 'center',
    opacity: 0.8,
    fontStyle: 'italic'
  }
});
