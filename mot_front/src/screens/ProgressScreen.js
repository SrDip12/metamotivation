import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  ScrollView, 
  ActivityIndicator,
  Dimensions
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { theme } from '../styles/theme';
import { getApiUrl } from '../config/api';

const API_URL = getApiUrl();

export default function ProgressScreen({ onGoBack }) {
  const [motivationData, setMotivationData] = useState(null);
  const [summaryData, setSummaryData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadProgressData();
  }, []);

  const loadProgressData = async () => {
    try {
      const token = await AsyncStorage.getItem('access_token');
      
      const [motivationResponse, summaryResponse] = await Promise.all([
        fetch(`${API_URL}/api/v1/dashboard/motivation-history`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch(`${API_URL}/api/v1/dashboard/questionnaire-summary`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ]);

      let motivationJson = [];
      let summaryJson = [];

      if (motivationResponse.ok) {
        motivationJson = await motivationResponse.json();
        setMotivationData(motivationJson);
      }

      if (summaryResponse.ok) {
        summaryJson = await summaryResponse.json();
        setSummaryData(summaryJson);
      }

      if (!motivationResponse.ok && !summaryResponse.ok) {
        setError('No se pudieron cargar los datos');
      }
    } catch (e) {
      console.error('Error al cargar progreso:', e);
      setError('Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  const getScalePercentage = (value, maxScale = 7) => {
    return Math.round((value / maxScale) * 100);
  };

  const getScaleColor = (value, maxScale = 7) => {
    const percentage = value / maxScale;
    if (percentage >= 0.8) return theme.colors.gradients.success;
    if (percentage >= 0.6) return ['#81C784', '#66BB6A'];
    if (percentage >= 0.4) return ['#FFB74D', '#FF9800'];
    if (percentage >= 0.2) return ['#FF8A65', '#FF5722'];
    return ['#E57373', '#F44336'];
  };

  const getMotivationMessage = (average) => {
    if (average >= 8) return "¡Estás en fuego! 🔥 Tu motivación está por las nubes";
    if (average >= 6) return "¡Vas súper bien! 💪 Mantén ese ritmo";
    if (average >= 4) return "Progreso constante 📈 Cada paso cuenta";
    return "Días difíciles hacen personas fuertes 💎 No te rindas";
  };

  if (loading) {
    return (
      <LinearGradient
        colors={theme.colors.gradients.primary}
        style={styles.loadingContainer}
      >
        <ActivityIndicator size="large" color={theme.colors.white} />
        <Text style={styles.loadingText}>Analizando tu progreso increíble... ✨</Text>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      colors={theme.colors.gradients.sunset}
      style={styles.container}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onGoBack} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Volver</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Mi Progreso 📈</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {error ? (
          <View style={styles.errorCard}>
            <Text style={styles.errorEmoji}>🌱</Text>
            <Text style={styles.errorTitle}>¡Tu journey está comenzando!</Text>
            <Text style={styles.errorText}>
              Completa algunos check-ins diarios y el cuestionario para ver 
              gráficas increíbles de tu progreso.
            </Text>
            <View style={styles.tipsContainer}>
              <Text style={styles.tipsTitle}>💡 Tips para empezar:</Text>
              <Text style={styles.tipText}>📊 Haz tu primer check-in diario</Text>
              <Text style={styles.tipText}>📝 Completa el cuestionario</Text>
              <Text style={styles.tipText}>🤖 Chatea con tu asistente IA</Text>
            </View>
          </View>
        ) : (
          <>
            {/* Sección de Motivación Diaria */}
            <View style={styles.sectionCard}>
              <LinearGradient
                colors={theme.colors.gradients.ocean}
                style={styles.sectionGradient}
              >
                <Text style={styles.sectionTitle}>📊 Tu Evolución Diaria</Text>
                {motivationData && motivationData.length > 0 ? (
                  <View style={styles.motivationContent}>
                    <View style={styles.statsRow}>
                      <View style={styles.statItem}>
                        <Text style={styles.statNumber}>{motivationData.length}</Text>
                        <Text style={styles.statLabel}>días registrados</Text>
                      </View>
                      <View style={styles.statItem}>
                        <Text style={styles.statNumber}>
                          {Math.round(
                            motivationData.reduce((sum, item) => sum + item.motivation_level, 0) / 
                            motivationData.length * 10
                          ) / 10}
                        </Text>
                        <Text style={styles.statLabel}>promedio</Text>
                      </View>
                      <View style={styles.statItem}>
                        <Text style={styles.statNumber}>
                          {Math.max(...motivationData.map(item => item.motivation_level))}
                        </Text>
                        <Text style={styles.statLabel}>mejor día</Text>
                      </View>
                    </View>
                    
                    <Text style={styles.motivationMessage}>
                      {getMotivationMessage(
                        motivationData.reduce((sum, item) => sum + item.motivation_level, 0) / motivationData.length
                      )}
                    </Text>
                    
                    <View style={styles.recentDataContainer}>
                      <Text style={styles.recentDataTitle}>🗓️ Últimos 5 días:</Text>
                      {motivationData.slice(-5).map((item, index) => (
                        <View key={index} style={styles.dataRow}>
                          <View style={styles.dataLeft}>
                            <Text style={styles.dataDate}>
                              {new Date(item.date).toLocaleDateString('es-ES', { 
                                day: 'numeric', 
                                month: 'short' 
                              })}
                            </Text>
                          </View>
                          <View style={styles.dataRight}>
                            <View style={styles.motivationBar}>
                              <LinearGradient
                                colors={getScaleColor(item.motivation_level, 10)}
                                style={[
                                  styles.motivationFill, 
                                  { width: `${(item.motivation_level / 10) * 100}%` }
                                ]}
                              />
                            </View>
                            <Text style={styles.motivationValue}>{item.motivation_level}/10</Text>
                          </View>
                        </View>
                      ))}
                    </View>
                  </View>
                ) : (
                  <View style={styles.noDataContainer}>
                    <Text style={styles.noDataEmoji}>📅</Text>
                    <Text style={styles.noDataText}>
                      ¡Haz tu primer check-in diario para ver tu evolución!
                    </Text>
                  </View>
                )}
              </LinearGradient>
            </View>

            {/* Sección del Cuestionario */}
            <View style={styles.sectionCard}>
              <LinearGradient
                colors={theme.colors.gradients.forest}
                style={styles.sectionGradient}
              >
                <Text style={styles.sectionTitle}>🎯 Tu Perfil de Metamotivación</Text>
                <Text style={styles.scaleNote}>
                  Escala: 1 (Totalmente en desacuerdo) - 7 (Totalmente de acuerdo)
                </Text>
                
                {summaryData && summaryData.length > 0 ? (
                  <View style={styles.profileContent}>
                    {summaryData.map((item, index) => (
                      <View key={index} style={styles.profileItem}>
                        <View style={styles.profileHeader}>
                          <Text style={styles.profileSectionName}>{item.section_name}</Text>
                          <Text style={styles.profileScore}>
                            {Math.round(item.average_score * 10) / 10}/7.0
                          </Text>
                        </View>
                        
                        <View style={styles.progressBarContainer}>
                          <LinearGradient
                            colors={getScaleColor(item.average_score, 7)}
                            style={[
                              styles.progressBarFill, 
                              { width: `${getScalePercentage(item.average_score, 7)}%` }
                            ]}
                          />
                        </View>
                        
                        <Text style={styles.percentageText}>
                          {getScalePercentage(item.average_score, 7)}% de acuerdo
                        </Text>
                      </View>
                    ))}
                    
                    {/* Fortalezas y áreas de mejora */}
                    <View style={styles.insightsContainer}>
                      <View style={styles.strengthCard}>
                        <Text style={styles.insightTitle}>💪 Tu fortaleza</Text>
                        <Text style={styles.insightText}>
                          {summaryData.reduce((max, item) => 
                            item.average_score > max.average_score ? item : max
                          ).section_name}
                        </Text>
                      </View>
                      
                      <View style={styles.growthCard}>
                        <Text style={styles.insightTitle}>🌱 Área de crecimiento</Text>
                        <Text style={styles.insightText}>
                          {summaryData.reduce((min, item) => 
                            item.average_score < min.average_score ? item : min
                          ).section_name}
                        </Text>
                      </View>
                    </View>
                  </View>
                ) : (
                  <View style={styles.noDataContainer}>
                    <Text style={styles.noDataEmoji}>📝</Text>
                    <Text style={styles.noDataText}>
                      ¡Completa el cuestionario para descubrir tu perfil único!
                    </Text>
                  </View>
                )}
              </LinearGradient>
            </View>

            {/* Mensaje motivacional */}
            <View style={styles.motivationalCard}>
              <Text style={styles.motivationalTitle}>✨ Recuerda</Text>
              <Text style={styles.motivationalText}>
                "El progreso no es lineal. Cada día que te comprometes contigo mismo, 
                estás construyendo la mejor versión de ti. ¡Sigue brillando!" 🌟
              </Text>
            </View>
          </>
        )}
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.xl
  },
  loadingText: {
    marginTop: theme.spacing.lg,
    fontSize: theme.fonts.sizes.lg,
    color: theme.colors.white,
    textAlign: 'center'
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
  content: {
    flex: 1,
    paddingHorizontal: theme.spacing.lg
  },
  errorCard: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing.xl,
    alignItems: 'center',
    ...theme.shadows.medium
  },
  errorEmoji: {
    fontSize: 64,
    marginBottom: theme.spacing.lg
  },
  errorTitle: {
    fontSize: theme.fonts.sizes.xl,
    fontWeight: theme.fonts.weights.bold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.md,
    textAlign: 'center'
  },
  errorText: {
    fontSize: theme.fonts.sizes.md,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: theme.spacing.xl
  },
  tipsContainer: {
    alignSelf: 'stretch'
  },
  tipsTitle: {
    fontSize: theme.fonts.sizes.lg,
    fontWeight: theme.fonts.weights.bold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.md,
    textAlign: 'center'
  },
  tipText: {
    fontSize: theme.fonts.sizes.md,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.sm,
    paddingLeft: theme.spacing.md
  },
  sectionCard: {
    borderRadius: theme.borderRadius.xl,
    overflow: 'hidden',
    marginBottom: theme.spacing.lg,
    ...theme.shadows.large
  },
  sectionGradient: {
    padding: theme.spacing.xl
  },
  sectionTitle: {
    fontSize: theme.fonts.sizes.xl,
    fontWeight: theme.fonts.weights.bold,
    color: theme.colors.white,
    textAlign: 'center',
    marginBottom: theme.spacing.lg
  },
  scaleNote: {
    fontSize: theme.fonts.sizes.sm,
    color: theme.colors.white,
    textAlign: 'center',
    opacity: 0.9,
    marginBottom: theme.spacing.lg,
    fontStyle: 'italic'
  },
  motivationContent: {
    alignItems: 'center'
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: theme.spacing.xl
  },
  statItem: {
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
    minWidth: 80
  },
  statNumber: {
    fontSize: theme.fonts.sizes.xxl,
    fontWeight: theme.fonts.weights.bold,
    color: theme.colors.white,
    marginBottom: theme.spacing.xs
  },
  statLabel: {
    fontSize: theme.fonts.sizes.sm,
    color: theme.colors.white,
    opacity: 0.9,
    textAlign: 'center'
  },
  motivationMessage: {
    fontSize: theme.fonts.sizes.lg,
    color: theme.colors.white,
    textAlign: 'center',
    marginBottom: theme.spacing.xl,
    fontWeight: theme.fonts.weights.medium,
    lineHeight: 26
  },
  recentDataContainer: {
    alignSelf: 'stretch'
  },
  recentDataTitle: {
    fontSize: theme.fonts.sizes.md,
    fontWeight: theme.fonts.weights.bold,
    color: theme.colors.white,
    marginBottom: theme.spacing.md
  },
  dataRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
    backgroundColor: 'rgba(255,255,255,0.1)',
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.sm
  },
  dataLeft: {
    width: 60
  },
  dataDate: {
    fontSize: theme.fonts.sizes.sm,
    color: theme.colors.white,
    fontWeight: theme.fonts.weights.medium
  },
  dataRight: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: theme.spacing.md
  },
  motivationBar: {
    flex: 1,
    height: 8,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 4,
    overflow: 'hidden',
    marginRight: theme.spacing.md
  },
  motivationFill: {
    height: '100%',
    borderRadius: 4
  },
  motivationValue: {
    fontSize: theme.fonts.sizes.sm,
    color: theme.colors.white,
    fontWeight: theme.fonts.weights.bold,
    minWidth: 35
  },
  noDataContainer: {
    alignItems: 'center',
    paddingVertical: theme.spacing.xl
  },
  noDataEmoji: {
    fontSize: 48,
    marginBottom: theme.spacing.md
  },
  noDataText: {
    fontSize: theme.fonts.sizes.lg,
    color: theme.colors.white,
    textAlign: 'center',
    opacity: 0.9
  },
  profileContent: {
    alignSelf: 'stretch'
  },
  profileItem: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.md
  },
  profileHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md
  },
  profileSectionName: {
    fontSize: theme.fonts.sizes.md,
    color: theme.colors.white,
    fontWeight: theme.fonts.weights.medium,
    flex: 1
  },
  profileScore: {
    fontSize: theme.fonts.sizes.lg,
    fontWeight: theme.fonts.weights.bold,
    color: theme.colors.white
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: theme.spacing.xs
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4
  },
  percentageText: {
    fontSize: theme.fonts.sizes.xs,
    color: theme.colors.white,
    opacity: 0.8,
    textAlign: 'right'
  },
  insightsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: theme.spacing.lg
  },
  strengthCard: {
    flex: 1,
    backgroundColor: 'rgba(76, 175, 80, 0.2)',
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginRight: theme.spacing.sm,
    alignItems: 'center'
  },
  growthCard: {
    flex: 1,
    backgroundColor: 'rgba(255, 193, 7, 0.2)',
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginLeft: theme.spacing.sm,
    alignItems: 'center'
  },
  insightTitle: {
    fontSize: theme.fonts.sizes.sm,
    fontWeight: theme.fonts.weights.bold,
    color: theme.colors.white,
    marginBottom: theme.spacing.xs,
    textAlign: 'center'
  },
  insightText: {
    fontSize: theme.fonts.sizes.sm,
    color: theme.colors.white,
    textAlign: 'center',
    opacity: 0.9
  },
  motivationalCard: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing.xl,
    marginBottom: theme.spacing.xl,
    alignItems: 'center',
    ...theme.shadows.medium
  },
  motivationalTitle: {
    fontSize: theme.fonts.sizes.xl,
    fontWeight: theme.fonts.weights.bold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.md
  },
  motivationalText: {
    fontSize: theme.fonts.sizes.md,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    lineHeight: 24,
    fontStyle: 'italic'
  }
});
