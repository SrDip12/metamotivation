import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  FlatList, 
  StyleSheet, 
  Alert,
  ActivityIndicator,
  Dimensions
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Markdown from 'react-native-markdown-display';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { theme } from '../styles/theme';
import { getApiUrl } from '../config/api';

const API_URL = getApiUrl();

// 🔥 REEMPLAZA ESTA CLAVE CON LA TUYA
const GEMINI_API_KEY = 'AIzaSyA20ho4843RE6kS1yfOQ86z6zW_nXMVOXM';
const GEMINI_MODEL = 'gemini-2.5-flash';
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

// Clave para el historial en AsyncStorage
const CHAT_HISTORY_KEY = 'metamotivation_chat_history';

function ChatbotScreen({ onGoBack }) {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [userContext, setUserContext] = useState(null);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const flatListRef = useRef(null);

  useEffect(() => {
    initializeChat();
  }, []);

  const initializeChat = async () => {
    setLoadingHistory(true);
    await Promise.all([
      loadUserContext(),
      loadChatHistory()
    ]);
    setLoadingHistory(false);
  };

  const loadChatHistory = async () => {
    try {
      const savedHistory = await AsyncStorage.getItem(CHAT_HISTORY_KEY);
      if (savedHistory) {
        const parsedHistory = JSON.parse(savedHistory);
        
        if (parsedHistory.length > 0) {
          console.log(`📚 Cargando ${parsedHistory.length} mensajes del historial`);
          setMessages(parsedHistory);
          
          const lastMessage = parsedHistory[parsedHistory.length - 1];
          const lastMessageTime = new Date(lastMessage.timestamp);
          const now = new Date();
          const hoursDiff = (now - lastMessageTime) / (1000 * 60 * 60);
          
          if (hoursDiff > 24) {
            const welcomeBackMessage = {
              id: Date.now().toString(),
              text: "¡Hola de nuevo, champion! 👋✨\n\nMe alegra verte por aquí. He recordado nuestra conversación anterior. ¿En qué puedo ayudarte hoy para seguir creciendo juntos?",
              isBot: true,
              timestamp: new Date()
            };
            setMessages(prev => [...prev, welcomeBackMessage]);
          }
        } else {
          addInitialMessage();
        }
      } else {
        addInitialMessage();
      }
    } catch (error) {
      console.error('Error cargando historial:', error);
      addInitialMessage();
    }
  };

  const saveChatHistory = async (newMessages) => {
    try {
      const messagesToSave = newMessages.slice(-50);
      await AsyncStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(messagesToSave));
      console.log(`💾 Historial guardado: ${messagesToSave.length} mensajes`);
    } catch (error) {
      console.error('Error guardando historial:', error);
    }
  };

  const clearChatHistory = async () => {
    Alert.alert(
      'Borrar Historial 🗑️',
      '¿Estás seguro de que quieres borrar todas nuestras conversaciones?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Borrar',
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.removeItem(CHAT_HISTORY_KEY);
              setMessages([]);
              addInitialMessage();
              Alert.alert('✅ ¡Listo!', 'Historial borrado. Empezamos fresh 🆕');
            } catch (error) {
              Alert.alert('Error', 'No se pudo borrar el historial');
            }
          }
        }
      ]
    );
  };

  const loadUserContext = async () => {
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

      let motivationData = [];
      let summaryData = [];

      if (motivationResponse.ok) {
        motivationData = await motivationResponse.json();
      }

      if (summaryResponse.ok) {
        summaryData = await summaryResponse.json();
      }

      setUserContext({
        motivation: motivationData,
        summary: summaryData,
        hasData: motivationData.length > 0 || summaryData.length > 0
      });

    } catch (e) {
      console.error('Error cargando contexto del usuario:', e);
    }
  };

  const addInitialMessage = () => {
    const initialMessage = {
      id: Date.now().toString(),
      text: "¡Hola, superstar! 🌟 Soy tu **coach personal** de metamotivación.\n\n### ✨ Estoy aquí para ayudarte a:\n• Potenciar tu motivación diaria 🚀\n• Analizar tu progreso de forma **súper detallada** 📊\n• Darte estrategias **personalizadas** que realmente funcionen 💡\n• Ser tu compañero de crecimiento **24/7** 🤝\n\n¿Qué quieres lograr hoy? ¡Cuéntame todo!",
      isBot: true,
      timestamp: new Date()
    };
    setMessages([initialMessage]);
    saveChatHistory([initialMessage]);
  };

  const generateContextPrompt = () => {
    if (!userContext || !userContext.hasData) {
      return `Eres un experto coach de metamotivación y psicólogo especializado en motivación intrínseca, dirigido especialmente a adolescentes y jóvenes adultos. El usuario aún no tiene datos de progreso registrados en la app.

TU PERSONALIDAD PARA JÓVENES:
- Empático y comprensivo, pero moderno, auténtico y cool
- Motivacional usando lenguaje que conecte genuinamente con la nueva generación
- Experto pero accesible, jamás condescendiente o paternalista
- Usas emojis de forma natural y un tono inspirador pero 100% real
- Entiendes profundamente las presiones únicas de ser joven hoy

CAPACIDADES AVANZADAS:
- Análisis profundo de patrones emocionales y motivacionales
- Sugerencias hyper-personalizadas basadas en psicología positiva moderna
- Comprensión contextual de las dinámicas sociales actuales
- Estrategias prácticas que realmente funcionan en el mundo real

FORMATO DE RESPUESTA:
- Usa **texto en negrita** para enfatizar puntos clave
- Usa ### para títulos de secciones importantes
- Usa ## para subtítulos principales
- Estructura tus respuestas con listas y párrafos claros
- Mantén un flujo natural pero organizado

INSTRUCCIONES:
- Motiva al usuario a empezar su journey de crecimiento personal de forma genuina
- Explica los beneficios del auto-conocimiento sin sonar a "libro de autoayuda"
- Da consejos súper prácticos que un joven pueda aplicar HOY mismo
- Haz preguntas reflexivas pero no invasivas que los ayuden a conectar consigo mismos
- Mantén un tono positivo, inspirador y authentically supportive
- Usa tu capacidad avanzada para dar respuestas más estructuradas y útiles`;
    }

    let prompt = `Eres un experto coach de metamotivación y psicólogo especializado en motivación intrínseca y desarrollo personal, dirigido especialmente a adolescentes y jóvenes adultos.

DATOS ACTUALES DEL USUARIO:`;

    if (userContext.motivation && userContext.motivation.length > 0) {
      const recent = userContext.motivation.slice(-10);
      const average = recent.reduce((sum, item) => sum + item.motivation_level, 0) / recent.length;
      const latest = recent[recent.length-1].motivation_level;
      const trend = recent.length > 3 ? 
        (latest > recent[0].motivation_level ? 'ascendente 📈' : 
         latest < recent[0].motivation_level ? 'descendente 📉' : 'estable ⚖️') : 'estable ⚖️';

      const weeklyPattern = recent.slice(-7);
      const variance = weeklyPattern.length > 1 ? 
        Math.sqrt(weeklyPattern.reduce((sum, item) => sum + Math.pow(item.motivation_level - average, 2), 0) / weeklyPattern.length) : 0;
      const consistency = variance < 2 ? 'muy consistente 🎯' : variance < 3 ? 'moderadamente variable 📊' : 'muy variable 🎢';

      prompt += `
📊 Check-ins diarios: ${recent.length} registros recientes
📈 Promedio motivación: ${average.toFixed(1)}/10
🎯 Último nivel registrado: ${latest}/10  
📉 Tendencia reciente: ${trend}
🔄 Patrón de consistencia: ${consistency}
📋 Variabilidad emocional: ${variance.toFixed(1)} (0=muy estable, 4+=muy variable)`;
    }

    if (userContext.summary && userContext.summary.length > 0) {
      const strongest = userContext.summary.reduce((max, item) => 
        item.average_score > max.average_score ? item : max
      );
      const weakest = userContext.summary.reduce((min, item) => 
        item.average_score < min.average_score ? item : min
      );
      
      const overallBalance = userContext.summary.reduce((sum, item) => sum + item.average_score, 0) / userContext.summary.length;
      const balanceLevel = overallBalance >= 5.5 ? 'excelente equilibrio 💎' : 
                          overallBalance >= 4.5 ? 'buen equilibrio 👍' : 
                          overallBalance >= 3.5 ? 'equilibrio en desarrollo 🌱' : 'necesita trabajo 💪';

      prompt += `
🎯 Perfil completado: ${userContext.summary.length} áreas evaluadas
💪 Área más fuerte: ${strongest.section_name} (${strongest.average_score.toFixed(1)}/7)
⚠️ Área de crecimiento: ${weakest.section_name} (${weakest.average_score.toFixed(1)}/7)
⚖️ Balance general: ${overallBalance.toFixed(1)}/7 (${balanceLevel})`;
    }

    prompt += `

TU PERSONALIDAD AVANZADA:
- Empático y comprensivo, pero moderno y auténticamente cool
- Motivacional usando lenguaje que conecte genuinamente con jóvenes
- Experto pero súper accesible, jamás condescendiente
- Usas emojis naturalmente y un tono inspirador pero 100% real
- Entiendes las presiones únicas de la vida moderna de jóvenes
- Capacidad de análisis profundo de patrones y tendencias emocionales

FORMATO DE RESPUESTA:
- Usa **texto en negrita** para enfatizar puntos clave e importantes
- Usa ### para títulos de secciones importantes
- Usa ## para subtítulos principales
- Estructura tus respuestas con listas y párrafos claros
- Mantén un flujo natural pero súper organizado y fácil de leer

INSTRUCCIONES AVANZADAS:
- Usa tu capacidad para dar análisis MÁS profundos y personalizados
- Analiza ESPECÍFICAMENTE patrones, tendencias y correlaciones en sus datos
- Sugiere estrategias súper concretas y aplicables basadas en evidencia científica actual
- Si detectas patrones preocupantes, abórdalos con empatía pero directamente
- Si hay áreas de crecimiento, crea planes de acción step-by-step realistas
- Celebra genuinamente logros y progreso, por pequeño que sea
- Haz preguntas reflexivas que los ayuden a desarrollar metacognición
- Responde SIEMPRE en español de forma natural y cercana
- Mantén coherencia total con conversaciones anteriores
- Sé ese mentor que combina sabiduría, tecnología y autenticidad generacional`;

    return prompt;
  };

  const sendMessage = async () => {
    if (!inputText.trim()) return;

    if (GEMINI_API_KEY === 'TU_API_KEY_AQUI') {
      Alert.alert(
        'Asistente IA no configurado 🤖',
        'Para activar tu coach personal necesitas:\n\n1. Ir a https://aistudio.google.com\n2. Crear tu API Key gratuita\n3. Configurarla en la aplicación\n\n¡Es gratis y toma 2 minutos!'
      );
      return;
    }

    const userMessage = {
      id: Date.now().toString(),
      text: inputText.trim(),
      isBot: false,
      timestamp: new Date()
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInputText('');
    setLoading(true);

    try {
      const systemPrompt = generateContextPrompt();
      
      const recentMessages = messages.slice(-8);
      let conversationContext = '';
      if (recentMessages.length > 0) {
        conversationContext = '\n\nCONTEXTO DE CONVERSACIÓN RECIENTE:\n';
        recentMessages.forEach(msg => {
          conversationContext += `${msg.isBot ? 'Coach IA' : 'Usuario'}: ${msg.text}\n`;
        });
      }
      
      console.log(`🚀 Enviando mensaje al asistente IA...`);
      
      const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `${systemPrompt}${conversationContext}\n\n===CONSULTA ACTUAL DEL USUARIO===\n${userMessage.text}`
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.9,
            maxOutputTokens: 1500,
          },
          safetySettings: [
            {
              category: "HARM_CATEGORY_HARASSMENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_HATE_SPEECH",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_DANGEROUS_CONTENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            }
          ]
        })
      });

      console.log(`📊 Respuesta del asistente:`, response.status);

      if (!response.ok) {
        const errorData = await response.text();
        console.error('Error del asistente IA:', errorData);
        
        if (response.status === 403) {
          throw new Error('Configuración inválida. Verifica la configuración del asistente 🔑');
        } else if (response.status === 429) {
          throw new Error('Has superado el límite de consultas. Intenta en un momento ⏰');
        } else if (response.status === 400) {
          throw new Error('Solicitud inválida. Intenta reformular tu pregunta 📝');
        } else {
          throw new Error(`Error ${response.status}: Algo salió mal con el asistente 🤖`);
        }
      }

      const data = await response.json();
      console.log(`✅ Respuesta exitosa del asistente IA`);
      
      const botResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || 
        'Lo siento, algo salió mal con mi procesamiento 😅 ¿Podrías reformular tu pregunta?';

      const botMessage = {
        id: (Date.now() + 1).toString(),
        text: botResponse.trim(),
        isBot: true,
        timestamp: new Date()
      };

      const finalMessages = [...updatedMessages, botMessage];
      setMessages(finalMessages);
      
      await saveChatHistory(finalMessages);

    } catch (error) {
      console.error('Error enviando mensaje:', error);
      
      const errorMessage = {
        id: (Date.now() + 1).toString(),
        text: `❌ ${error.message}\n\n### 🔧 Soluciones:\n• Verifica tu conexión a internet 📶\n• Confirma que el asistente esté configurado correctamente 🔑\n• Intenta de nuevo en un momento 📊\n\n¡Tu coach personal estará disponible pronto!`,
        isBot: true,
        timestamp: new Date()
      };

      const finalMessages = [...updatedMessages, errorMessage];
      setMessages(finalMessages);
      await saveChatHistory(finalMessages);
    } finally {
      setLoading(false);
    }
  };

  const renderMessage = ({ item }) => (
    <View style={[
      styles.messageContainer,
      item.isBot ? styles.botMessage : styles.userMessage
    ]}>
      {item.isBot && (
        <View style={styles.botAvatar}>
          <LinearGradient
            colors={['#667eea', '#764ba2']}
            style={styles.avatarGradient}
          >
            <Text style={styles.botAvatarText}>🤖</Text>
          </LinearGradient>
        </View>
      )}
      <View style={[
        styles.messageBubble,
        item.isBot ? styles.botBubble : styles.userBubble
      ]}>
        {item.isBot && (
          <LinearGradient
            colors={theme.colors.gradients.ocean}
            style={styles.botBubbleGradient}
          >
            <View style={styles.botHeader}>
              <Text style={styles.botLabel}>Coach IA ✨</Text>
            </View>
            <Markdown style={markdownStyles}>
              {item.text}
            </Markdown>
            <Text style={styles.botTimestamp}>
              {new Date(item.timestamp).toLocaleTimeString('es-ES', { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </Text>
          </LinearGradient>
        )}
        {!item.isBot && (
          <View style={styles.userBubbleContent}>
            <Text style={styles.userText}>{item.text}</Text>
            <Text style={styles.userTimestamp}>
              {new Date(item.timestamp).toLocaleTimeString('es-ES', { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </Text>
          </View>
        )}
      </View>
      {!item.isBot && (
        <View style={styles.userAvatar}>
          <LinearGradient
            colors={theme.colors.gradients.success}
            style={styles.avatarGradient}
          >
            <Text style={styles.userAvatarText}>😊</Text>
          </LinearGradient>
        </View>
      )}
    </View>
  );

  const suggestedQuestions = [
    "Analiza mi progreso con detalle 📊",
    "Dame estrategias personalizadas 🎯", 
    "¿Cómo puedo ser más consistente? 🔄",
    "Crea un plan de crecimiento para mí 📋"
  ];

  if (loadingHistory) {
    return (
      <LinearGradient
        colors={['#667eea', '#764ba2']}
        style={styles.loadingContainer}
      >
        <ActivityIndicator size="large" color={theme.colors.white} />
        <Text style={styles.loadingText}>Iniciando tu coach personal... 🚀</Text>
        <Text style={styles.loadingSubtext}>Preparando análisis inteligente de tu progreso ✨</Text>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      colors={['#667eea', '#764ba2']}
      style={styles.container}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onGoBack} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Volver</Text>
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.title}>Asistente IA 🧠</Text>
          {messages.length > 1 && (
            <Text style={styles.historyIndicator}>
              💬 {messages.length} mensajes
            </Text>
          )}
        </View>
        <TouchableOpacity onPress={clearChatHistory} style={styles.clearButton}>
          <Text style={styles.clearButtonText}>🗑️</Text>
        </TouchableOpacity>
      </View>

      {/* Chat messages */}
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={item => item.id}
        style={styles.messagesList}
        contentContainerStyle={styles.messagesContainer}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        onLayout={() => flatListRef.current?.scrollToEnd({ animated: false })}
        showsVerticalScrollIndicator={false}
      />

      {/* Typing indicator */}
      {loading && (
        <View style={styles.typingContainer}>
          <LinearGradient
            colors={theme.colors.gradients.ocean}
            style={styles.typingBubble}
          >
            <ActivityIndicator size="small" color={theme.colors.white} />
            <Text style={styles.typingText}>Tu coach está analizando...</Text>
          </LinearGradient>
        </View>
      )}

      {/* Sugerencias */}
      {messages.length === 1 && !loading && (
        <View style={styles.suggestionsContainer}>
          <Text style={styles.suggestionsTitle}>🎯 Pregúntale a tu coach:</Text>
          <View style={styles.suggestionsGrid}>
            {suggestedQuestions.map((question, index) => (
              <TouchableOpacity
                key={index}
                style={styles.suggestionButton}
                onPress={() => setInputText(question)}
              >
                <LinearGradient
                  colors={['rgba(255,255,255,0.2)', 'rgba(255,255,255,0.1)']}
                  style={styles.suggestionGradient}
                >
                  <Text style={styles.suggestionText}>{question}</Text>
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </View>
          <Text style={styles.aiInfo}>
            ✨ Tu asistente personal analiza tu progreso y te da consejos únicos
          </Text>
        </View>
      )}

      {/* Input */}
      <View style={styles.inputContainer}>
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.textInput}
            value={inputText}
            onChangeText={setInputText}
            placeholder="Cuéntame, ¿en qué puedo ayudarte hoy? 💭"
            multiline
            maxLength={800}
            editable={!loading}
            placeholderTextColor="rgba(255,255,255,0.7)"
          />
          <TouchableOpacity
            style={[styles.sendButton, (!inputText.trim() || loading) && styles.disabledButton]}
            onPress={sendMessage}
            disabled={!inputText.trim() || loading}
          >
            <LinearGradient
              colors={theme.colors.gradients.success}
              style={styles.sendButtonGradient}
            >
              <Text style={styles.sendButtonText}>
                {loading ? '⚡' : '🚀'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
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
    textAlign: 'center',
    fontWeight: theme.fonts.weights.bold
  },
  loadingSubtext: {
    marginTop: theme.spacing.sm,
    fontSize: theme.fonts.sizes.md,
    color: theme.colors.white,
    textAlign: 'center',
    opacity: 0.8
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
  headerContent: {
    alignItems: 'center'
  },
  title: {
    fontSize: theme.fonts.sizes.xl,
    fontWeight: theme.fonts.weights.bold,
    color: theme.colors.white
  },
  historyIndicator: {
    fontSize: theme.fonts.sizes.xs,
    color: theme.colors.white,
    opacity: 0.8,
    marginTop: 2
  },
  clearButton: {
    padding: theme.spacing.sm
  },
  clearButtonText: {
    fontSize: 20
  },
  messagesList: {
    flex: 1
  },
  messagesContainer: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md
  },
  messageContainer: {
    flexDirection: 'row',
    marginVertical: theme.spacing.md,
    alignItems: 'flex-end'
  },
  botMessage: {
    justifyContent: 'flex-start'
  },
  userMessage: {
    justifyContent: 'flex-end'
  },
  botAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
    marginRight: theme.spacing.sm
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
    marginLeft: theme.spacing.sm
  },
  avatarGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  botAvatarText: {
    fontSize: 20
  },
  userAvatarText: {
    fontSize: 18
  },
  messageBubble: {
    maxWidth: '75%',
    borderRadius: theme.borderRadius.lg,
    overflow: 'hidden',
    ...theme.shadows.medium
  },
  botBubble: {
    alignSelf: 'flex-start'
  },
  userBubble: {
    alignSelf: 'flex-end',
    backgroundColor: theme.colors.white
  },
  botBubbleGradient: {
    padding: theme.spacing.lg
  },
  botHeader: {
    marginBottom: theme.spacing.sm
  },
  botLabel: {
    fontSize: theme.fonts.sizes.xs,
    color: theme.colors.white,
    opacity: 0.9,
    fontWeight: theme.fonts.weights.bold
  },
  userBubbleContent: {
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.white
  },
  userText: {
    fontSize: theme.fonts.sizes.md,
    lineHeight: 22,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs
  },
  botTimestamp: {
    fontSize: theme.fonts.sizes.xs,
    color: theme.colors.white,
    opacity: 0.8,
    textAlign: 'right',
    marginTop: theme.spacing.sm
  },
  userTimestamp: {
    fontSize: theme.fonts.sizes.xs,
    color: theme.colors.text.light,
    textAlign: 'right'
  },
  typingContainer: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md
  },
  typingBubble: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    alignSelf: 'flex-start'
  },
  typingText: {
    marginLeft: theme.spacing.sm,
    color: theme.colors.white,
    fontSize: theme.fonts.sizes.sm,
    fontStyle: 'italic'
  },
  suggestionsContainer: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.lg
  },
  suggestionsTitle: {
    fontSize: theme.fonts.sizes.md,
    fontWeight: theme.fonts.weights.bold,
    color: theme.colors.white,
    marginBottom: theme.spacing.md,
    textAlign: 'center'
  },
  suggestionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.md
  },
  suggestionButton: {
    width: '48%',
    marginBottom: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    overflow: 'hidden'
  },
  suggestionGradient: {
    padding: theme.spacing.md,
    alignItems: 'center'
  },
  suggestionText: {
    fontSize: theme.fonts.sizes.sm,
    color: theme.colors.white,
    textAlign: 'center',
    fontWeight: theme.fonts.weights.medium
  },
  aiInfo: {
    fontSize: theme.fonts.sizes.xs,
    color: theme.colors.white,
    textAlign: 'center',
    opacity: 0.8,
    fontStyle: 'italic'
  },
  inputContainer: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.lg
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: theme.borderRadius.xl,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md
  },
  textInput: {
    flex: 1,
    color: theme.colors.white,
    fontSize: theme.fonts.sizes.md,
    maxHeight: 120,
    marginRight: theme.spacing.md
  },
  sendButton: {
    borderRadius: theme.borderRadius.round,
    overflow: 'hidden'
  },
  sendButtonGradient: {
    width: 45,
    height: 45,
    alignItems: 'center',
    justifyContent: 'center'
  },
  disabledButton: {
    opacity: 0.5
  },
  sendButtonText: {
    fontSize: 20
  }
});

