<template>
  <pre-loader
    :loading="loading"
    class="detail-container"
  >
    <div class="flex justify-between pb-4">
      <h3>Просмотр процесса № {{route.params.id}}.</h3>
      <returnButton class="no-print"/>
    </div>
    <el-tabs type="border-card" v-model="page">

      <el-tab-pane label="Процесс" name="process">
        <process
          v-model:process="process_data.process"
          :errors="errors"
        />
      </el-tab-pane>
      <el-tab-pane label="Этапы" name="stages">
        <stages
          v-model:stages="process_data.stages"
          :group_types="group_types"
          :group_fill_types="group_fill_types"
          :action_types="action_types"
        />
      </el-tab-pane>
      <el-tab-pane label="Статусы" name="statuses">
        <statuses
          v-model:statuses="process_data.statuses"
          :list_statuses="list_statuses"
          :group_types="group_types"
          :group_fill_types="group_fill_types"
          :action_types="action_types"
        />
      </el-tab-pane>
    </el-tabs>

    <el-button
      v-if="page!=='stages'"
      type="primary"
      class="mt-3"
      @click="processSave"
    >
      Сохранить процесс
    </el-button>

  </pre-loader>

</template>

<script setup>
import {useRouter, useRoute} from 'vue-router';
import {ref, inject, reactive, provide, watchEffect} from "vue";
import preLoader from "@/components/pre_loader";
import returnButton from "@/components/return_button";
import process from "@/pages/all_process/detail/components/process";
import stages from "@/pages/all_process/detail/components/stages";
import statuses from "@/pages/all_process/detail/components/statuses";

import {ProcessRepo, StageRepo, StatusRepo, TypeRepo} from "@/repositories";
import {ElMessageBox} from "element-plus";

const router           = useRouter();
const route            = useRoute();

const notify           = inject('notify');
const user             = inject('user');

const loading          = ref(false);
const page             = ref('process');

const process_data     = reactive({
  process         : {
    title         : '',
    module_name   : '',
    document_link : '',
    user          : {},
  },
  stages          : [],
  statuses        : [],
});

const errors           = reactive({
  title         : '',
  module_name   : '',
  document_link : '',
});

const list_statuses    = reactive([]);

const group_types      = reactive([]);

const group_fill_types = reactive([]);

const action_types     = reactive([]);

const getTypes         = async() => {
  try {
    loading.value = true;
    let result = await TypeRepo.list();
    if (result.data){
      group_types.length = 0;
      group_fill_types.length = 0;
      action_types.length = 0;

      group_types.push(...result.data.group_types);
      group_fill_types.push(...result.data.group_fill_types);
      action_types.push(...result.data.action_types);
    }

  } catch (e) {
      notify({title : 'Ошибка при выполнении запроса на получение типов групп/действия', message :e.message, type : 'error', duration : 5000});
  } finally {
    loading.value = false;
  }
};
await getTypes();

const getData          = async() => {
  try {
    loading.value = true;
    let result = await ProcessRepo.get({
       id      : +route.params.id,
       user_id : user.id,
    });
    if (result.data){
      process_data.process.title         = result.data.title;
      process_data.process.module_name   = result.data.module_name;
      process_data.process.document_link = result.data.document_link;
      process_data.process.user          = result.data.user;

      process_data.stages                = result.data.stages;

      process_data.statuses              = result.data.statuses;
      process_data.statuses.forEach(el => el.stage_id = el.stage ? el.stage.id : null);
      process_data.statuses.sort((a, b) => a.sort > b.sort ? 1 : -1);
    }

  } catch (e) {
      notify({title : 'Ошибка при выполнении запроса на получение данных процесса', message :e.message, type : 'error', duration : 5000});
  } finally {
    loading.value = false;
  }
};
await getData();

const getListStatuses  = async() => {
  try {
    loading.value = true;
    let result = await StatusRepo.list({
      user_id : user.id,
    });

    if(result.data) {
      list_statuses.length = 0;

      result.data.forEach(el => {if(el.id !=1 && el.id != 2) list_statuses.push(el)});
    }

  } catch (e) {
    notify({title : 'Ошибка при выполнении запроса на полученние данных о статусах процессов', message :e.message, type : 'error', duration : 5000});
  }
  finally {
    loading.value = false;
  }

};
await getListStatuses();

const stageTitleEdit   = (text, stage_idx) => {
  process_data.stages[stage_idx].title = text;
};

const stageAdd         = async  () => {
  process_data.stages.push({
    id          : null,
    groups      : [{
      id                  : null,
      filled_participants : [],
      preset_participants : [],
      type_id : 2,
      type_fill_id : 1,
    }],
    actions     : [{id : null, is_commentable : false, title : 'Новое действие', type_id : 1}],
    is_hidden   : false,
    is_required : false,
    title       : 'Новый этап',
  });
};

