<script setup>
import { NConfigProvider, NMessageProvider, NScrollbar, NTabPane, NTabs } from 'naive-ui'
import HistoryComponent from '@/components/HistoryComponent.vue'
import EditorComponent from '@/components/EditorComponent.vue'
import AboutComponent from '@/components/AboutComponent.vue'
import { useStateStore } from '@/stores/state.js'

const stateStore = useStateStore()

/**
 * js 文件下使用这个做类型提示
 * @type import('naive-ui').GlobalThemeOverrides
 */
const themeOverrides = {
  common: {
    primaryColor: 'royalblue',
    primaryColorHover: 'royalblue',
  },
}
</script>
<template>
  <n-config-provider :theme-overrides="themeOverrides">
    <n-message-provider>
      <n-tabs type="card" v-model:value="stateStore.currentTab">
        <n-tab-pane name="start" tab="说明">
          <n-scrollbar>
            <AboutComponent/>
          </n-scrollbar>
        </n-tab-pane>
        <n-tab-pane display-directive="show" name="editor" tab="编辑">
          <EditorComponent/>
        </n-tab-pane>
        <n-tab-pane name="history" tab="历史">
          <n-scrollbar>
            <HistoryComponent/>
          </n-scrollbar>
        </n-tab-pane>
      </n-tabs>
    </n-message-provider>
  </n-config-provider>
</template>
<style scoped lang="scss">
.n-config-provider {
  height: 100%;
}

.n-tabs {
  height: 100%;
  padding: 16px;

  ::v-deep(.n-tabs-pad) {
    border: 1px solid var(--n-tab-border-color);
  }

  ::v-deep(.n-tabs-tab-pad) {
    width: 0;
  }

  .n-tab-pane {
    border: 1px solid var(--n-tab-border-color);
    height: calc(100% - 46px);
    box-sizing: border-box;
    border-top: none;
    overflow: auto;
    padding: 16px;
  }
}
</style>
