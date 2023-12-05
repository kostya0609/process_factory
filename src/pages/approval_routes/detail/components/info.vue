<template>
  <div class="detail-info-approval_routes-container">
    <el-row class="my-3">
      <el-col :md="12">
        <label class="block mb-1">Название маршрута</label>
        <el-input
            v-model="data.title"
            :class="['w-full', {'border border-red-500' : errors.title}]"
            placeholder="Введите название маршрута"
        />
        <small v-if="errors.title" class="text-red-500">{{errors.title}}</small>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
const props = defineProps({
  data   : Object,
  errors : Object,
});

</script>

<style scoped>

</style>