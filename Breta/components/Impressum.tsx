import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import axios from "axios";

export default function Impressum() {
  const [impressumText, setImpressumText] = useState('');

  useEffect(() => {
    const fetchImpressum = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/v1/imprint");
        setImpressumText(response.data.text);
        console.log(impressumText);
      } catch (error) {
        console.error('Fehler beim Abrufen des Impressums:', error);
      }
    };

    fetchImpressum();
  }, []);

  return (
    <View style={styles.container}>
      <Text>Impressum</Text>
      <Text>{impressumText}</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
