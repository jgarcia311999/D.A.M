import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, FlatList, ActivityIndicator, TextInput, Modal, Alert, Platform } from 'react-native';
// Si no tienes instalado react-native-gesture-handler, instálalo con: npm install react-native-gesture-handler
// import { Swipeable } from 'react-native-gesture-handler';
// Si no tienes instalado @react-native-picker/picker, instálalo con: npm install @react-native-picker/picker
import { Picker } from '@react-native-picker/picker';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import * as Haptics from 'expo-haptics';
import { collection, getDocs, doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { db } from '../utils/firebaseConfig';

export default function TodasLasFrasesScreen() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const [frases, setFrases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showSearch, setShowSearch] = useState(false);
  const [searchText, setSearchText] = useState('');
  // orderType puede ser: 'nuevas', 'antiguas', 'az', 'za', 'mostradas', 'no_mostradas'
  const [orderType, setOrderType] = useState('nuevas');
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedFrase, setSelectedFrase] = useState(null);
  const [editMode, setEditMode] = useState(false);
  // Estados para edición
  const [editFrase, setEditFrase] = useState('');
  const [editTipo, setEditTipo] = useState('');
  const [editCastigo, setEditCastigo] = useState('');
  const [editVisible, setEditVisible] = useState(true);

  // Fetch frases from Firestore
  const fetchFrases = useCallback(async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, 'frases'));
      const frasesList = querySnapshot.docs.map(doc => {
        const data = doc.data();
        let ts = 0;
        if (data.timestamp) {
          if (typeof data.timestamp === 'object') {
            if (typeof data.timestamp.toMillis === 'function') {
              ts = data.timestamp.toMillis();
            } else if ('seconds' in data.timestamp) {
              ts = data.timestamp.seconds * 1000;
            }
          } else if (typeof data.timestamp === 'number') {
            ts = data.timestamp;
          }
        }
        return { id: doc.id, ...data, timestamp: ts };
      });
      setFrases(frasesList);
    } catch (error) {
      console.error('Error fetching frases:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Refrescar frases (igual que fetchFrases)
  const refrescarFrases = useCallback(async () => {
    await fetchFrases();
  }, [fetchFrases]);

  useEffect(() => {
    fetchFrases();
  }, [fetchFrases]);

  const styles = {
    tuFraseBtn: {
      backgroundColor: '#E2D6FF',
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 8,
      marginLeft: 8
    },
    tuFraseBtnText: {
      color: '#fff',
      fontFamily: 'Panchang-Bold',
      fontSize: 16
    },
    fraseText: {
      fontSize: 16,
      marginVertical: 8
    },
    fraseContainer: {
      backgroundColor: '#fff',
      borderRadius: 10,
      padding: 16,
      marginBottom: 12,
      shadowColor: '#000',
      shadowOpacity: 0.07,
      shadowOffset: { width: 0, height: 2 },
      shadowRadius: 6,
      elevation: 2,
    },
    searchInput: {
      flex: 1,
      backgroundColor: '#fff',
      borderRadius: 8,
      paddingHorizontal: 12,
      paddingVertical: 6,
      fontSize: 16,
      color: '#000',
      fontFamily: 'Panchang-Bold',
    },
    searchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#E2D6FF',
      borderRadius: 8,
      paddingHorizontal: 8,
      flex: 1,
      marginLeft: 8,
    },
    filterMenu: {
      position: 'absolute',
      top: insets.top + 60,
      right: 16,
      backgroundColor: '#fff',
      borderRadius: 8,
      padding: 8,
      shadowColor: '#000',
      shadowOpacity: 0.1,
      shadowOffset: { width: 0, height: 2 },
      shadowRadius: 4,
      elevation: 5,
      zIndex: 10,
    },
    filterOption: {
      paddingVertical: 8,
      paddingHorizontal: 12,
    },
    filterOptionText: {
      fontSize: 16,
      color: '#5E1DE6',
      fontFamily: 'Panchang-Bold',
    },
  };

  const filteredFrases = searchText.trim() === '' ? frases : frases.filter(f => f.frase.toLowerCase().includes(searchText.toLowerCase()));

  let orderedFrases = [...filteredFrases];
  if (orderType === 'mostradas') {
    orderedFrases = orderedFrases.filter(f => f.visible === true);
  } else if (orderType === 'no_mostradas') {
    orderedFrases = orderedFrases.filter(f => f.visible !== true);
  } else if (orderType === 'nuevas') {
    // Assuming id is string, try to sort by timestamp if available, else by id descending
    orderedFrases.sort((a, b) => {
      if (a.timestamp && b.timestamp) {
        return b.timestamp - a.timestamp;
      }
      // fallback to id descending (assuming id can be compared as string)
      if (a.id < b.id) return 1;
      if (a.id > b.id) return -1;
      return 0;
    });
  } else if (orderType === 'antiguas') {
    orderedFrases.sort((a, b) => {
      if (a.timestamp && b.timestamp) {
        return a.timestamp - b.timestamp;
      }
      if (a.id < b.id) return -1;
      if (a.id > b.id) return 1;
      return 0;
    });
  } else if (orderType === 'az') {
    orderedFrases.sort((a, b) => a.frase.localeCompare(b.frase));
  } else if (orderType === 'za') {
    orderedFrases.sort((a, b) => b.frase.localeCompare(a.frase));
  }

  return (
    <>
      <View style={{ position: 'absolute', top: insets.top + 10, left: 16, right: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', zIndex: 10, pointerEvents: 'auto' }}>
        <TouchableOpacity
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            navigation.goBack();
          }}
        >
          <Ionicons name="arrow-back" size={28} color="#5E1DE6" />
        </TouchableOpacity>
        {/* Header center: search input si está abierto */}
        {showSearch ? (
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Buscar..."
              placeholderTextColor="#5E1DE6"
              value={searchText}
              onChangeText={setSearchText}
              autoFocus
              clearButtonMode="never"
            />
            <TouchableOpacity onPress={() => { setShowSearch(false); setSearchText(''); }} style={{ paddingHorizontal: 8 }}>
              <Ionicons name="close" size={28} color="#5E1DE6" />
            </TouchableOpacity>
          </View>
        ) : <View style={{ flex: 1 }} />}
        {/* Header right: SIEMPRE los botones de search, filter y refresh */}
        <View style={{ flexDirection: 'row', marginLeft: 8 }}>
          <TouchableOpacity style={{ paddingHorizontal: 8 }} onPress={() => setShowSearch(true)}>
            <Ionicons name="search" size={28} color="#5E1DE6" />
          </TouchableOpacity>
          <TouchableOpacity style={{ paddingHorizontal: 8 }} onPress={() => setShowFilterMenu(!showFilterMenu)}>
            <Ionicons name="filter" size={28} color="#5E1DE6" />
          </TouchableOpacity>
          <TouchableOpacity
            style={{ paddingHorizontal: 8, alignItems: 'center', justifyContent: 'center' }}
            onPress={refrescarFrases}
            disabled={loading}
            accessibilityLabel="Recargar frases"
          >
            {loading ? (
              <ActivityIndicator size="small" color="#5E1DE6" />
            ) : (
              <Ionicons name="refresh" size={28} color="#5E1DE6" />
            )}
          </TouchableOpacity>
        </View>
      </View>
      {showFilterMenu && (
        <View style={styles.filterMenu}>
          <TouchableOpacity style={styles.filterOption} onPress={() => { setOrderType('nuevas'); setShowFilterMenu(false); }}>
            <Text style={styles.filterOptionText}>Más nuevas primero</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.filterOption} onPress={() => { setOrderType('antiguas'); setShowFilterMenu(false); }}>
            <Text style={styles.filterOptionText}>Más antiguas primero</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.filterOption} onPress={() => { setOrderType('az'); setShowFilterMenu(false); }}>
            <Text style={styles.filterOptionText}>A-Z</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.filterOption} onPress={() => { setOrderType('za'); setShowFilterMenu(false); }}>
            <Text style={styles.filterOptionText}>Z-A</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.filterOption} onPress={() => { setOrderType('mostradas'); setShowFilterMenu(false); }}>
            <Text style={styles.filterOptionText}>Solo mostradas</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.filterOption} onPress={() => { setOrderType('no_mostradas'); setShowFilterMenu(false); }}>
            <Text style={styles.filterOptionText}>Solo no mostradas</Text>
          </TouchableOpacity>
        </View>
      )}
      <View style={{ flex: 1, padding: 24, paddingTop: insets.top + 60, zIndex: 0 }}>
        {loading ? (
          <ActivityIndicator size="large" color="#5E1DE6" />
        ) : (
          <FlatList
            data={orderedFrases}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => {
              return (
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => {
                    setSelectedFrase(item);
                    setModalVisible(true);
                    setEditMode(false);
                  }}
                >
                  <View style={[
                    styles.fraseContainer,
                    { backgroundColor: item.visible === false ? '#ffeaea' : '#fff' }
                  ]}>
                    <Text style={styles.fraseText}>{item.frase}</Text>
                  </View>
                </TouchableOpacity>
              );
            }}
          />
        )}
      </View>
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.2)',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <View style={{
            backgroundColor: '#fff',
            borderRadius: 16,
            padding: 24,
            width: '85%',
            shadowColor: '#000',
            shadowOpacity: 0.15,
            shadowOffset: { width: 0, height: 4 },
            shadowRadius: 10,
            elevation: 8,
          }}>
            {selectedFrase && (
              <>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 12, color: '#5E1DE6' }}>Frase</Text>
                  {!editMode && (
                    <TouchableOpacity
                      onPress={() => {
                        setEditFrase(selectedFrase.frase);
                        setEditTipo(selectedFrase.tipo || '');
                        setEditCastigo(selectedFrase.castigo || '');
                        setEditVisible(selectedFrase.visible === true);
                        setEditMode(true);
                      }}
                    >
                      <Ionicons name="pencil" size={24} color="#5E1DE6" />
                    </TouchableOpacity>
                  )}
                </View>
                {editMode ? (
                  <>
                    <TextInput
                      style={{
                        borderWidth: 1,
                        borderColor: '#E2D6FF',
                        borderRadius: 8,
                        padding: 8,
                        marginBottom: 10,
                        fontSize: 18,
                      }}
                      value={editFrase}
                      onChangeText={setEditFrase}
                      placeholder="Frase"
                    />
                    <Text style={{ fontWeight: 'bold', marginTop: 12 }}>Tipo</Text>
                    <TextInput
                      style={{
                        borderWidth: 1,
                        borderColor: '#E2D6FF',
                        borderRadius: 8,
                        padding: 8,
                        marginBottom: 10,
                        fontSize: 18,
                      }}
                      value={editTipo}
                      onChangeText={setEditTipo}
                      placeholder="Tipo"
                    />
                    <Text style={{ fontWeight: 'bold', marginTop: 12 }}>Castigo</Text>
                    <TextInput
                      style={{
                        borderWidth: 1,
                        borderColor: '#E2D6FF',
                        borderRadius: 8,
                        padding: 8,
                        marginBottom: 10,
                        fontSize: 16,
                      }}
                      value={editCastigo}
                      onChangeText={setEditCastigo}
                      placeholder="Castigo"
                      keyboardType="numeric"
                    />
                    <Text style={{ fontWeight: 'bold', marginTop: 12 }}>Visible</Text>
                    <TouchableOpacity
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginBottom: 16,
                        marginTop: 4,
                      }}
                      onPress={() => setEditVisible(!editVisible)}
                    >
                      <View
                        style={{
                          width: 36,
                          height: 22,
                          borderRadius: 12,
                          backgroundColor: editVisible ? '#5E1DE6' : '#ccc',
                          justifyContent: 'center',
                          marginRight: 10,
                          padding: 2,
                        }}
                      >
                        <View
                          style={{
                            width: 18,
                            height: 18,
                            borderRadius: 9,
                            backgroundColor: '#fff',
                            marginLeft: editVisible ? 14 : 2,
                          }}
                        />
                      </View>
                      <Text style={{ fontSize: 16 }}>{editVisible ? 'Sí' : 'No'}</Text>
                    </TouchableOpacity>
                  </>
                ) : (
                  <>
                    <Text style={{ fontSize: 18, marginBottom: 8 }}>{selectedFrase.frase}</Text>
                    <Text style={{ fontWeight: 'bold', marginTop: 12 }}>Tipo</Text>
                    <Text style={{ marginBottom: 8 }}>{selectedFrase.tipo || 'Sin tipo'}</Text>
                    <Text style={{ fontWeight: 'bold', marginTop: 12 }}>Castigo</Text>
                    <Text style={{ marginBottom: 8 }}>{selectedFrase.castigo || 'Sin castigo'}</Text>
                    <Text style={{ fontWeight: 'bold', marginTop: 12 }}>Visible</Text>
                    <Text style={{ marginBottom: 16 }}>
                      Visible: {selectedFrase.visible === true ? 'Sí' : 'No'}
                    </Text>
                  </>
                )}
              </>
            )}
            {editMode ? (
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 }}>
                <TouchableOpacity
                  style={{
                    backgroundColor: '#5E1DE6',
                    borderRadius: 8,
                    paddingVertical: 10,
                    paddingHorizontal: 18,
                    alignItems: 'center',
                    marginRight: 8,
                    flex: 1,
                  }}
                  onPress={async () => {
                    // Guardar cambios
                    try {
                      await updateDoc(doc(db, 'frases', selectedFrase.id), {
                        frase: editFrase,
                        tipo: editTipo,
                        castigo: editCastigo,
                        visible: editVisible,
                      });
                      // Refrescar lista, cerrar modal y salir de edición
                      await refrescarFrases();
                      setModalVisible(false);
                      setEditMode(false);
                      setSelectedFrase(null);
                    } catch (err) {
                      Alert.alert('Error', 'No se pudo guardar la frase.');
                    }
                  }}
                >
                  <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>Guardar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    backgroundColor: '#ccc',
                    borderRadius: 8,
                    paddingVertical: 10,
                    paddingHorizontal: 18,
                    alignItems: 'center',
                    marginLeft: 8,
                    flex: 1,
                  }}
                  onPress={() => {
                    setEditMode(false);
                  }}
                >
                  <Text style={{ color: '#333', fontWeight: 'bold', fontSize: 16 }}>Cancelar</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <>
                <TouchableOpacity
                  style={{
                    backgroundColor: '#5E1DE6',
                    borderRadius: 8,
                    paddingVertical: 10,
                    alignItems: 'center',
                    marginTop: 8,
                  }}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>Cerrar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    backgroundColor: '#ff3b30',
                    borderRadius: 8,
                    paddingVertical: 10,
                    alignItems: 'center',
                    marginTop: 12,
                  }}
                  onPress={async () => {
                    if (Platform.OS === 'web') {
                      const confirmDelete = window.confirm('¿Seguro que quieres borrar esta frase? No se podrá recuperar después');
                      if (confirmDelete) {
                        try {
                          await deleteDoc(doc(db, 'frases', selectedFrase.id));
                          setModalVisible(false);
                          setSelectedFrase(null);
                          refrescarFrases();
                        } catch (err) {
                          alert('Error: No se pudo borrar la frase.');
                        }
                      }
                    } else {
                      Alert.alert(
                        'Confirmar borrado',
                        '¿Seguro que quieres borrar esta frase? No se podrá recuperar después',
                        [
                          { text: 'Cancelar', style: 'cancel' },
                          {
                            text: 'Borrar',
                            style: 'destructive',
                            onPress: async () => {
                              try {
                                await deleteDoc(doc(db, 'frases', selectedFrase.id));
                                setModalVisible(false);
                                setSelectedFrase(null);
                                refrescarFrases();
                              } catch (err) {
                                Alert.alert('Error', 'No se pudo borrar la frase.');
                              }
                            }
                          }
                        ]
                      );
                    }
                  }}
                >
                  <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>Borrar</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
    </>
  );
}