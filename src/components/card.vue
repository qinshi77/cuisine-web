<template>
  <div class="box-card">
    <slot>此组件为注册卡片组件</slot>
  </div>
</template>
<script>
export default {
  name: 'Card',
  props: {
    weight: {
      type: String,
      default: '500px'
    },
    height: {
      type: String,
      default: '400px'
    },
    content: {
      type: Object,
      default: () => ({})
    }
  }
}
</script>
<style scoped>
.box-card {
  width: 500px;
  height: 420px;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}
</style>
