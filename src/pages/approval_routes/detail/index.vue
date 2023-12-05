<template>
  <pre-loader
    :loading="loading"
    class="detail-approval_routes-container"
  >
    <div class="flex justify-between pb-4">
      <h3>Просмотр маршрута № {{route.params.id}}.</h3>
      <returnButton class="no-print"/>
    </div>

    <el-tabs type="border-card" v-model="page">

      <el-tab-pane label="Маршрут" name="info">
        <info
          v-model:data="approval_route.info"
          :errors="errors"
        />
      </el-tab-pane>
      <el-tab-pane label="Группы" name="groups">
        <groups
          v-model:data="approval_route.groups"
          :group_types="group_types"
          :group_fill_types="group_fill_types"
          @groupAdd="groupAdd"
          @groupDelete="groupDelete"
        />
      </el-tab-pane>
    </el-tabs>

    <el-button
      type="primary"
      class="mt-3"
      @click="approvalRouteSave"
    >
      Сохранить маршрут
    </el-button>

  </pre-loader>
</template>

<script setup>
import preLoader from "@/components/pre_loader";
import returnButton from "@/components/return_button";
import info from "@/pages/approval_routes/detail/components/info"
import groups from "@/pages/approval_routes/detail/components/groups"
import {ref, reactive, inject, watchEffect} from "vue";
import {useRouter, useRoute} from "vue-router/dist/vue-router";
import {ApprovalRoutesRepo, TypeRepo} from "@/repositories";
import {ElMessageBox} from "element-plus";

const notify            = inject('notify');
const user              = inject('user');

const router            = useRouter();
const route             = useRoute();

const loading           = ref(false);
const page              = ref('info');

const approval_route    = reactive({
  info   : {
    title: '',
  },
  groups : [],
});

const errors            = reactive({
  title : '',
});

const group_types       = reactive([]);

const group_fill_types  = reactive([]);

const getTypes          = async() => {
  try {
    loading.value = true;
    let result = await TypeRepo.list();
    if (result.data){
      group_types.length = 0;
      group_fill_types.length = 0;

      group_types.push(...result.data.group_types);
      group_fill_types.push(...result.data.group_fill_types);
    }

  } catch (e) {
    notify({title : 'Ошибка при выполнении запроса на получение типов групп/действия', message :e.message, type : 'error', duration : 5000});
  } finally {
    loading.value = false;
  }
};
await getTypes();

const getData           = async() => {
  try {
    loading.value = true;
    let result = await ApprovalRoutesRepo.get({
      id      : route.params.id,
      user_id : user.id,
    });
    if (result.success && result.data){
      approval_route.info.title = result.data.title;
      approval_route.groups     = result.data.groups;
    }

  } catch (e) {
      notify({title : 'Ошибка при выполнении запроса на получение данных маршрута', message :e.message, type : 'error', duration : 5000});
  } finally {
    loading.value = false;
  }
};
await getData();

const groupAdd          = () => {
  approval_route.groups.push({
    id                  : null,
    filled_participants : [],
    preset_participants : [],
    type_id : 2,
    type_fill_id :1,
  });
};

const groupDelete       = (idx) => {
  ElMessageBox.confirm(`Вы уверены, что хотите удалить группу?`)
      .then(() => {
        approval_route.groups.splice(idx, 1);
      })
      .catch(() => {})
};

const isValid           = () => {
  let valid = true;
  if (!approval_route.info.title) {errors.title = 'Необходимо ввести название маршрута'; valid = false;}
  return valid;
};

const approvalRouteSave = async() => {
  if (!isValid()) return;

  let send_approval_routes = {};
  send_approval_routes.id     = route.params.id;
  send_approval_routes.title  = approval_route.info.title;
  send_approval_routes.groups = [];

  approval_route.groups.forEach(el => {
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
    send_approval_routes.groups.push(group);
  })

  try {
    loading.value = true;
    let result = await ApprovalRoutesRepo.update({
      user_id : user.id,
      ...send_approval_routes,
    });
    if (result.success){
      notify({title : 'Сохранение маршрута', message : '', type : 'success', duration : 2000});
      router.push({name : 'listApprovalRoutes'});
    }

  } catch (e) {
    notify({title : 'Ошибка при выполнении запроса на обновление маршрута', message :e.message, type : 'error', duration : 5000});
  } finally {
    loading.value = false;
  }
};

watchEffect(() => {
  approval_route.info.title ? errors.title = null : '';
})

</script>

<style scoped>

</style>