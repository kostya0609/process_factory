<template>
  <div class="detail-process-container">
    <el-row>
      <el-col :md="12">
        <el-row class="my-3">
          <el-col >
            <label class="block mb-1">Название процесса</label>
            <el-input
              v-model="process.title"
              :class="['w-full', {'border border-red-500' : errors.title}]"
              placeholder="Введите название процесса"
            />
            <small v-if="errors.title" class="text-red-500">{{errors.title}}</small>
          </el-col>
        </el-row>
        <el-row class="my-3">
          <el-col >
            <label class="block mb-1">Название модуля</label>
            <el-input
              v-model="process.module_name"
              :class="['w-full', {'border border-red-500' : errors.module_name}]"
              placeholder="Введите название модуля"
            />
            <small v-if="errors.module_name" class="text-red-500">{{errors.module_name}}</small>
          </el-col>
        </el-row>
        <el-row class="my-3">
          <el-col >
            <label class="block mb-1">Путь к документу процесса</label>
            <el-input
              v-model="process.document_link"
              :class="['w-full', {'border border-red-500' : errors.document_link}]"
              placeholder="Введите путь к документу процесса"
            />
            <small v-if="errors.document_link" class="text-red-500">{{errors.document_link}}</small>
          </el-col>
        </el-row>
      </el-col>
      <el-col :md="12" align="center">
        <span class="userPhoto xs:mt-3 sm:mt-3 md:mt-3">
          <a :href="process.user.link" target="blank">
            <img :src="process.user.photo" alt="фото"/>
          </a>
        </span>
      </el-col>
    </el-row>


  </div>
</template>

<script setup>
const props = defineProps({
  process  : Object,
  errors   : Object,
});
</script>

<style scoped>

</style>