import Vue from 'vue'
import Vuex from 'vuex'

import * as mxgraph from 'jjgraph'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // editor: null,  // mxEditor
    // graph: null,  // mxGraph

    zoom: 100,  // actual zoom in percents
    canUndo: false,
    canRedo: false,

    libraries: [],
    selectedLibrariesIDs: [],

    selectedComponents: []
  },

  getters: {
    selectedLibraries (state) {
      return state.selectedLibrariesIDs.map(libraryID => state.libraries[libraryID])
    }
  },

  mutations: {
    setEditor (state, editor) {
      state.editor = editor
    },

    setGraph (state, graph) {
      state.graph = graph
    },

    setZoom (state, zoom) {
      state.zoom = zoom
    },

    setCanUndo (state, canUndo) {
      state.canUndo = canUndo
    },

    setCanRedo (state, canRedo) {
      state.canRedo = canRedo
    },

    setLibraries (state, libraries) {
      state.libraries = libraries
    },

    selectLibrary (state, libraryID) {
      state.selectedLibrariesIDs.push(libraryID)
    },

    deselectLibrary (state, libraryID) {
      state.selectedLibrariesIDs.splice(state.selectedLibrariesIDs.indexOf(libraryID), 1)
    },

    setLibraryComponents (state, { libraryID, components }) {
      state.libraries[libraryID].components = components
    },

    setSelectedComponents (state, components) {
      state.selectedComponents = components
    }
  },

  actions: {
    zoomIn ({ state, dispatch }) {
      state.graph.zoomIn()
      dispatch('updateZoomState')
    },

    zoomOut ({ state, dispatch }) {
      state.graph.zoomOut()
      dispatch('updateZoomState')
    },

    zoomReset ({ state, dispatch }) {
      state.graph.zoomActual()
      dispatch('updateZoomState')
    },

    updateZoomState ({ state, commit }) {
      commit('setZoom', Math.floor(state.graph.view.scale * 100))
    },

    centerGraph ({ state }) {
      state.graph.center()
    },

    undo ({ state }) {
      state.editor.undo()
    },

    redo ({ state }) {
      state.editor.redo()
    },

    updateUndoManagerState ({ state, commit }) {
      commit('setCanUndo', state.editor.undoManager.canUndo())
      commit('setCanRedo', state.editor.undoManager.canRedo())
    },

    graphToXML ({ state }) {
      const encoder = new mxgraph.mxCodec()
      const result = encoder.encode(state.graph.getModel())
      return mxgraph.mxUtils.getXml(result)
    }
  }
})
