import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { getApiUrl } from '../config/api';
const API_URL = getApiUrl();

export default function DashboardScreen({ onLogout }) {
  const [message, setMessage] = useState('Conectando...');
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    const fetchData = async () => {
      const token = await AsyncStorage.getItem('access_token');
      try {
        const response = await fetch(`${API_URL}/api/v1/dashboard/motivation-history`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (response.ok) {
          const data = await response.json();
          console.log('Datos recibidos:', data);
          
          if (data.length === 0) {
            setMessage('✅ Conexión exitosa, pero no tienes datos aún.\n\n📝 Realiza tu primer check-in diario para generar gráficas.');
            setStatus('no-data');
          } else {
            setMessage(`✅ ¡Perfecto! Tienes ${data.length} registros de motivación.`);
            setStatus('success');
          }
        } else {
          setMessage(`❌ Error del servidor: ${response.status}`);
          setStatus('error');
        }
      } catch (e) {
        setMessage(`❌ Error de conexión: ${e.message}`);
        setStatus('error');
      }
    };
    
    fetchData();
  }, []);

  const handleLogout = async () => {
    await AsyncStorage.removeItem('access_token');
    onLogout();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Dashboard</Text>
      
      <Text style={[
        styles.message, 
        status === 'success' ? styles.successText : 
        status === 'error' ? styles.errorText : styles.infoText
      ]}>
        {message}
      </Text>
      
      {status === 'no-data' && (
        <View style={styles.instructionBox}>
          <Text style={styles.instructionTitle}>¿Cómo crear tu primer registro?</Text>
          <Text style={styles.instructionText}>
            1. Ve a http://TU_IP:8000/docs en tu navegador{'\n'}
            2. Autorízate con tu token{'\n'}
            3. Usa el endpoint POST /api/v1/check-in/{'\n'}
            4. Crea registros con motivation_level del 1 al 10
          </Text>
        </View>
      )}
      
      <Button title="Cerrar Sesión" onPress={handleLogout} color="red" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 30 },
  message: { fontSize: 16, textAlign: 'center', marginBottom: 30, lineHeight: 24 },
  successText: { color: '#28a745' },
  errorText: { color: '#dc3545' },
  infoText: { color: '#007bff' },
  instructionBox: { 
    backgroundColor: '#f8f9fa', 
    padding: 15, 
    borderRadius: 8, 
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#007bff'
  },
  instructionTitle: { fontWeight: 'bold', marginBottom: 10, color: '#495057' },
  instructionText: { color: '#6c757d', lineHeight: 20 }
});
