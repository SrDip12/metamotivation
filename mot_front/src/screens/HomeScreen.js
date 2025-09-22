import React from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  ScrollView,
  Dimensions 
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { theme } from '../styles/theme';

const { width } = Dimensions.get('window');

export default function HomeScreen({ onLogout, onNavigate }) {
  const menuOptions = [
    {
      title: "Check-in Diario",
      subtitle: "¿Cómo te sientes hoy?",
      icon: "📊",
      screen: "daily-checkin",
      gradient: theme.colors.gradients.success,
      emoji: "💪"
    },
    {
      title: "Cuestionario",
      subtitle: "Descubre tu perfil único",
      icon: "📝",
      screen: "questionnaire",
      gradient: theme.colors.gradients.primary,
      emoji: "🧠"
    },
    {
      title: "Mi Progreso",
      subtitle: "Celebra tus logros",
      icon: "📈",
      screen: "progress",
      gradient: theme.colors.gradients.sunset,
      emoji: "🎯"
    },
    {
      title: "Asistente IA",
      subtitle: "Tu coach personal 24/7",
      icon: "🤖",
      screen: "chatbot",
      gradient: theme.colors.gradients.ocean,
      emoji: "✨"
    }
  ];

  return (
    <LinearGradient
      colors={['#F8F9FF', '#E8EEFF']}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header con saludo personalizado */}
        <View style={styles.header}>
          <Text style={styles.greeting}>¡Hola, Champion! 🌟</Text>
          <Text style={styles.subtitle}>¿Qué quieres lograr hoy?</Text>
          <View style={styles.motivationalBadge}>
            <Text style={styles.badgeText}>🔥 ¡Vas increíble!</Text>
          </View>
        </View>

        {/* Grid de opciones */}
        <View style={styles.optionsContainer}>
          {menuOptions.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={styles.optionCard}
              onPress={() => onNavigate(option.screen)}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={option.gradient}
                style={styles.cardGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <View style={styles.cardContent}>
                  <Text style={styles.cardEmoji}>{option.emoji}</Text>
                  <Text style={styles.cardTitle}>{option.title}</Text>
                  <Text style={styles.cardSubtitle}>{option.subtitle}</Text>
                </View>
                <View style={styles.cardArrow}>
                  <Text style={styles.arrowText}>→</Text>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </View>

        {/* Sección motivacional */}
        <View style={styles.motivationSection}>
          <Text style={styles.motivationTitle}>💡 Tip del día</Text>
          <Text style={styles.motivationText}>
            "Cada pequeño paso que das hoy es un gran salto hacia tu futuro. 
            ¡Sigue brillando! ✨"
          </Text>
        </View>

        {/* Botón de logout estilizado */}
        <TouchableOpacity style={styles.logoutContainer} onPress={onLogout}>
          <View style={styles.logoutButton}>
            <Text style={styles.logoutText}>👋 Cerrar Sesión</Text>
          </View>
        </TouchableOpacity>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  scrollContent: {
    paddingTop: 60,
    paddingBottom: 30
  },
  header: {
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.lg,
    alignItems: 'center'
  },
  greeting: {
    fontSize: theme.fonts.sizes.xxl,
    fontWeight: theme.fonts.weights.bold,
    color: theme.colors.text.primary,
    textAlign: 'center',
    marginBottom: theme.spacing.sm
  },
  subtitle: {
    fontSize: theme.fonts.sizes.lg,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    marginBottom: theme.spacing.lg
  },
  motivationalBadge: {
    backgroundColor: theme.colors.accent,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.round,
    ...theme.shadows.small
  },
  badgeText: {
    fontSize: theme.fonts.sizes.sm,
    fontWeight: theme.fonts.weights.bold,
    color: theme.colors.text.primary
  },
  optionsContainer: {
    paddingHorizontal: theme.spacing.lg,
    marginTop: theme.spacing.lg
  },
  optionCard: {
    marginBottom: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    overflow: 'hidden',
    ...theme.shadows.medium
  },
  cardGradient: {
    padding: theme.spacing.xl,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  cardContent: {
    flex: 1
  },
  cardEmoji: {
    fontSize: 32,
    marginBottom: theme.spacing.sm
  },
  cardTitle: {
    fontSize: theme.fonts.sizes.xl,
    fontWeight: theme.fonts.weights.bold,
    color: theme.colors.white,
    marginBottom: theme.spacing.xs
  },
  cardSubtitle: {
    fontSize: theme.fonts.sizes.md,
    color: theme.colors.white,
    opacity: 0.9
  },
  cardArrow: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center'
  },
  arrowText: {
    fontSize: 20,
    color: theme.colors.white,
    fontWeight: theme.fonts.weights.bold
  },
  motivationSection: {
    marginHorizontal: theme.spacing.lg,
    marginTop: theme.spacing.xl,
    backgroundColor: theme.colors.white,
    padding: theme.spacing.xl,
    borderRadius: theme.borderRadius.lg,
    ...theme.shadows.small
  },
  motivationTitle: {
    fontSize: theme.fonts.sizes.lg,
    fontWeight: theme.fonts.weights.bold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.md,
    textAlign: 'center'
  },
  motivationText: {
    fontSize: theme.fonts.sizes.md,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    lineHeight: 24,
    fontStyle: 'italic'
  },
  logoutContainer: {
    paddingHorizontal: theme.spacing.xl,
    marginTop: theme.spacing.xl
  },
  logoutButton: {
    backgroundColor: theme.colors.white,
    paddingVertical: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: theme.colors.error,
    ...theme.shadows.small
  },
  logoutText: {
    color: theme.colors.error,
    fontSize: theme.fonts.sizes.lg,
    fontWeight: theme.fonts.weights.medium
  }
});
