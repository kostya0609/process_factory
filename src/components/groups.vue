<template>
  <pre-loader
    :loading="loading"
    class="group-stage-container px-3"
  >
    <label class="block mb-1 font-semibold">Тип группы</label>
    <el-select
      v-model="group.type_id"
      class="w-full mb-2"
      placeholder="Выбрать тип группы"
    >
      <el-option
        v-for="item in group_types"
        :key="'type_' + item.id"
        :label="item.title"
        :value="item.id"
      >
      </el-option>
    </el-select>

    <label class="block mb-1 font-semibold">Тип заполнения группы</label>
    <el-select
      v-model="group.type_fill_id"
      class="w-full mb-2"
      placeholder="Выбрать тип заполнения группы"
    >
      <el-option
        v-for="item in group_fill_types"
        :key="'fill_type_' + item.id"
        :label="item.title"
        :value="item.id"
      >
      </el-option>
    </el-select>

    <hr class="my-3"/>

    <label class="block mb-1 font-semibold">Настройка пресета</label>
    <el-select
      v-model="user"
      class="w-full mb-2"
      @change="userAdd('preset')"
      filterable
      remote
      reserve-keyword
      :remote-method="search"
      placeholder="Введите ФИО"
    >
      <el-option
        v-for="item in users_list"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      />
    </el-select>
    <el-table
      :data="group.preset_participants"
      class="mb-1"
      border
      max-height="600"
      stripe
    >
      <el-table-column label="ФИО">
        <template #default="scope">
          <link-user :user="scope.row.user"/>
        </template>
      </el-table-column>
      <el-table-column width="70" align="center">
        <template #default="scope">
          <el-tooltip
            class="mt-1"
            effect="dark"
            content="Возможность удалить"
            placement="top"
          >
            <el-switch
              v-model="group.preset_participants[scope.$index].can_deletable"
              size="small"
            />
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column width="70" align="center">
        <template #default="scope">
          <el-button
            text
            size="small"
            type="danger"
            @click="group.preset_participants.splice(scope.$index, 1)"
          >
            <el-icon size="large"><Remove /></el-icon>
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <div v-if="group.type_fill_id == 2" class="mt-3">
      <label class="block mb-1 font-semibold">Настройка участников процесса</label>
      <el-select
        v-model="user"
        class="w-full mb-2"
        @change="userAdd('fill')"
        filterable
        remote
        reserve-keyword
        :remote-method="search"
        placeholder="Введите ФИО"
      >
        <el-option
          v-for="item in users_list"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <el-table
        :data="group.filled_participants"
        class="mb-1"
        border
        max-height="600"
        stripe
      >
        <el-table-column label="ФИО">
          <template #default="scope">
            <link-user :user="scope.row"/>
          </template>
        </el-table-column>
        <el-table-column width="70" align="center">
          <template #default="scope">
            <el-button
              text
              size="small"
              type="danger"
              @click="group.filled_participants.splice(scope.$index, 1)"
            >
              <el-icon size="large"><Remove /></el-icon>
            </el-button>

          </template>
        </el-table-column>
      </el-table>

    </div>

  </pre-loader>
</template>

<script setup>

import {ref, reactive, inject} from "vue";
import PreLoader from "@/components/pre_loader";
import LinkUser from "@/components/link_user";
import {UserRepo} from "@/repositories";

const props = defineProps({
  group            : Object,
  group_types      : Array,
  group_fill_types : Array
});

const notify             = inject('notify');

const loading            = ref(false);
const user               = ref('');
const users_list         = reactive([]);

const search     = async(query) => {
  if (!query) return;
  try {
    loading.value = true;
    let result = await UserRepo.search(query);

    users_list.length = 0;
    users_list.push(...result);

  } catch (e) {
    notify({title : 'Ошибка при выполнении запроса поиска пользователя', message : e.message, type : 'error'});
  } finally {
    loading.value = false;
  }
};

const userAdd    = (type) => {
  let err = false, full_name = '', obj = users_list.find(el => el.value === user.value);
  if (obj && obj.label) {
    full_name = obj.label;

    if (type === 'preset') {

      if (props.group.preset_participants.find(el => el.user.id === user.value)) {
        notify({title : 'Добавление пользователя', message : 'Данный пользователь был уже добавлен в пресет', type : 'error'});
        err = true;
      }else{
        props.group.preset_participants.push({user : {id : user.value, full_name}, can_deletable : true});
        err = false;
      }

    }else{

      if (props.group.filled_participants.find(el => el.id === user.value)) {
        notify({title : 'Добавление пользователя', message : 'Данный пользователь был уже добавлен в участники процесса', type : 'error'});
        err = true;
      }else{
        props.group.filled_participants.push({id : user.value, full_name});
        err = false;
      }

    }

    if (!err){
      user.value = '';
      users_list.length = 0;
    }

  }
};


</script>

<style scoped>

</style>
