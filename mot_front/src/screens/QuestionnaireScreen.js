import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  ScrollView, 
  Alert, 
  ActivityIndicator,
  Dimensions
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { theme } from '../styles/theme';
import { getApiUrl } from '../config/api';

const API_URL = getApiUrl();

export default function QuestionnaireScreen({ onGoBack }) {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadQuestions();
  }, []);

  const loadQuestions = async () => {
    try {
      const token = await AsyncStorage.getItem('access_token');
      const response = await fetch(`${API_URL}/api/v1/questions/`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        setQuestions(data);
        
        const initialAnswers = {};
        data.forEach(question => {
          initialAnswers[question.id] = null;
        });
        setAnswers(initialAnswers);
      } else {
        Alert.alert('Oops! 😅', 'No se pudieron cargar las preguntas');
      }
    } catch (e) {
      Alert.alert('Error de conexión 📶', 'Verifica tu internet');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = (questionId, value) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const submitAnswers = async () => {
    const unanswered = questions.filter(q => answers[q.id] === null);
    if (unanswered.length > 0) {
      Alert.alert('¡Casi listo! 🤏', `Te faltan ${unanswered.length} preguntas por responder`);
      return;
    }

    setSubmitting(true);
    try {
      const token = await AsyncStorage.getItem('access_token');
      
      const answersArray = Object.entries(answers).map(([questionId, value]) => ({
        question_id: parseInt(questionId),
        value: value
      }));

      const response = await fetch(`${API_URL}/api/v1/questions/answers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ answers: answersArray })
      });

      if (response.ok) {
        Alert.alert(
          '¡Increíble! 🎉', 
          'Has completado tu perfil de metamotivación. ¡Ahora puedes ver tu progreso personalizado!',
          [{ text: '¡Ver mi progreso! 📈', onPress: onGoBack }]
        );
      } else {
        const errorData = await response.json();
        Alert.alert('Ups! 😕', errorData.detail || 'No se pudieron guardar las respuestas');
      }
    } catch (e) {
      Alert.alert('Error de conexión 📶', 'Intenta de nuevo en un momento');
    } finally {
      setSubmitting(false);
    }
  };

  const likertScale = [
    { value: 1, label: "Totalmente en desacuerdo", emoji: "😤", color: theme.colors.error },
    { value: 2, label: "En desacuerdo", emoji: "😕", color: '#FF8A65' },
    { value: 3, label: "Algo en desacuerdo", emoji: "😐", color: theme.colors.warning },
    { value: 4, label: "Neutral", emoji: "😌", color: '#78909C' },
    { value: 5, label: "Algo de acuerdo", emoji: "🙂", color: '#81C784' },
    { value: 6, label: "De acuerdo", emoji: "😊", color: theme.colors.success },
    { value: 7, label: "Totalmente de acuerdo", emoji: "🤩", color: theme.colors.primary }
  ];

  if (loading) {
    return (
      <LinearGradient
        colors={theme.colors.gradients.primary}
        style={styles.loadingContainer}
      >
        <ActivityIndicator size="large" color={theme.colors.white} />
        <Text style={styles.loadingText}>Cargando tu cuestionario personalizado... ✨</Text>
      </LinearGradient>
    );
  }

  const answeredCount = Object.values(answers).filter(answer => answer !== null).length;
  const totalQuestions = questions.length;
  const progress = totalQuestions > 0 ? (answeredCount / totalQuestions) * 100 : 0;

  return (
    <LinearGradient
      colors={theme.colors.gradients.primary}
      style={styles.container}
    >
      {/* Header con progreso */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onGoBack} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Volver</Text>
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.title}>Cuestionario Personal 📝</Text>
          <Text style={styles.progressText}>
            {answeredCount}/{totalQuestions} completadas ({Math.round(progress)}%)
          </Text>
          <View style={styles.progressBarContainer}>
            <View style={[styles.progressBar, { width: `${progress}%` }]} />
          </View>
        </View>
      </View>

      {/* Escala de referencia */}
      <View style={styles.scaleReference}>
        <Text style={styles.scaleTitle}>🎯 Escala de respuestas:</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scaleScroll}>
          {likertScale.map((item) => (
            <View key={item.value} style={styles.scaleItem}>
              <Text style={styles.scaleEmoji}>{item.emoji}</Text>
              <Text style={styles.scaleValue}>{item.value}</Text>
              <Text style={styles.scaleLabel}>{item.label.split(' ')[0]}</Text>
            </View>
          ))}
        </ScrollView>
      </View>

      {/* Preguntas */}
      <ScrollView style={styles.questionsContainer} showsVerticalScrollIndicator={false}>
        {questions.map((question, index) => (
          <View key={question.id} style={styles.questionCard}>
            <View style={styles.questionHeader}>
              <Text style={styles.questionNumber}>Pregunta {index + 1}</Text>
              <Text style={styles.questionText}>{question.text}</Text>
            </View>
            
            <View style={styles.answersContainer}>
              {likertScale.map(option => (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.answerButton,
                    answers[question.id] === option.value && {
                      backgroundColor: option.color,
                      transform: [{ scale: 1.1 }]
                    }
                  ]}
                  onPress={() => handleAnswer(question.id, option.value)}
                >
                  <Text style={styles.answerEmoji}>{option.emoji}</Text>
                  <Text style={[
                    styles.answerValue,
                    answers[question.id] === option.value && { color: theme.colors.white }
                  ]}>
                    {option.value}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            
            {answers[question.id] && (
              <View style={styles.selectedAnswer}>
                <Text style={styles.selectedAnswerText}>
                  ✓ {likertScale.find(item => item.value === answers[question.id])?.label}
                </Text>
              </View>
            )}
          </View>
        ))}
      </ScrollView>

      {/* Botón de envío */}
      <View style={styles.submitContainer}>
        <TouchableOpacity
          style={[styles.submitButton, (submitting || answeredCount < totalQuestions) && styles.disabledButton]}
          onPress={submitAnswers}
          disabled={submitting || answeredCount < totalQuestions}
        >
          <LinearGradient
            colors={answeredCount === totalQuestions ? theme.colors.gradients.success : ['#6c757d', '#495057']}
            style={styles.submitGradient}
          >
            <Text style={styles.submitButtonText}>
              {submitting ? "🔄 Procesando..." : 
               answeredCount === totalQuestions ? "🚀 ¡Completar Cuestionario!" : 
               `📝 Faltan ${totalQuestions - answeredCount} preguntas`}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
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
    paddingTop: 60,
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.lg
  },
  backButton: {
    alignSelf: 'flex-start',
    padding: theme.spacing.sm,
    marginBottom: theme.spacing.md
  },
  backButtonText: {
    color: theme.colors.white,
    fontSize: theme.fonts.sizes.md,
    fontWeight: theme.fonts.weights.medium
  },
  headerContent: {
    alignItems: 'center'
  },
  title: {
    fontSize: theme.fonts.sizes.xl,
    fontWeight: theme.fonts.weights.bold,
    color: theme.colors.white,
    marginBottom: theme.spacing.sm
  },
  progressText: {
    fontSize: theme.fonts.sizes.md,
    color: theme.colors.white,
    opacity: 0.9,
    marginBottom: theme.spacing.sm
  },
  progressBarContainer: {
    width: '100%',
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 3,
    overflow: 'hidden'
  },
  progressBar: {
    height: '100%',
    backgroundColor: theme.colors.accent,
    borderRadius: 3
  },
  scaleReference: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    marginHorizontal: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.lg
  },
  scaleTitle: {
    fontSize: theme.fonts.sizes.md,
    fontWeight: theme.fonts.weights.bold,
    color: theme.colors.white,
    marginBottom: theme.spacing.sm,
    textAlign: 'center'
  },
  scaleScroll: {
    flexDirection: 'row'
  },
  scaleItem: {
    alignItems: 'center',
    marginRight: theme.spacing.md,
    minWidth: 60
  },
  scaleEmoji: {
    fontSize: 20,
    marginBottom: 2
  },
  scaleValue: {
    fontSize: theme.fonts.sizes.sm,
    fontWeight: theme.fonts.weights.bold,
    color: theme.colors.white,
    marginBottom: 2
  },
  scaleLabel: {
    fontSize: 10,
    color: theme.colors.white,
    opacity: 0.8,
    textAlign: 'center'
  },
  questionsContainer: {
    flex: 1,
    paddingHorizontal: theme.spacing.lg
  },
  questionCard: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    ...theme.shadows.medium
  },
  questionHeader: {
    marginBottom: theme.spacing.lg
  },
  questionNumber: {
    fontSize: theme.fonts.sizes.sm,
    color: theme.colors.primary,
    fontWeight: theme.fonts.weights.bold,
    marginBottom: theme.spacing.xs
  },
  questionText: {
    fontSize: theme.fonts.sizes.lg,
    color: theme.colors.text.primary,
    lineHeight: 26,
    fontWeight: theme.fonts.weights.medium
  },
  answersContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.md
  },
  answerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#E0E0E0'
  },
  answerEmoji: {
    fontSize: 14,
    marginBottom: 2
  },
  answerValue: {
    fontSize: theme.fonts.sizes.xs,
    fontWeight: theme.fonts.weights.bold,
    color: theme.colors.text.primary
  },
  selectedAnswer: {
    backgroundColor: theme.colors.background,
    padding: theme.spacing.sm,
    borderRadius: theme.borderRadius.sm,
    alignItems: 'center'
  },
  selectedAnswerText: {
    fontSize: theme.fonts.sizes.sm,
    color: theme.colors.primary,
    fontWeight: theme.fonts.weights.medium
  },
  submitContainer: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.lg
  },
  submitButton: {
    borderRadius: theme.borderRadius.md,
    overflow: 'hidden',
    ...theme.shadows.medium
  },
  submitGradient: {
    paddingVertical: theme.spacing.lg,
    alignItems: 'center'
  },
  disabledButton: {
    opacity: 0.7
  },
  submitButtonText: {
    color: theme.colors.white,
    fontSize: theme.fonts.sizes.lg,
    fontWeight: theme.fonts.weights.bold
  }
});
