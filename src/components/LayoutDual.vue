<template>
  <splitpanes class="default-theme">
    <pane size="20">
      <div style="padding: 8px; display: grid; gap: 6px">
        <slot name="panel" />
      </div>
    </pane>

    <pane size="80">
      <div :style="{ padding: '24px' }">
        <slot name="chart" />
      </div>
    </pane>
  </splitpanes>
</template>

<script setup lang="ts"></script>

<style>
.default-theme.splitpanes .splitpanes__splitter {
  background-color: transparent !important;
}

.default-theme.splitpanes .splitpanes__pane {
  background-color: transparent !important;
}

</style>
