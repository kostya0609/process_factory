<template>
  <pre-loader
      :loading="loading"
      class="group-stage-container px-3"
  >

    <label class="block mb-1 font-semibold">Название</label>
    <el-input
      v-model="action.title"
      class="w-full mb-2"
      placeholder="Введите название действия"
      @change="!action.title ? action.title = 'Новое действие' : ''"
    />

    <label class="block mb-1 font-semibold">Тип действия</label>
    <el-select
      v-model="action.type_id"
      class="w-full mb-2"
      placeholder="Выбрать тип действия"
    >
      <el-option
        v-for="item in action_types"
        :key="'type_' + item.id"
        :label="item.title"
        :value="item.id"
      >
      </el-option>
    </el-select>

    <el-switch
      v-model="action.is_commentable"
      size="small"
      active-text="Требует комментария"
      inactive-text=""
      class="mb-2"
    />

  </pre-loader>
</template>

<script setup>
import {ref, reactive, inject} from "vue";
import PreLoader from "@/components/pre_loader";

const props = defineProps({
  action        : Object,
  action_types  : Array,
});

const notify             = inject('notify');

const loading            = ref(false);
const user               = ref('');

</script>

<style scoped>

</style>