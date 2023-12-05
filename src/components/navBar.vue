<template>
  <div class="relative">
    <el-menu
      :default-active="activeIndex"
      mode="horizontal"
      :router=true
    >
    <template v-for="(item, key) in menu" :key="key">
      <el-menu-item :index="item.path"> {{item.name}} </el-menu-item>
    </template>

    </el-menu>
    <el-button
      v-if="route.meta.right_button.show"
      type="primary"
      class="absolute right-0 top-3 uppercase "
      @click="router.push({path : route.meta.right_button.path})"
    >
      {{'Добавить ' + route.meta.right_button.label}}
    </el-button>
  </div>

</template>

<script setup>

import {ref, reactive, watchEffect, inject, computed} from "vue";
import {useRoute, useRouter} from 'vue-router'


const user     = inject('user');
const route    = useRoute();
const router   = useRouter();

const menu     = reactive([]);
const full_access = computed(() => {
  return user.rights.includes('full_access')
});
router
  .getRoutes()
  .filter(el => el.meta.name)
  .sort((a, b) => a.meta.order > b.meta.order ? 1 : -1)
  .forEach(el => {
    if (!el.meta || !el.meta.full_access)
      menu.push({path : el.path, name : el.meta.name, order : el.meta.order})
        else
          el.meta. full_access === full_access.value ? menu.push({path : el.path, name : el.meta.name, order : el.meta.order}) : '';
    })

const activeIndex = ref(null);

watchEffect(() => {activeIndex.value = route.path});

</script>

<style scoped>

</style>