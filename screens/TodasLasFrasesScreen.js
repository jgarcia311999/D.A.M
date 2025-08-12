import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, FlatList, ActivityIndicator, TextInput, Modal, Alert, Platform } from 'react-native';
import * as XLSX from 'xlsx';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import * as Haptics from 'expo-haptics';

// ✅ NUEVO: leemos de tu JSON local
import frasesLocal from '../data/frases.json'; // /data/frases.json relativo a /screens/

export default function TodasLasFrasesScreen() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const [frases, setFrases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showSearch, setShowSearch] = useState(false);
  const [searchText, setSearchText] = useState('');
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

  // ---------- Exportar a Excel (sólo web) ----------
  const exportarExcel = async () => {
    if (Platform.OS !== 'web') {
      alert('Exportar a Excel solo está disponible en la versión web.');
      return;
    }
    const { saveAs } = await import('file-saver');

    const worksheet = XLSX.utils.json_to_sheet(frases.map(f => ({
      id: f.id,
      frase: f.frase,
      tipo: f.tipo || '',
      castigo: f.castigo ?? '',
      visible: f.visible === undefined ? true : f.visible,
      timestamp: f.timestamp ?? '',
      eliminar: ''
    })));
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Frases');
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(data, 'frases.xlsx');
  };

  // ---------- Exportar a JSON (web) ----------
  const exportarJSON = () => {
    if (Platform.OS !== 'web') {
      alert('Exportar a JSON solo está disponible en la versión web.');
      return;
    }
    const jsonData = JSON.stringify(frases, null, 2);
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'frases.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  // ---------- Subir JSON (web) ----------
  const handleJSONUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const frasesImportadas = JSON.parse(e.target.result);
        if (!Array.isArray(frasesImportadas)) {
          alert('El archivo no tiene el formato correcto (se esperaba un array).');
          return;
        }
        if (window.confirm('¿Reemplazar TODAS las frases por las del JSON?')) {
          reemplazarTodasLasFrasesLocal(frasesImportadas);
        }
      } catch (error) {
        alert('Error al leer el archivo JSON.');
        console.error(error);
      }
    };
    reader.readAsText(file);
  };

  // ---------- Subir Excel (web) ----------
  const handleExcelUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const frasesImportadas = XLSX.utils.sheet_to_json(sheet);

      if (window.confirm('¿Reemplazar TODAS las frases por las del Excel?')) {
        reemplazarTodasLasFrasesLocal(frasesImportadas);
      }
    };
    reader.readAsArrayBuffer(file);
  };

  // ✅ Reemplazo local en memoria (sin Firestore)
  const reemplazarTodasLasFrasesLocal = (frasesImportadas) => {
    const limpias = frasesImportadas
      .filter(item => item.frase && String(item.frase).trim() !== '')
      .map(item => ({
        id: item.id && String(item.id).trim() !== '' ? String(item.id) : cryptoRandomId(),
        frase: String(item.frase).trim(),
        tipo: item.tipo ? String(item.tipo) : '',
        castigo: isFinite(item.castigo) ? Number(item.castigo) : (item.castigo ?? ''),
        visible: item.visible === undefined ? true : (item.visible === 'false' ? false : Boolean(item.visible)),
        timestamp: typeof item.timestamp === 'number' ? item.timestamp : Date.now()
      }));
    setFrases(limpias);
  };

  // Generador simple de ID si falta en importaciones
  const cryptoRandomId = () =>
    'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
      const r = (Math.random() * 16) | 0, v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });

  // ✅ Cargar desde JSON local (bundle)
  const fetchFrases = useCallback(async () => {
    setLoading(true);
    try {
      // frasesLocal ya viene como array del JSON
      const normalizadas = (frasesLocal || []).map(item => ({
        id: item.id,
        frase: item.frase,
        tipo: item.tipo || '',
        castigo: item.castigo ?? '',
        visible: item.visible === undefined ? true : item.visible,
        timestamp: typeof item.timestamp === 'number' ? item.timestamp : 0
      }));
      setFrases(normalizadas);
    } catch (error) {
      console.error('Error leyendo frases.json:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // “Refrescar” vuelve al contenido del JSON empaquetado
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
    orderedFrases.sort((a, b) => {
      if (a.timestamp && b.timestamp) return b.timestamp - a.timestamp;
      if (a.id < b.id) return 1;
      if (a.id > b.id) return -1;
      return 0;
    });
  } else if (orderType === 'antiguas') {
    orderedFrases.sort((a, b) => {
      if (a.timestamp && b.timestamp) return a.timestamp - b.timestamp;
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
            if (navigation.canGoBack()) navigation.goBack();
            else navigation.navigate('CreaFrase');
          }}
        >
          <Ionicons name="arrow-back" size={28} color="#5E1DE6" />
        </TouchableOpacity>

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

          {Platform.OS === 'web' && (
            <>
              <TouchableOpacity style={styles.filterOption} onPress={exportarExcel}>
                <Text style={styles.filterOptionText}>Descargar Excel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.filterOption} onPress={exportarJSON}>
                <Text style={styles.filterOptionText}>Descargar JSON</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.filterOption} onPress={() => document.getElementById('excelInput')?.click()}>
                <Text style={styles.filterOptionText}>Subir Excel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.filterOption} onPress={() => document.getElementById('jsonInput')?.click()}>
                <Text style={styles.filterOptionText}>Subir JSON</Text>
              </TouchableOpacity>
              <input id="excelInput" type="file" accept=".xlsx" onChange={handleExcelUpload} style={{ display: 'none' }} />
              <input id="jsonInput" type="file" accept=".json,application/json" onChange={handleJSONUpload} style={{ display: 'none' }} />
            </>
          )}
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
                        setEditCastigo(String(selectedFrase.castigo ?? ''));
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
                      style={{ borderWidth: 1, borderColor: '#E2D6FF', borderRadius: 8, padding: 8, marginBottom: 10, fontSize: 18 }}
                      value={editFrase}
                      onChangeText={setEditFrase}
                      placeholder="Frase"
                    />
                    <Text style={{ fontWeight: 'bold', marginTop: 12 }}>Tipo</Text>
                    <TextInput
                      style={{ borderWidth: 1, borderColor: '#E2D6FF', borderRadius: 8, padding: 8, marginBottom: 10, fontSize: 18 }}
                      value={editTipo}
                      onChangeText={setEditTipo}
                      placeholder="Tipo"
                    />
                    <Text style={{ fontWeight: 'bold', marginTop: 12 }}>Castigo</Text>
                    <TextInput
                      style={{ borderWidth: 1, borderColor: '#E2D6FF', borderRadius: 8, padding: 8, marginBottom: 10, fontSize: 16 }}
                      value={editCastigo}
                      onChangeText={setEditCastigo}
                      placeholder="Castigo"
                      keyboardType="numeric"
                    />
                    <Text style={{ fontWeight: 'bold', marginTop: 12 }}>Visible</Text>
                    <TouchableOpacity
                      style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16, marginTop: 4 }}
                      onPress={() => setEditVisible(!editVisible)}
                    >
                      <View style={{
                        width: 36, height: 22, borderRadius: 12,
                        backgroundColor: editVisible ? '#5E1DE6' : '#ccc',
                        justifyContent: 'center', marginRight: 10, padding: 2
                      }}>
                        <View style={{
                          width: 18, height: 18, borderRadius: 9, backgroundColor: '#fff',
                          marginLeft: editVisible ? 14 : 2
                        }} />
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
                    <Text style={{ marginBottom: 8 }}>{selectedFrase.castigo ?? 'Sin castigo'}</Text>
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
                  style={{ backgroundColor: '#5E1DE6', borderRadius: 8, paddingVertical: 10, paddingHorizontal: 18, alignItems: 'center', marginRight: 8, flex: 1 }}
                  onPress={() => {
                    // ✅ Guardar cambios en memoria
                    setFrases(prev =>
                      prev.map(f =>
                        f.id === selectedFrase.id
                          ? {
                              ...f,
                              frase: editFrase,
                              tipo: editTipo,
                              castigo: isFinite(editCastigo) ? Number(editCastigo) : editCastigo,
                              visible: editVisible
                            }
                          : f
                      )
                    );
                    setModalVisible(false);
                    setEditMode(false);
                    setSelectedFrase(null);
                  }}
                >
                  <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>Guardar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{ backgroundColor: '#ccc', borderRadius: 8, paddingVertical: 10, paddingHorizontal: 18, alignItems: 'center', marginLeft: 8, flex: 1 }}
                  onPress={() => { setEditMode(false); }}
                >
                  <Text style={{ color: '#333', fontWeight: 'bold', fontSize: 16 }}>Cancelar</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <>
                <TouchableOpacity
                  style={{ backgroundColor: '#5E1DE6', borderRadius: 8, paddingVertical: 10, alignItems: 'center', marginTop: 8 }}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>Cerrar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{ backgroundColor: '#ff3b30', borderRadius: 8, paddingVertical: 10, alignItems: 'center', marginTop: 12 }}
                  onPress={() => {
                    const confirmar = Platform.OS === 'web'
                      ? window.confirm('¿Seguro que quieres borrar esta frase? No se podrá recuperar después')
                      : true;

                    const doDelete = () => {
                      setFrases(prev => prev.filter(f => f.id !== selectedFrase.id));
                      setModalVisible(false);
                      setSelectedFrase(null);
                    };

                    if (Platform.OS === 'web') {
                      if (confirmar) doDelete();
                    } else {
                      Alert.alert(
                        'Confirmar borrado',
                        '¿Seguro que quieres borrar esta frase? No se podrá recuperar después',
                        [
                          { text: 'Cancelar', style: 'cancel' },
                          { text: 'Borrar', style: 'destructive', onPress: doDelete }
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