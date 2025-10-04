<script setup>
import { NAlert, NStep, NSteps } from 'naive-ui'
</script>
<template>
  <n-alert class="source-refs">
    这是工具原始
    <a href="https://github.com/bloodorca/hollow" target="_blank">代码仓库</a>
    ，本项目有做修改。开始使用前先确保完整阅读以下说明。
  </n-alert>
  <p class="description">
    该在线工具可用于修改【空洞骑士】游戏的存档文件，
    也可用于对 PC 存档和 Switch 存档进行互转。
    <br/>
    使用方法：
  </p>
  <n-steps vertical>
    <n-step title="首先备份你原来的存档 (尽量不要备份到存档原来的目录中)"/>
    <n-step>
      <template #title>
        拖拽你想修改的存档到【编辑】窗口中
        <p>或者在【编辑】窗口中选择本地存档</p>
        <p>或者在【历史】窗口中选择上次的存档</p>
      </template>
    </n-step>
    <n-step title="通过 Ctrl+F 或 Cmd+F 搜索关键属性进行修改"/>
    <n-step title="保存修改后的存档（需浏览器支持）或下载编辑后的存档进行替换"/>
  </n-steps>
</template>
<style scoped lang="scss">
.description {
  margin-block: 16px;
}

.n-steps {
  margin-inline: 8px;
}
</style>
