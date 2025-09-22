import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  Alert, 
  ScrollView,
  Dimensions
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { theme } from '../styles/theme';
import { getApiUrl } from '../config/api';

const API_URL = getApiUrl();

export default function DailyCheckInScreen({ onGoBack }) {
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [loading, setLoading] = useState(false);

  const emotionLevels = [
    { 
      level: 2, 
      emoji: "😢", 
      description: "Mal", 
      gradient: ['#FF6B9D', '#FF8E8E'],
      message: "Está bien tener días difíciles. Eres valiente por reconocerlo 💪"
    },
    { 
      level: 5, 
      emoji: "😐", 
      description: "Regular", 
      gradient: ['#FFE66D', '#FFB84D'],
      message: "Un día neutral es perfecto para pequeños pasos hacia adelante 🌱"
    },
    { 
      level: 8, 
      emoji: "😊", 
      description: "Bien", 
      gradient: ['#4ECDC4', '#44A08D'],
      message: "¡Qué genial que te sientas bien! Aprovecha esta energía positiva ✨"
    },
    { 
      level: 10, 
      emoji: "🚀", 
      description: "Excelente", 
      gradient: ['#6C63FF', '#5A52FF'],
      message: "¡WOW! Estás en fire 🔥 ¡Nada puede detenerte hoy!"
    }
  ];

  const submitCheckIn = async () => {
    if (!selectedLevel) {
      Alert.alert('¡Espera! 🤔', 'Selecciona cómo te sientes antes de continuar');
      return;
    }

    setLoading(true);
    console.log('🚀 Iniciando check-in con nivel:', selectedLevel);
    
    try {
      const token = await AsyncStorage.getItem('access_token');
      
      if (!token) {
        Alert.alert('Oops! 😅', 'Necesitas iniciar sesión nuevamente.');
        return;
      }

      console.log('📡 Enviando request al backend...');
      console.log('URL:', `${API_URL}/api/v1/check-in/`);
      console.log('Data a enviar:', { motivation_level: parseInt(selectedLevel) });

      const response = await fetch(`${API_URL}/api/v1/check-in/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        },
        body: JSON.stringify({ 
          motivation_level: parseInt(selectedLevel)
        })
      });

      console.log('📊 Status de respuesta:', response.status);
      console.log('📋 Headers de respuesta:', response.headers);

      // Obtener el texto crudo primero para debug
      const responseText = await response.text();
      console.log('📝 Respuesta cruda del servidor:', responseText);

      if (response.ok) {
        let responseData;
        
        // Intentar parsear JSON solo si la respuesta no está vacía
        if (responseText && responseText.trim() !== '') {
          try {
            responseData = JSON.parse(responseText);
            console.log('✅ JSON parseado correctamente:', responseData);
          } catch (parseError) {
            console.warn('⚠️ Error parseando JSON, pero request exitoso');
            responseData = { success: true };
          }
        } else {
          responseData = { success: true };
        }
        
        const selectedEmotion = emotionLevels.find(e => e.level === selectedLevel);
        Alert.alert(
          '¡Check-in guardado! 🎉', 
          `${selectedEmotion.message}\n\n¡Sigue registrando tu progreso cada día!`,
          [{ text: '¡Genial! 🌟', onPress: onGoBack }]
        );
        
      } else {
        console.error('❌ Error del servidor. Status:', response.status);
        console.error('📄 Respuesta completa:', responseText);
        
        let errorMessage = 'Hubo un problema al guardar tu check-in';
        
        // Intentar parsear el error si es JSON válido
        try {
          const errorData = JSON.parse(responseText);
          errorMessage = errorData.detail || errorData.message || errorMessage;
        } catch (parseError) {
          console.warn('⚠️ Error no es JSON válido');
          errorMessage = `Error ${response.status}: ${response.statusText || 'Error del servidor'}`;
        }
        
        Alert.alert('Ups! 😕', errorMessage);
      }
      
    } catch (networkError) {
      console.error('🌐 Error de red completo:', networkError);
      console.error('📋 Stack trace:', networkError.stack);
      
      if (networkError.message.includes('JSON Parse error')) {
        Alert.alert(
          'Error de comunicación 📡', 
          'El servidor devolvió una respuesta malformada. Por favor:\n\n• Verifica que el backend esté funcionando correctamente\n• Revisa los logs del servidor\n• Intenta de nuevo en un momento'
        );
      } else if (networkError.message.includes('Network request failed')) {
        Alert.alert(
          'Error de conexión 📶', 
          'No se pudo conectar al servidor. Verifica:\n\n• Tu conexión a internet\n• Que el backend esté corriendo\n• La URL del servidor'
        );
      } else {
        Alert.alert(
          'Error inesperado 🤖', 
          `Algo salió mal: ${networkError.message}\n\nIntenta de nuevo en un momento.`
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const selectedEmotion = emotionLevels.find(e => e.level === selectedLevel);

  return (
    <LinearGradient
      colors={selectedEmotion ? selectedEmotion.gradient : theme.colors.gradients.primary}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onGoBack} style={styles.backButton}>
            <Text style={styles.backButtonText}>← Volver</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Check-in Diario 📊</Text>
          <View style={styles.placeholder} />
        </View>

        {/* Pregunta principal */}
        <View style={styles.questionContainer}>
          <Text style={styles.question}>¿Cómo está tu motivación hoy?</Text>
          <Text style={styles.subtitle}>Toca el emoji que mejor te represente</Text>
        </View>

        {/* Grid de emociones */}
        <View style={styles.emotionsContainer}>
          {emotionLevels.map(emotion => (
            <TouchableOpacity
              key={emotion.level}
              style={[
                styles.emotionCard,
                selectedLevel === emotion.level && styles.selectedCard
              ]}
              onPress={() => {
                console.log('🎯 Usuario seleccionó nivel:', emotion.level);
                setSelectedLevel(emotion.level);
              }}
              activeOpacity={0.7}
            >
              <LinearGradient
                colors={selectedLevel === emotion.level ? emotion.gradient : ['#FFFFFF', '#F8F9FF']}
                style={styles.cardGradient}
              >
                <Text style={styles.emoji}>{emotion.emoji}</Text>
                <Text style={[
                  styles.emotionDescription,
                  selectedLevel === emotion.level && { color: theme.colors.white }
                ]}>
                  {emotion.description}
                </Text>
                <View style={[
                  styles.levelBadge,
                  selectedLevel === emotion.level && { backgroundColor: 'rgba(255,255,255,0.3)' }
                ]}>
                  <Text style={[
                    styles.levelText,
                    selectedLevel === emotion.level && { color: theme.colors.white }
                  ]}>
                    {emotion.level}/10
                  </Text>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </View>

        {/* Mensaje personalizado */}
        {selectedLevel && (
          <View style={styles.messageContainer}>
            <Text style={styles.messageText}>
              {selectedEmotion.message}
            </Text>
          </View>
        )}

        {/* Botón de acción */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.saveButton, (!selectedLevel || loading) && styles.disabledButton]}
            onPress={submitCheckIn}
            disabled={loading || !selectedLevel}
          >
            <LinearGradient
              colors={selectedEmotion ? ['rgba(255,255,255,0.9)', 'rgba(255,255,255,0.7)'] : theme.colors.gradients.success}
              style={styles.buttonGradient}
            >
              <Text style={[
                styles.saveButtonText,
                selectedEmotion && { color: theme.colors.text.primary }
              ]}>
                {loading ? "✨ Guardando..." : "💾 Registrar mi Estado"}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

// Los mismos estilos que antes...
const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 30
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    paddingTop: 60,
    paddingBottom: theme.spacing.lg
  },
  backButton: {
    padding: theme.spacing.sm
  },
  backButtonText: {
    color: theme.colors.white,
    fontSize: theme.fonts.sizes.md,
    fontWeight: theme.fonts.weights.medium
  },
  title: {
    fontSize: theme.fonts.sizes.xl,
    fontWeight: theme.fonts.weights.bold,
    color: theme.colors.white
  },
  placeholder: {
    width: 60
  },
  questionContainer: {
    alignItems: 'center',
    paddingHorizontal: theme.spacing.xl,
    marginBottom: theme.spacing.xxl
  },
  question: {
    fontSize: theme.fonts.sizes.xxl,
    fontWeight: theme.fonts.weights.bold,
    color: theme.colors.white,
    textAlign: 'center',
    marginBottom: theme.spacing.md
  },
  subtitle: {
    fontSize: theme.fonts.sizes.lg,
    color: theme.colors.white,
    textAlign: 'center',
    opacity: 0.9
  },
  emotionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.xl
  },
  emotionCard: {
    width: '48%',
    marginBottom: theme.spacing.lg,
    borderRadius: theme.borderRadius.xl,
    overflow: 'hidden',
    ...theme.shadows.large
  },
  selectedCard: {
    transform: [{ scale: 1.05 }]
  },
  cardGradient: {
    padding: theme.spacing.xl,
    alignItems: 'center',
    minHeight: 140
  },
  emoji: {
    fontSize: 48,
    marginBottom: theme.spacing.md
  },
  emotionDescription: {
    fontSize: theme.fonts.sizes.lg,
    fontWeight: theme.fonts.weights.bold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm
  },
  levelBadge: {
    backgroundColor: theme.colors.background,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.round
  },
  levelText: {
    fontSize: theme.fonts.sizes.sm,
    fontWeight: theme.fonts.weights.bold,
    color: theme.colors.text.secondary
  },
  messageContainer: {
    marginHorizontal: theme.spacing.lg,
    backgroundColor: 'rgba(255,255,255,0.2)',
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    marginBottom: theme.spacing.xl
  },
  messageText: {
    fontSize: theme.fonts.sizes.lg,
    color: theme.colors.white,
    textAlign: 'center',
    fontWeight: theme.fonts.weights.medium,
    lineHeight: 26
  },
  buttonContainer: {
    paddingHorizontal: theme.spacing.lg,
    marginTop: 'auto'
  },
  saveButton: {
    borderRadius: theme.borderRadius.md,
    overflow: 'hidden',
    ...theme.shadows.medium
  },
  buttonGradient: {
    paddingVertical: theme.spacing.lg,
    alignItems: 'center'
  },
  disabledButton: {
    opacity: 0.5
  },
  saveButtonText: {
    color: theme.colors.white,
    fontSize: theme.fonts.sizes.lg,
    fontWeight: theme.fonts.weights.bold
  }
});
