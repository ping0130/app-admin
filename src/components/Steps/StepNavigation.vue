<template>
  <div class="button-container">
    <el-button v-if="activeStep > 0" @click="$emit('prev')">上一步</el-button>
    <el-button v-if="activeStep < totalSteps - 1" type="primary" @click="$emit('next')">下一步</el-button>
    <el-button v-if="activeStep === totalSteps - 1" type="primary" @click="$emit('submit')">提交</el-button>
  </div>
</template>

<script>
export default {
  props: {
    activeStep: Number,
    totalSteps: Number
  }
}
</script>

<style scoped>
.button-container {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}
</style>
