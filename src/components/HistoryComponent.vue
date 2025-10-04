<script setup>
import { NButton, NIcon, NList, NListItem, NTag } from 'naive-ui'
import { useStateStore } from '@/stores/state.js'
import { HumanTime } from '@/utils/functions.js'
import Edit from '@/icons/Edit.vue'
import Delete from '@/icons/Delete.vue'

const stateStore = useStateStore()

function handleClick(item) {
  stateStore.loadGameFile(item)
  stateStore.setCurrentTab('editor')
}

function handleContextMenu(e, item) {
  // stateStore.history.removeFromHistory(item.hash)
  // stateStore.history.syncToLocalStorage()
  e.preventDefault()
}
</script>
<template>
  <div id="history">
    <div>保存有限数量的最近存档，但请勿使用这些存档作为实际存档的备份。</div>
    <n-list bordered>
      <n-list-item :key="item.hash" class="history-item" v-for="item in stateStore.history.list">
        <div class="history-item-text">
          <div class="history-keys">
            <div class="history-name">{{ item.fileName }}</div>
            <n-tag size="small" type="primary" class="history-hash">
              {{ item.hash }}
            </n-tag>
          </div>
          <div class="history-date">{{ HumanTime(item.date) }}</div>
        </div>
        <div class="history-item-actions">
          <n-button circle quaternary @click="handleClick(item)">
            <template #icon>
              <n-icon>
                <Edit/>
              </n-icon>
            </template>
          </n-button>
          <n-button circle quaternary @click="handleContextMenu($event, item)">
            <template #icon>
              <n-icon>
                <Delete/>
              </n-icon>
            </template>
          </n-button>
        </div>
      </n-list-item>
    </n-list>
  </div>
</template>
<style scoped lang="scss">
#history {
  margin: 10px 0;

  & > div:first-child {
    font-size: 0.9em;
    color: #777;
  }

  & > ul {
    padding: 0;
    display: grid;
    margin: 10px 0 0;
    list-style: none;
  }

  ::v-deep(.history-item) {
    padding: 8px 12px;
    user-select: none;
    background-color: white;

    &:hover {
      cursor: pointer;
      background-color: #eee;
    }

    &:active {
      background-color: #ddd;
    }

    .n-list-item__main {
      display: flex;
      align-items: center;
      justify-content: space-between;

      .history-item-text {
        .history-keys {
          gap: 8px;
          display: flex;
          align-items: center;

          .history-name {
            color: royalblue;
            font-size: 1.2em;
          }
        }

        .history-date {
          font-size: 0.8em;
        }
      }

      .history-item-actions {

      }
    }
  }
}
</style>
