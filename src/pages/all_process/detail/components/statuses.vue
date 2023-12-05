<template>
  <div class="detail-status-container">
    <el-tabs v-model="active_status" tab-position="left">
      <el-tab-pane
        v-for="status in statuses"
        :key="'status_' + status.sort"
        :label="status.sort+'.'"
        :name="status.sort"
      >
        <div class="flex justify-end">
          <el-tooltip
            class="mt-1"
            effect="dark"
            content="Поднять статус"
            placement="top"
          >
            <el-button
              :disabled="+active_status <= 2 || +active_status === statuses.length"
              @click="upStatus"
            >
              <el-icon size="large"><Top /></el-icon>
            </el-button>
          </el-tooltip>
        </div>

        <div class="grid  grid-cols-[1fr_50px] items-center gap-x-1">

          <div class=" mb-4">
            <label class="block mb-2 font-semibold">ID <copy> {{status.id}}</copy></label>

            <label class="block mb-1 font-semibold">Название</label>
            <el-input
            v-model="status.status_title"
            class="w-full mb-2"
            placeholder="Введите название статуса"
            @change="!status.title ? status.title = 'Новый статус' : ''"
          />

            <div
              v-if="active_status != 1 && active_status != statuses.length"
              class="grid  grid-cols-[1fr_50px] items-center gap-x-2 mb-4"
            >
              <div>
                <label class="block mb-1 font-semibold">Этап</label>
                <el-select
                  v-model="status.stage_id"
                  class="w-full"
                  placeholder="Выбрать этап"
                  @change="changeStage(status.stage_id)"
                >
                  <el-option
                    v-for="(item, idx) in process_data.stages"
                    :key="'stage_' + idx"
                    :label="item.id ? item.title : item.title + ' не был сохранен.'"
                    :value="item.id ? item.id : 'stage_' + idx"
                    :disabled="!item.id"
                  />
                </el-select>
              </div>

              <div>
                <label class="block mb-1 font-semibold"><br/></label>
                <el-button :disabled="stage_idx===null" @click="show_stage=!show_stage">
                  <el-icon v-if="!show_stage"  size="large"><View /></el-icon>
                  <el-icon v-else              size="large"><Hide /></el-icon>
                </el-button>
              </div>

            </div>

            <card-stage
              v-if="show_stage"
              v-model:stage = "process_data.stages[stage_idx]"
              class="mb-4"
              :group_types="group_types"
              :group_fill_types="group_fill_types"
              :action_types="action_types"
              :stage_idx="stage_idx"
              @stageTitleEdit="stageTitleEdit"
              @stageSave="stageSave"
              @groupAdd="groupAdd"
              @groupDelete="groupDelete"
              @actionDelete="actionDelete"
              @actionAdd="actionAdd"
              :can_delete_stage="false"
            />

          </div>

          <div
            v-if="active_status != 1 && active_status != statuses.length"
            class="flex justify-center items-end "
          >
            <el-tooltip
              class="mt-1"
              effect="dark"
              content="Удалить статус"
              placement="top"
            >
              <el-button
                text
                type="danger"
                @click="statusDelete"
              >
                <el-icon size="large"><Remove /></el-icon>
              </el-button>
            </el-tooltip>
          </div>

        </div>

        <div class="flex justify-end">
          <el-tooltip
            class="mt-1"
            effect="dark"
            content="Опустить статус"
            placement="top"
          >
           <el-button
            :disabled="+active_status > statuses.length - 2 || +active_status === 1"
            @click="downStatus"
            >
              <el-icon size="large"><Bottom /></el-icon>
            </el-button>
          </el-tooltip>
        </div>
      </el-tab-pane>
    </el-tabs>

    <div
      v-if="!show_list_statuses"
      class="h-full flex justify-center items-center"
    >
      <el-tooltip
        class="mt-1"
        effect="dark"
        content="Добавить статус"
        placement="top"
      >
        <el-button
          class="my-3"
          circle
          size="large"
          @click="clickAddStatus"
        >
          <el-icon><Plus/></el-icon>
        </el-button>
      </el-tooltip>
    </div>

    <div v-if="show_list_statuses" class="flex justify-center items-center">
      <el-select
        v-model="new_status_id"
        ref="ref_new_status"
        class="w-1/3 my-3"
        filterable
        placeholder="Выбрать статус"
        @change="statusAdd"
        @blur="show_list_statuses=false"
      >
        <el-option
          v-for="item in list_statuses"
          :key="item.id"
          :label="item.title"
          :value="item.id"
        >
        </el-option>
      </el-select>
    </div>
  </div>
</template>

<script setup>

import copy from"@/components/copy"
import cardStage from "./card_stage";
import {ref, inject, watch} from "vue";
import {ElMessageBox} from "element-plus";

const props = defineProps({
  statuses         : Array,
  list_statuses    : Array,
  group_types      : Array,
  group_fill_types : Array,
  action_types     : Array
});

const process_data       = inject('process_data');
const stageTitleEdit     = inject('stageTitleEdit');
const stageSave          = inject('stageSave');
const groupAdd           = inject('groupAdd');
const groupDelete        = inject('groupDelete');
const actionAdd          = inject('actionAdd');
const actionDelete       = inject('actionDelete');

const active_status      = ref(1);

const show_list_statuses = ref(false);
const new_status_id      = ref(null);
const ref_new_status     = ref();

const show_stage         = ref(false);

const stage_idx          = ref(null);

const changeStage        = (stage_id) => {
  stage_idx.value = stage_idx.value = process_data.stages.findIndex(el => el.id == stage_id);
};

const clickAddStatus     = () => {
  show_list_statuses.value = true;
  setTimeout(()=>{ref_new_status.value.focus()}, 0);
};

const statusAdd          = () => {
  let len = process_data.statuses.length;
  process_data.statuses[len - 1].sort = process_data.statuses[len - 1].sort + 1;
  process_data.statuses.push({
    id           : new_status_id.value,
    sort         : len,
    stage        : null,
    stage_id     : null,
    status_title : props.list_statuses.find(el => el.id == new_status_id.value).title,
  });
  process_data.statuses.sort((a, b) => a.sort > b.sort ? 1 : -1);
  new_status_id.value = null;
  active_status.value = len;
  show_list_statuses.value = false;
};

const statusDelete       = () => {
  ElMessageBox.confirm(`Вы уверены, что хотите удалить статус?`)
      .then(() => {
        process_data.statuses.splice(active_status.value - 1, 1);
        process_data.statuses.forEach((el, idx) => el.sort = idx + 1);
        show_stage.value = false;
      })
      .catch(() => {})
};

const upStatus           = () => {
  process_data.statuses[+active_status.value - 2].sort = +active_status.value;
  process_data.statuses[+active_status.value - 1].sort = +active_status.value - 1;
  process_data.statuses.sort((a, b) => a.sort > b.sort ? 1 : -1);
};

const downStatus         = () => {
  process_data.statuses[+active_status.value].sort = +active_status.value;
  process_data.statuses[+active_status.value - 1].sort = +active_status.value + 1;
  process_data.statuses.sort((a, b) => a.sort > b.sort ? 1 : -1);
};

watch(
    () => active_status.value,
    () => {
      show_stage.value = false;
      if(active_status.value != 1 && active_status.value != props.statuses.length){
        let stage_id = process_data.statuses[active_status.value - 1].stage_id;
        if(stage_id !== null) stage_idx.value = stage_idx.value = process_data.stages.findIndex(el => el.id == stage_id);
          else stage_idx.value = null;
      }
    }
)

</script>

<style scoped>

</style>