const stageDelete      = async (stage_id, stage_idx) => {
  try {
    await ElMessageBox.confirm(`Вы уверены, что хотите УДАЛИТЬ этап ${process_data.stages[stage_idx].title} ?`);
    if (stage_id !== null ){
      loading.value = true;
      let result = await StageRepo.delete({
        id      : stage_id,
        user_id : user.id,
      });
      if(result.success) process_data.stages.splice(stage_idx, 1);

    }else {
      process_data.stages.splice(stage_idx, 1);
    }

  } catch (e) {
    if (e !== 'cancel')
      notify({title : 'Ошибка при удалении этапа', message :e.message, type : 'error', duration : 5000});
  } finally {
    loading.value = false;
  }
};

const stageSave        = async (stage_id, stage_idx) => {

  let currentStage = process_data.stages[stage_idx];

  if(!currentStage.title || currentStage.actions.length == 0){
    notify({title : 'Ошибка при сохранении этапа', message : 'У этапа обязательно должно быть название и хотя бы одно действие.', type : 'error', duration : 5000});
    return
  }

  let sendStage = {};

  if(stage_id !== null) sendStage.id = currentStage.id;

  sendStage.is_hidden   = currentStage.is_hidden;
  sendStage.is_required = currentStage.is_required;
  sendStage.title       = currentStage.title;
  sendStage.actions     = [];
  sendStage.groups      = [];

  currentStage.groups.forEach(el => {
    let group = {};
    if(el.id) group.id = el.id;
    group.type_fill_id = el.type_fill_id;
    group.type_id = el.type_id;
    group.preset_participants = [];
    el.preset_participants.forEach(user =>
        group.preset_participants.push({
          can_deletable : user.can_deletable,
          user_id       : user.user.id,
        })
    );
    group.filled_participants = [];
    el.filled_participants.forEach(user =>
        group.filled_participants.push(user.id)
    );
    sendStage.groups.push(group);
  })

  currentStage.actions.forEach(el => {
    let action = {};
    if(el.id) action.id = el.id;
    action.title = el.title;
    action.is_commentable = el.is_commentable;
    action.type_id = el.type_id;
    sendStage.actions.push(action);
  })

  let result = null;
  try {
    loading.value = true;
    if (stage_id !== null ){
      result = await StageRepo.update({
        template_id :  +route.params.id,
        user_id    : user.id,
        ...sendStage,
      });

    }else {
      result = await StageRepo.create({
        template_id :  +route.params.id,
        user_id     : user.id,
        id          : null,
        ...sendStage,
      });
      if(result.success && result.data) process_data.stages[stage_idx].id = result.data.id;
    }

    notify({title : 'Cохранение этапа', message : '', type : 'success', duration : 2000});

  } catch (e) {
    notify({title : 'Ошибка при сохранении этапа', message :e.message, type : 'error', duration : 5000});
  } finally {
    loading.value = false;
  }

};

const groupAdd         = (stage_idx) => {
  process_data.stages[stage_idx].groups.push({
    id                  : null,
    filled_participants : [],
    preset_participants : [],
    type_id : 2,
    type_fill_id :1,
  });
};

const groupDelete      = (stage_idx, group_idx) => {
  ElMessageBox.confirm(`Вы уверены, что хотите удалить группу?`)
      .then(() => {
        process_data.stages[stage_idx].groups.splice(group_idx, 1);
      })
      .catch(() => {})
};

const actionAdd        =  (stage_idx) => {
  process_data.stages[stage_idx].actions.push({
    id             : null,
    title          : 'Новое действие',
    is_commentable : false,
    type_id        : 1,
  });
};

const actionDelete     =  (stage_idx, action_idx) => {
  ElMessageBox.confirm(`Вы уверены, что хотите удалить действие?`)
      .then(() => {
        process_data.stages[stage_idx].actions.splice(action_idx, 1);
      })
      .catch(() => {})
};

const isValid           = () => {
  let valid = true;
  if (!process_data.process.title)         {errors.title         = 'Необходимо ввести название процесса'; valid = false;}
  if (!process_data.process.module_name)   {errors.module_name   = 'Необходимо ввести название модуля'; valid = false;}
  if (!process_data.process.document_link) {errors.document_link = 'Необходимо ввести путь к документу процесса'; valid = false;}
  return valid;
};

const processSave      = async () => {
  if (!isValid()) return;

  try {
    loading.value = true;
    await ProcessRepo.update({
      id            : +route.params.id,
      user_id       : user.id,
      title         : process_data.process.title,
      module_name   : process_data.process.module_name,
      document_link : process_data.process.document_link,
      statuses      : process_data.statuses,
    });
    notify({title : 'Сохранение процесса', message : '', type : 'success', duration : 2000});

  } catch (e) {
    notify({title : 'Ошибка при выполнении запроса на сохранение процесса', message :e.message, type : 'error', duration : 5000});
  } finally {
    loading.value = false;
  }
};

watchEffect(() => {
  process_data.process.title         ? errors.title         = null : '';
  process_data.process.module_name   ? errors.module_name   = null : '';
  process_data.process.document_link ? errors.document_link = null : '';
})

provide('process_data', process_data);

provide('stageTitleEdit', stageTitleEdit);
provide('stageAdd', stageAdd);
provide('stageDelete', stageDelete);
provide('stageSave', stageSave);

provide('groupAdd', groupAdd);
provide('groupDelete', groupDelete);
provide('actionAdd', actionAdd);
provide('actionDelete', actionDelete);

</script>

<style scoped>

</style>