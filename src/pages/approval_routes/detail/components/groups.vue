<template>
  <div class="detail-groups-approval_routes-container">
    <el-collapse
        v-model="activeGroup"
        v-for="(group, idx) in data"
        :key="'group_' + group.id + '_' + idx"
        :accordion="true"
    >
      <el-collapse-item>
        <template #title>
          <div class="w-full flex justify-start items-center">
            <el-button
              class="mr-1"
              size="small"
              text
              type="danger"
              @click.stop="emit('groupDelete', idx);"
            >
              <el-icon size="large"><Remove /></el-icon>
            </el-button>
            <label class="block">№ {{(idx + 1)}}</label>
          </div>
        </template>

        <groups
          v-model:group = "data[idx]"
          :group_types="group_types"
          :group_fill_types="group_fill_types"
        />
      </el-collapse-item>
    </el-collapse>

    <div class="my-3 flex justify-center">
      <el-tooltip
        class="mt-1"
        effect="dark"
        content="Добавить группу"
        placement="top"
      >
        <el-button
          circle
          size="large"
          @click="emit('groupAdd');"
        >
          <el-icon><Plus /></el-icon>
        </el-button>
      </el-tooltip>
    </div>
  </div>
</template>

<script setup>
import groups from "@/components/groups"
import {ref} from "vue";
import {useRouter, useRoute} from 'vue-router';

const props = defineProps({
  data             : Object,
  group_types      : Array,
  group_fill_types : Array,
});

const emit = defineEmits([
  'groupAdd', 'groupDelete'
]);

const route        = useRoute();

const activeGroup  = ref([]);

</script>

<style scoped>

</style>