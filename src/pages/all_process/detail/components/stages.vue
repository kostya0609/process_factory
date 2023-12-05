<template>
  <div class="detail-stages-container">
    <el-row class="my-3">
      <el-col
        v-for="(stage, idx) in stages"
        :key="'stage_' + stage.id + '_' + idx"
        :md="24" :lg="12" :xl="8"
        class="p-1 "
      >
        <card-stage
          v-model:stage = "stages[idx]"
          :group_types="group_types"
          :group_fill_types="group_fill_types"
          :action_types="action_types"
          :stage_idx="idx"
          @stageTitleEdit="stageTitleEdit"
          @stageDelete="stageDelete"
          @stageSave="stageSave"
          @groupAdd="groupAdd"
          @groupDelete="groupDelete"
          @actionDelete="actionDelete"
          @actionAdd="actionAdd"
          :can_delete_stage="true"
        />
      </el-col>

      <el-col
        :md="24" :lg="12" :xl="8"
        class="p-1 "
      >
        <el-card class="card-stage-container h-full" body-class="!p-0 flex justify-center items-center h-full">
          <el-tooltip
            class="mt-1"
            effect="dark"
            content="Добавить этап"
            placement="top"
          >
           <el-button
             class="my-3"
             circle
             size="large"
             @click="stageAdd"
           >
              <el-icon><Plus/></el-icon>
            </el-button>
          </el-tooltip>
        </el-card>
      </el-col>

    </el-row>

  </div>
</template>

<script setup>
import cardStage from "@/pages/all_process/detail/components/card_stage";

import {inject} from "vue";

const props = defineProps({
  stages           : Object,
  group_types      : Array,
  group_fill_types : Array,
  action_types     : Array
});

const stageTitleEdit = inject('stageTitleEdit');
const stageAdd       = inject('stageAdd');
const stageDelete    = inject('stageDelete');
const stageSave      = inject('stageSave');
const groupAdd       = inject('groupAdd');
const groupDelete    = inject('groupDelete');
const actionAdd      = inject('actionAdd');
const actionDelete   = inject('actionDelete');

</script>

<style scoped>

</style>