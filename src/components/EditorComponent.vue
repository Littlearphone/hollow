<script setup>
import { Decode, DownloadData, Hash } from '@/utils/functions.js'
import { NButton, NInput, NSelect, useMessage } from 'naive-ui'
import { useStateStore } from '@/stores/state.js'
import WindowDrag from '@/utils/windowDrag.js'
import { ref } from 'vue'

const dragging = ref()
const fileInputRef = ref()
const message = useMessage()
const switchMode = ref('')
const stateStore = useStateStore()
const windowDrag = new WindowDrag()

windowDrag.onDrop = function (e) {
  handleFileChange(e.dataTransfer.files)
}
windowDrag.onDragEnter = function () {
  dragging.value = true
}
windowDrag.onDragLeave = function () {
  dragging.value = false
}

function handleFileChange(files) {
  if (files.length === 0) {
    return message.error('至少需要选择一个存档文件进行编辑')
  }
  if (files.length > 1) {
    return message.warning('选择的存档文件大于一个，将只会解析第一个存档文件')
  }
  const file = files[0]
  const reader = new FileReader()

  if (switchMode.value) {
    reader.readAsText(file)
  } else {
    reader.readAsArrayBuffer(file)
  }

  reader.addEventListener('load', () => {
    const result = reader.result
    try {
      let decrypted = ''
      if (switchMode.value) {
        decrypted = result
      } else {
        decrypted = Decode(new Uint8Array(result))
      }
      const jsonString = JSON.stringify(JSON.parse(decrypted), undefined, 2)
      const hash = Hash(jsonString)
      stateStore.history.removeFromHistory(hash)
      stateStore.history.addToHistory(jsonString, file.name, hash)
      stateStore.history.syncToLocalStorage()
      stateStore.loadGameFile({ jsonString, name: file.name })
    } catch (err) {
      message.error('The file could not decrypted.')
      console.warn(err)
    }
  })
}

// fileHandle is an instance of FileSystemFileHandle..
async function writeFile(contents) {
  // Create a FileSystemWritableFileStream to write to.
  const writable = await stateStore.handle.createWritable()
  // Write the contents of the file to the stream.
  await writable.write(contents)
  // Close the file and write the contents to disk.
  await writable.close()
}

function handleSaveFile() {
  writeFile(stateStore.generateSave(switchMode.value))
}

async function handleFileClick() {
  if (stateStore.fsApi) {
    try {
      const [fileHandle] = await self.showOpenFilePicker()
      handleFileChange([await fileHandle.getFile()])
      stateStore.setHandle(fileHandle)
    } catch (e) {
      console.error(e)
    }
  } else {
    fileInputRef.value.click()
  }
}

function handleChange(e) {
  console.log(e)
  return handleFileChange(fileInputRef.value.files)
}

function downloadSwitchSave(e) {
  DownloadData(stateStore.generateSave(), stateStore.gameFileName)
}

function downloadSteamSave(e) {
  DownloadData(stateStore.generateSave('Switch'), stateStore.gameFileName)
}

const options = [
  {
    label: 'Steam存档',
    value: ''
  },
  {
    label: 'Switch存档',
    value: 'Switch'
  },
]
window.$message = useMessage()
</script>
<template>
  <div class="dragging-modal" v-if="dragging"></div>
  <div class="select-save-wrapper">
    <n-select v-model:value="switchMode" :options="options"/>
    <n-button id="file-button" @click="handleFileClick">选择存档</n-button>
    <n-button type="primary" id="save-button" @click="handleSaveFile" v-if="stateStore.fsApi && stateStore.handle">
      保存存档
    </n-button>
  </div>
  <input @change="handleChange" id="file-input" ref="fileInputRef" type="file"/>
  <div id="editor-wrapper" v-if="stateStore.editing">
    <span id="editor-name">{{ stateStore.gameFileName }}</span>
    <n-input
      id="editor"
      type="textarea"
      :resizable="false"
      spellcheck="false"
      v-model:value="stateStore.gameFile"
    />
    <div id="editor-buttons">
      <n-button @click="stateStore.resetEditor">恢复为修改前存档</n-button>
      <n-button type="primary" @click="downloadSwitchSave">下载存档 (Switch)</n-button>
      <n-button type="primary" @click="downloadSteamSave">下载存档 (Steam)</n-button>
    </div>
  </div>
</template>
<style scoped lang="scss">
#editor-wrapper {
  height: calc(100% - 50px);

  #editor {
    height: calc(100% - 75px);
  }
}

.n-empty {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;

  ::v-deep(.n-empty__extra) {
    display: flex;
    align-items: center;
  }
}
</style>
