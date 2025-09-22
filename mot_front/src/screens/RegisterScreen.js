import React, { useState } from 'react';
import { 
  View, 
  TextInput, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Alert,
  ScrollView,
  Dimensions
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { theme } from '../styles/theme';
import { getApiUrl } from '../config/api';

const API_URL = getApiUrl();

export default function RegisterScreen({ onRegisterSuccess, onGoToLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!email || !password || !confirmPassword) {
      setError('Por favor completa todos los campos');
      return;
    }

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    if (password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Por favor ingresa un email válido');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const registerResponse = await fetch(`${API_URL}/api/v1/users/register`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ 
          email: email.trim().toLowerCase(),
          password: password 
        })
      });

      if (!registerResponse.ok) {
        const errorData = await registerResponse.json();
        if (registerResponse.status === 400) {
          if (errorData.detail && errorData.detail.includes('already registered')) {
            setError('Este email ya está registrado. Intenta iniciar sesión.');
          } else {
            setError(errorData.detail || 'Error en los datos proporcionados');
          }
        } else {
          setError(errorData.detail || `Error del servidor (${registerResponse.status})`);
        }
        return;
      }

      // Login automático
      const formBody = `username=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`;
      const loginResponse = await fetch(`${API_URL}/api/v1/login/access-token`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
          'Accept': 'application/json'
        },
        body: formBody,
      });

      if (loginResponse.ok) {
        const loginData = await loginResponse.json();
        await AsyncStorage.setItem('access_token', loginData.access_token);
        
        Alert.alert(
          '¡Bienvenido a MetaMotivation! 🎉',
          'Tu cuenta fue creada exitosamente. ¡Comienza tu journey de crecimiento personal!',
          [{ text: '¡Empezemos! 🚀', onPress: onRegisterSuccess }]
        );
      } else {
        Alert.alert(
          '¡Cuenta creada! ✅',
          'Tu cuenta fue creada exitosamente. Ahora puedes iniciar sesión.',
          [{ text: 'Iniciar Sesión', onPress: onGoToLogin }]
        );
      }

    } catch (e) {
      setError('Error de conexión. Verifica tu internet y que el servidor esté funcionando.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient
      colors={theme.colors.gradients.secondary}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.emoji}>🌟💫</Text>
          <Text style={styles.title}>¡Únete a MetaMotivation!</Text>
          <Text style={styles.subtitle}>Tu adventure hacia el crecimiento personal comienza aquí</Text>
        </View>

        {/* Formulario */}
        <View style={styles.formContainer}>
          <Text style={styles.formTitle}>Crea tu cuenta ✨</Text>
          
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>📧 Email</Text>
            <TextInput
              placeholder="tu-email@ejemplo.com"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              style={styles.input}
              placeholderTextColor={theme.colors.text.light}
            />
          </View>
          
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>🔒 Contraseña</Text>
            <TextInput
              placeholder="Mínimo 8 caracteres"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              style={styles.input}
              placeholderTextColor={theme.colors.text.light}
            />
          </View>
          
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>🔐 Confirmar Contraseña</Text>
            <TextInput
              placeholder="Repite tu contraseña"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
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
            style={[styles.registerButton, loading && styles.disabledButton]}
            onPress={handleRegister}
            disabled={loading}
          >
            <LinearGradient
              colors={theme.colors.gradients.success}
              style={styles.buttonGradient}
            >
              <Text style={styles.registerButtonText}>
                {loading ? "✨ Creando cuenta..." : "🚀 Crear mi Cuenta"}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.linkButton} onPress={onGoToLogin}>
            <Text style={styles.linkText}>
              ¿Ya tienes cuenta? <Text style={styles.linkTextBold}>¡Inicia sesión! 👋</Text>
            </Text>
          </TouchableOpacity>
        </View>

        {/* Beneficios */}
        <View style={styles.benefitsContainer}>
          <Text style={styles.benefitsTitle}>🎯 Al unirte podrás:</Text>
          <View style={styles.benefitItem}>
            <Text style={styles.benefitText}>📊 Hacer seguimiento de tu motivación diaria</Text>
          </View>
          <View style={styles.benefitItem}>
            <Text style={styles.benefitText}>🧠 Descubrir tu perfil de metamotivación</Text>
          </View>
          <View style={styles.benefitItem}>
            <Text style={styles.benefitText}>📈 Ver tu progreso y celebrar logros</Text>
          </View>
          <View style={styles.benefitItem}>
            <Text style={styles.benefitText}>🤖 Chatear con tu coach personal IA</Text>
          </View>
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
    paddingTop: 60,
    paddingBottom: 30
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
  registerButton: {
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
  registerButtonText: {
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
  benefitsContainer: {
    marginHorizontal: theme.spacing.lg,
    marginTop: theme.spacing.xl,
    backgroundColor: 'rgba(255,255,255,0.1)',
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg
  },
  benefitsTitle: {
    fontSize: theme.fonts.sizes.lg,
    fontWeight: theme.fonts.weights.bold,
    color: theme.colors.white,
    textAlign: 'center',
    marginBottom: theme.spacing.lg
  },
  benefitItem: {
    marginBottom: theme.spacing.sm
  },
  benefitText: {
    fontSize: theme.fonts.sizes.md,
    color: theme.colors.white,
    opacity: 0.9
  }
});