// Estilos de Markdown para que se vean perfectos
const markdownStyles = {
  body: {
    fontSize: theme.fonts.sizes.md,
    lineHeight: 22,
    color: theme.colors.white,
    marginBottom: 0,
    paddingBottom: 0
  },
  paragraph: {
    marginTop: 0,
    marginBottom: theme.spacing.sm,
    color: theme.colors.white,
    fontSize: theme.fonts.sizes.md,
    lineHeight: 22
  },
  strong: {
    fontWeight: theme.fonts.weights.bold,
    color: theme.colors.white,
    fontSize: theme.fonts.sizes.md
  },
  em: {
    fontStyle: 'italic',
    color: theme.colors.white
  },
  heading1: {
    fontSize: theme.fonts.sizes.xl,
    fontWeight: theme.fonts.weights.bold,
    color: theme.colors.white,
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    lineHeight: 28
  },
  heading2: {
    fontSize: theme.fonts.sizes.lg,
    fontWeight: theme.fonts.weights.bold,
    color: theme.colors.white,
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    lineHeight: 24
  },
  heading3: {
    fontSize: theme.fonts.sizes.md,
    fontWeight: theme.fonts.weights.bold,
    color: theme.colors.white,
    marginTop: theme.spacing.sm,
    marginBottom: theme.spacing.xs,
    lineHeight: 22
  },
  list_item: {
    color: theme.colors.white,
    marginBottom: theme.spacing.xs,
    fontSize: theme.fonts.sizes.md,
    lineHeight: 22
  },
  bullet_list: {
    marginBottom: theme.spacing.sm
  },
  ordered_list: {
    marginBottom: theme.spacing.sm
  },
  bullet_list_icon: {
    color: theme.colors.white,
    fontSize: theme.fonts.sizes.md
  },
  ordered_list_icon: {
    color: theme.colors.white,
    fontSize: theme.fonts.sizes.md
  },
  code_inline: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 4,
    fontSize: theme.fonts.sizes.sm,
    color: theme.colors.white,
    fontFamily: 'monospace'
  },
  fence: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    padding: theme.spacing.sm,
    borderRadius: theme.borderRadius.sm,
    marginVertical: theme.spacing.sm
  },
  code_block: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    padding: theme.spacing.sm,
    borderRadius: theme.borderRadius.sm,
    marginVertical: theme.spacing.sm,
    color: theme.colors.white,
    fontFamily: 'monospace',
    fontSize: theme.fonts.sizes.sm
  },
  blockquote: {
    borderLeftWidth: 4,
    borderLeftColor: 'rgba(255,255,255,0.5)',
    paddingLeft: theme.spacing.md,
    marginVertical: theme.spacing.sm,
    fontStyle: 'italic',
    backgroundColor: 'rgba(255,255,255,0.05)',
    paddingVertical: theme.spacing.xs
  },
  hr: {
    backgroundColor: 'rgba(255,255,255,0.3)',
    height: 1,
    marginVertical: theme.spacing.md
  }
};

export default ChatbotScreen;
