<template>
  <pre-loader
    :loading="loading"
  >

    <h3 class="my-3">Список статусов процессов</h3>

    <el-table
      :data="status_table"
      class="my-3"
      border
      max-height="600"
      stripe
    >
        <el-table-column prop="id"     label="ID" width="70"/>
        <el-table-column prop="title" label="Название"       >
          <template #default="scope">
            <span v-if="!scope.row.can_edit">{{scope.row.title}}</span>
            <div v-else class="">
              <el-input
                v-model="status_table[scope.$index].title"
                @input="status_table[scope.$index].was_changed = true"
                placeholder="Введите название статуса"
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
              @click="status_table[scope.$index].can_edit = true"
            >
              <el-icon><Setting /></el-icon>
            </el-button>

            <el-button
              v-else
              size="small"
              type="info"
              @click="cancelEdit(scope.$index)"
              :disabled="status_table[scope.$index].is_new"
            >
              <el-icon><RefreshLeft /></el-icon>
            </el-button>

            <el-button
              v-if="!scope.row.was_changed"
              size="small"
              type="danger"
              @click="deleteStatus(scope.$index, scope.row)"
              :disabled="!scope.row.can_deletable"
            >
              <el-icon><Remove /></el-icon>
            </el-button>

            <el-button
              v-else
              size="small"
              type="primary"
              @click="saveStatus(scope.$index, scope.row)"
              :disabled="status_table[scope.$index].title.length < 3"
            >
              <el-icon><Check /></el-icon>
            </el-button>

          </template>
        </el-table-column>
    </el-table>

    <div class="my-3 flex justify-center">
      <el-tooltip
        class="mt-1"
        effect="dark"
        content="Добавить статус"
        placement="top"
      >
        <el-button
          circle
          size="large"
          @click="addStatus"
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
import {StatusRepo} from "@/repositories";

const notify              = inject('notify');
const user                = inject('user');

const router              = useRouter();

const loading             = ref(false);
const status_table        = reactive([]);

const addStatus           = () => {
  status_table.push(
      {title : '', old_title : '', can_edit  : true, can_deletable : true, was_changed : true, is_new : true}
  );
};

const cancelEdit          = (idx) => {
  status_table[idx].title       = status_table[idx].old_title;
  status_table[idx].was_changed = false;
  status_table[idx].can_edit    = false;
};

const saveStatus          = async(idx, row) => {
  try {
    loading.value = true;
    let result = '';

    if (status_table[idx].is_new){

      result = await StatusRepo.create({
        title   : row.title,
        user_id : user.id,
      });

      status_table[idx].id     = result.data.id;
      status_table[idx].is_new = false;

    }else{

      result = await StatusRepo.update({
        id      : row.id,
        title   : row.title,
        user_id : user.id,
      });

    }

    status_table[idx].was_changed = false;
    status_table[idx].can_edit    = false;

  } catch (e) {
    if (e !== 'cancel')
      notify({title : 'Ошибка при выполнении запроса создания статуса', message :e.message, type : 'error', duration : 5000});
  } finally {
    loading.value = false;
  }
};

const deleteStatus        = async (idx, row) => {
  try {
    await ElMessageBox.confirm(`Вы уверены, что хотите удалить статус ${row.title}?`);
    loading.value = true;
    await StatusRepo.delete({
      id      : row.id,
      user_id : user.id,
    });

    status_table.splice(idx, 1);
    notify({title : 'Удаление статуса', message : '', type : 'success', duration : 2000});

  } catch (e) {
    if (e !== 'cancel')
      notify({title : 'Ошибка при выполнении запроса удаление статуса', message :e.message, type : 'error', duration : 5000});
  } finally {
    loading.value = false;
  }
};

const getData             = async() => {
  try {
    loading.value = true;
    let result = await StatusRepo.list({
      user_id : user.id,
    });

    if(result.data){
      status_table.length = 0;
      result.data.forEach(item => status_table.push({
        ...item,
        old_title   : item.title,
        can_edit    : false,
        was_changed : false,
        is_new      : false
      }))
    }

  } catch (e) {
    notify({title : 'Ошибка при выполнении запроса на полученние данных о статусах процессов', message :e.message, type : 'error', duration : 5000});
  }
  finally {
    loading.value = false;
  }

};
getData();

</script>

<style scoped>

</style>