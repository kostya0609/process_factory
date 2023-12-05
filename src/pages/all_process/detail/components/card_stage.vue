<template>
  <el-card class="card-stage-container h-full" body-class="!p-2">
    <template #header>
      <div class="flex justify-between items-center">
        <span
          class="grow px-1 outline-none border-solid border border-transparent focus:border-inherit"
          :contenteditable="true"
          @input="emit('stageTitleEdit', $event.target.innerText, stage_idx)"
        >
        {{stage.title}}
        </span>

        <el-space :size="3" :spacer="spacer">
          <el-button
            v-if="can_delete_stage"
            type="danger"
            text
            @click="emit('stageDelete', stage.id, stage_idx);"
          >
            Удалить
          </el-button>
          <el-button
            type="primary"
            text
            @click="emit('stageSave', stage.id, stage_idx);"
          >
            Сохранить
          </el-button>
        </el-space>
      </div>
    </template>


    <el-space :size="3" :spacer="spacer">
      <el-switch
        v-model="stage.is_hidden"
        size="small"
        active-text="Скрытый"
        inactive-text=""
      />
      <el-switch
        v-model="stage.is_required"
        size="small"
        active-text="Обязательный"
        inactive-text=""
      />
    </el-space>

    <label class="block my-2">{{activeTab === 'groups_tab' ? 'Группы' : 'Дествия'}}</label>

    <el-tabs v-model="activeTab" tab-position="right">

      <el-tab-pane name="groups_tab">
        <template #label>
          <el-tooltip
            effect="dark"
            content="Группы"
            placement="top"
          >
            <el-icon><User /></el-icon>
          </el-tooltip>
        </template>
        <el-collapse
          v-model="activeGroup"
          v-for="(group, idx) in stage.groups"
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
                  @click.stop="emit('groupDelete', stage_idx, idx);"
                >
                  <el-icon size="large"><Remove /></el-icon>
                </el-button>
                <label class="block">№ {{(idx + 1)}}</label>
              </div>
            </template>

            <groups
              v-model:group = "stage.groups[idx]"
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
              @click="emit('groupAdd', stage_idx);"
            >
              <el-icon><Plus /></el-icon>
            </el-button>
          </el-tooltip>
        </div>

      </el-tab-pane>

      <el-tab-pane name="actions_tab">
        <template #label>
          <el-tooltip
            effect="dark"
            content="Действия"
            placement="top"
          >
            <el-icon><Cpu /></el-icon>
          </el-tooltip>
        </template>

        <el-collapse
          v-model="activeAction"
          v-for="(action, idx) in stage.actions"
          :key="'action_' + action.id + '_' + idx"
          :accordion="true"
        >
          <el-collapse-item>
            <template #title>
              <div class="w-full flex flex-wrap justify-start items-center leading-normal" >
                <el-button
                  class="mr-1"
                  size="small"
                  text
                  type="danger"
                  @click.stop="emit('actionDelete', stage_idx, idx);"
                >
                  <el-icon size="large"><Remove /></el-icon>
                </el-button>

                <label class="block">{{stage.actions[idx].title}}&nbsp;</label>

                <span v-if="action.id">
                  (ID
                  <copy>
                    {{action.id}}
                  </copy>)
                </span>
                <span v-else>(нет ID)</span>

              </div>
            </template>

            <actions
              v-model:action = "stage.actions[idx]"
              :action_types="action_types"
            />
          </el-collapse-item>
        </el-collapse>
        <div class="my-3 flex justify-center">
          <el-tooltip
            class="mt-1"
            effect="dark"
            content="Добавить действие"
            placement="top"
          >
            <el-button
              circle
              size="large"
              @click="emit('actionAdd', stage_idx);"
            >
              <el-icon><Plus/></el-icon>
            </el-button>
          </el-tooltip>
        </div>

      </el-tab-pane>
    </el-tabs>

  </el-card>
</template>

<script setup>
import {h, ref} from "vue";
import { ElDivider } from 'element-plus'
import copy from "@/components/copy"
import groups from "@/components/groups"
import actions from "@/components/actions"
import List from "@/plagins/manage_access/pages/group/list";

const props = defineProps({
  stage            : Object,
  group_types      : Array,
  group_fill_types : Array,
  action_types     : Array,
  stage_idx        : Number,
  can_delete_stage  :Boolean,
});
const emit = defineEmits([
  'stageDelete', 'stageSave', 'groupAdd', 'groupDelete', 'stageTitleEdit', 'actionDelete', 'actionAdd'
]);

const activeGroup  = ref([]);
const activeAction = ref([]);
const activeTab    = ref('groups_tab');

const spacer = h(ElDivider, { direction: 'vertical' })

</script>

<style scoped>

</style>