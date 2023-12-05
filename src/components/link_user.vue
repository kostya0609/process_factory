<template>
  <div class="grid grid-cols-[30px_1fr] gap-x-1 items-center">
   <span class="userPhoto photoTable">
     <img :src="user.photo"/>
   </span>
    <el-link :href="user.link" target="blank" :underline="false">
      {{user.full_name}}
    </el-link>
  </div>
</template>

<script setup>
defineProps({
  user: {
    type: Object,
  }
});

</script>

<style scoped>

</style>