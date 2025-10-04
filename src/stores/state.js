import { shallowRef } from 'vue'
import { defineStore } from 'pinia'
import HistoryData from '@/utils/history.js'
import { Encode } from '@/utils/functions.js'

export const useStateStore = defineStore('state', () => {
  const currentTab = shallowRef('start')
  const fsApi = shallowRef('showOpenFilePicker' in self)
  const handle = shallowRef()
  const history = new HistoryData()
  const editing = shallowRef()
  const gameFile = shallowRef()
  const gameFileName = shallowRef()
  const gameFileOriginal = shallowRef()

  function startEditing() {
    editing.value = true
  }

  function loadGameFile(item) {
    const jsonString = JSON.stringify(JSON.parse(item.jsonString), undefined, 2)
    gameFileName.value = item.name || item.fileName
    gameFileOriginal.value = jsonString
    gameFile.value = jsonString
    startEditing()
  }

  function resetEditor(e) {
    gameFile.value = gameFileOriginal.value
  }

  function setHandle(h) {
    handle.value = h
  }

  function generateSave(mode) {
    try {
      const data = JSON.stringify(JSON.parse(gameFile.value))
      return mode ? data : Encode(data)
    } catch (err) {
      window.$message.error('生成存档失败，请检查存档内容是否正确')
    }
  }

  function setCurrentTab(tabName) {
    currentTab.value = tabName
  }

  return {
    fsApi,
    handle,
    history,
    editing,
    gameFile,
    gameFileName,
    currentTab,
    generateSave,
    setHandle,
    setCurrentTab,
    loadGameFile,
    resetEditor
  }
})
