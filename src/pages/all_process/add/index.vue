<template>
  <pre-loader
      :loading="loading"
      class="process-add"
  >
    <el-row class="mb-3">
      <el-col :md="12">
        <h3>Добавление процесса</h3>
      </el-col>
      <el-col :span="12" align="right">
        <return-button/>
      </el-col>
    </el-row>

    <el-row class="my-3">
      <el-col :md="12">
        <label class="block mb-1">Название процесса</label>
        <el-input
            v-model="new_process.title"
            :class="['w-full', {'border border-red-500' : errors.title}]"
            placeholder="Выбрать"
        />
        <small v-if="errors.title" class="text-red-500">{{errors.title}}</small>
      </el-col>
    </el-row>

    <el-row class="my-3">
      <el-col :md="12">
        <label class="block mb-1">Название модуля</label>
        <el-input
            v-model="new_process.module_name"
            :class="['w-full', {'border border-red-500' : errors.module_name}]"
            placeholder="Выбрать"
        />
        <small v-if="errors.module_name" class="text-red-500">{{errors.module_name}}</small>
      </el-col>
    </el-row>

    <el-row class="my-3">
      <el-col :md="12">
        <label class="block mb-1">Путь к документу процесса</label>
        <el-input
            v-model="new_process.document_link"
            :class="['w-full', {'border border-red-500' : errors.document_link}]"
            placeholder="Выбрать"
        />
        <small v-if="errors.document_link" class="text-red-500">{{errors.document_link}}</small>
      </el-col>
    </el-row>

    <el-row class="my-3">
      <el-col>
        <el-button type="primary" @click="saveProcess">
          Сохранить процесс
        </el-button>
      </el-col>
    </el-row>

  </pre-loader>
</template>

<script setup>

import {ref, reactive, inject, watchEffect, watch, computed} from "vue";
import { useRouter, useRoute } from 'vue-router';
import preLoader from "@/components/pre_loader";
import returnButton from "@/components/return_button"
import  {ElMessageBox }  from 'element-plus';
import {ProcessRepo} from "@/repositories";

const router              = useRouter();
const route               = useRoute();
const loading             = ref(false);
const user                = inject('user');

const new_process         = reactive({
  title         : '',
  module_name   : '',
  document_link : '',
  user_id       : user.id
});

const errors              = reactive({
  title         : '',
  module_name   : '',
  document_link : '',
});

const is_valid = () => {
  let valid = true;

  if(!new_process.title         || new_process.title.length < 3)         {errors.title         = 'Необходимо указать название процесса';         valid = false;}
  if(!new_process.module_name   || new_process.module_name.length < 3)   {errors.module_name   = 'Необходимо указать название модуля';           valid = false;}
  if(!new_process.document_link || new_process.document_link.length < 3) {errors.document_link = 'Необходимо указать путь к документу процесса'; valid = false;}

  return valid;
}

const saveProcess = async() => {
  if (!is_valid()) return;

  try {
    loading.value = true;
    await ProcessRepo.create({
      ...new_process
    });

    await router.push({name  : 'allProcess'});

  } catch (e) {
      notify({title : 'Ошибка при выполнении запроса создания процесса', message :e.message, type : 'error', duration : 5000});
  } finally {
    loading.value = false;
  }

}

watchEffect(() => {
  new_process.title         ? errors.title         = null : '';
  new_process.module_name   ? errors.module_name   = null : '';
  new_process.document_link ? errors.document_link = null : '';
});


</script>

<style scoped>

</style>