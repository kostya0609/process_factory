<template>
  <pre-loader
    :loading="loading"
     class="approval_routes-container"
  >
    <h3 class="my-3">Список маршрутов</h3>

    <el-table
      :data="approval_routes_table"
      class="my-3"
      border
      max-height="600"
      stripe
    >
      <el-table-column prop="id"    label="ID" width="70"/>
      <el-table-column prop="title" label="Название"      >
        <template #default="scope">
          <span v-if="!scope.row.can_edit">{{scope.row.title}}</span>
          <div v-else class="">
            <el-input
              v-model="approval_routes_table[scope.$index].title"
              @input="approval_routes_table[scope.$index].was_changed = true"
              placeholder="Введите название маршрута"
            >
            </el-input>
          </div>
        </template>
      </el-table-column>
      <el-table-column width="110"  label="Действие" align="center">
        <template #default="scope">
          <el-button
            v-if="!scope.row.can_edit"
            size="small"
            type="info"
            @click="router.push({name : 'detailApprovalRoutes', params : {id : scope.row.id}});"
          >
            <el-icon><Setting /></el-icon>
          </el-button>
          <el-button
            v-if="!scope.row.was_changed"
            size="small"
            type="danger"
            @click="deleteApprovalRoute(scope.$index, scope.row)"
          >
            <el-icon><Remove /></el-icon>
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="my-3 flex justify-center">
      <el-tooltip
        class="mt-1"
        effect="dark"
        content="Добавить маршрут"
        placement="top"
      >
        <el-button
          circle
          size="large"
          @click="addApprovalRoute"
        >
          <el-icon><Plus /></el-icon>
        </el-button>
      </el-tooltip>
    </div>

  </pre-loader>
</template>

<script setup>

import preLoader from "@/components/pre_loader";
import {ref, inject, reactive} from "vue";
import  {ElMessageBox }  from 'element-plus';
import { useRouter } from 'vue-router';
import {ApprovalRoutesRepo} from "@/repositories";
import detailApprovalRoutes from "@/pages/approval_routes/detail";

const notify                = inject('notify');
const user                  = inject('user');

const router                = useRouter();

const loading               = ref(false);
const approval_routes_table = reactive([]);

const addApprovalRoute      = async () => {
  try {
    loading.value = true;
    let result = await ApprovalRoutesRepo.create({
      title   : 'Новый маршрут',
      groups  : [],
      user_id : user.id,
    });
    if (result.success && result.data && result.data.id){
      approval_routes_table.push(
        {title : 'Новый маршрут', id : result.data.id, groups : []}
      );

      notify({title : 'Добавление маршрута', message : '', type : 'success', duration : 2000});
      router.push({name : 'detailApprovalRoutes', params : {id : result.data.id}});
    } else console.log('Проблема на бэке при создании маршрута')

  } catch (e) {
      notify({title : 'Ошибка при выполнении запроса добавление маршрута', message :e.message, type : 'error', duration : 5000});
  } finally {
    loading.value = false;
  }
};

const deleteApprovalRoute   = async (idx, row) => {
  try {
    await ElMessageBox.confirm(`Вы уверены, что хотите удалить маршрут ${row.title}?`);
    if(!row.id){
      approval_routes_table.splice(idx, 1);
      return;
    }

    loading.value = true;
    await ApprovalRoutesRepo.delete({
      id      : row.id,
      user_id : user.id,
    });

    approval_routes_table.splice(idx, 1);
    notify({title : 'Удаление маршрута', message : '', type : 'success', duration : 2000});

  } catch (e) {
    if (e !== 'cancel')
      notify({title : 'Ошибка при выполнении запроса удаление маршрута', message :e.message, type : 'error', duration : 5000});
  } finally {
    loading.value = false;
  }
};

const getData               = async() => {
  try {
    loading.value = true;
    let result = await ApprovalRoutesRepo.list({
      user_id : user.id,
    });

    if(result.data){
      approval_routes_table.length = 0;
      approval_routes_table.push(... result.data)
    }

  } catch (e) {
    notify({title : 'Ошибка при выполнении запроса на полученние данных о маршрутах', message :e.message, type : 'error', duration : 5000});
  }
  finally {
    loading.value = false;
  }

};
getData();

</script>

<style scoped>

</style>