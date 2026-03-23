import { useState } from 'react';
import { View, Button, Text, StyleSheet, Image, Alert, ScrollView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

export default function UploadScreen() {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [parsedNotes, setParsedNotes] = useState<string[]>([]);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 1,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setImageUri(uri);
      setParsedNotes([]);
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission required', 'Camera access is needed to take a photo.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ['images'],
      quality: 1,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setImageUri(uri);
      setParsedNotes([]);
    }
  };

  const fakeParseSheetMusic = () => {
    if (!imageUri) {
      Alert.alert('No image selected', 'Please choose a sheet music image first.');
      return;
    }

    // Platzhalter: später echte Notenerkennung
    setParsedNotes(['C4', 'D4', 'E4', 'F4', 'G4']);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.badge}>SILENTSAX</Text>
      <Text style={styles.title}>Upload Sheet Music</Text>
      <Text style={styles.subtitle}>
        Choose an image of sheet music, then simulate note extraction.
      </Text>

      <View style={styles.buttonGroup}>
        <Button title="Pick Image from Library" onPress={pickImage} />
      </View>
      <View style={styles.buttonGroup}>
        <Button title="Take Photo" onPress={takePhoto} />
      </View>

      {imageUri ? (
        <View style={styles.previewSection}>
          <Text style={styles.sectionTitle}>Selected Image</Text>
          <Image source={{ uri: imageUri }} style={styles.previewImage} />
          <View style={styles.buttonGroup}>
            <Button title="Parse Notes" onPress={fakeParseSheetMusic} />
          </View>
        </View>
      ) : (
        <Text style={styles.placeholder}>No sheet music image selected yet.</Text>
      )}

      {parsedNotes.length > 0 && (
        <View style={styles.notesSection}>
          <Text style={styles.sectionTitle}>Parsed Notes</Text>
          {parsedNotes.map((note, index) => (
            <View key={`${note}-${index}`} style={styles.noteRow}>
              <Text style={styles.noteText}>
                {index + 1}. {note}
              </Text>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 24,
    backgroundColor: '#111827',
    alignItems: 'center',
  },
  badge: {
    fontSize: 14,
    color: '#93c5fd',
    marginTop: 24,
    marginBottom: 12,
    fontWeight: '700',
    letterSpacing: 1,
  },
  title: {
    fontSize: 28,
    marginBottom: 12,
    color: '#ffffff',
    fontWeight: '700',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 24,
    color: '#d1d5db',
    textAlign: 'center',
    maxWidth: 340,
  },
  buttonGroup: {
    width: '100%',
    marginBottom: 20,
  },
  previewSection: {
    width: '100%',
    alignItems: 'center',
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 20,
    color: '#ffffff',
    fontWeight: '600',
    marginBottom: 12,
  },
  previewImage: {
    width: 280,
    height: 380,
    borderRadius: 12,
    marginBottom: 16,
    resizeMode: 'contain',
    backgroundColor: '#1f2937',
  },
  placeholder: {
    color: '#9ca3af',
    fontSize: 15,
    marginTop: 20,
  },
  notesSection: {
    width: '100%',
    marginTop: 24,
    backgroundColor: '#1f2937',
    borderRadius: 12,
    padding: 16,
  },
  noteRow: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
  },
  noteText: {
    color: '#f9fafb',
    fontSize: 16,
  },
});
