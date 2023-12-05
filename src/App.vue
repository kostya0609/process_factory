<template>
    <div v-if="isOK">
      <navBar v-if="navBarVisible"/>
      <router-view v-slot="{ Component }">

        <suspense timeout="0">

          <template #default>
            <component
              :is="Component"
              :key="$route.path"
            />
          </template>

          <template #fallback>
            <pre-loader
              class="mx-auto"
              :loading="true"
            />
          </template>

        </suspense>

      </router-view>
    </div>
</template>

<script setup>
import {ref, provide, reactive, computed} from "vue";
import {useRouter, useRoute} from 'vue-router';
import navBar from "@/components/navBar";
import PreLoader from "@/components/pre_loader";
import {ElNotification} from "element-plus";
import {AccessesRepo} from "@/repositories";

    const router        = useRouter();

    const user          = reactive({
      id                : 14317,
      rights            : [],
      additional_rights : {},
    });
    const notify        = ({title = '', message = '', type = '', duration = 3000} = {}) => {
      ElNotification({
        title,
        message,
        type,
        duration,
        dangerouslyUseHTMLString: true,
      })
    };

    const loading       = ref(false);
    const isOK          = ref(null);
    const timerId       = ref(null);

    const navBarVisible = computed(() => {
      let currentRoute = router.currentRoute.value.name;
      return['myProcess', 'allProcess', 'listGroup', 'listRight', 'listAdditionalRight', 'listStatus', 'listApprovalRoutes'].includes(currentRoute)
    });

    const initData      = async() => {
      window._userId ? user.id      = window._userId : user.id      = null;
      window._token  ? window.token = window._token  : window.token = null;
    }

    const auth          = async() => {
      loading.value = true;
      await initData();
      if (window.token) {
        setTimeout(() => {clearInterval(timerId.value)});
        try {
          loading.value = true;

          let result = await AccessesRepo.rights({
            user_id : user.id,
            module  : 'BusinessProcess',
          });

          if(result.data){
            isOK.value = true;
            user.rights.push(...result.data.rights);
            user.additional_rights = result.data.additional_rights;
          }else{
            user.rights            = [];
            user.additional_rights = [];
            isOK.value  = false;
          }

        } catch (e) {
          notify({title : 'Проблема с получением данных с сервера', message : e.message, type : 'error'});
        } finally {
          loading.value = false;
        }

      } else {
        user.rights = [];
        user.additional_rights = [];
        isOK.value        = false;
        notify({title : 'Проблема с авторизацией на портале', message : 'Нет токена.', type : 'error'});
        timerId.value   = setInterval(async () => await initData(), 15000 );
      };
    };
    auth();

    let gridsData       = reactive({
      businessProcessMyList               : {
        paginationData  : {page : 1, count : 10},
        sortData        : {name: "id", order: "desc"},
        filterData      : {},
        showValueFilter : [],
        activeProfile   : null,
      },
      businessProcessAllList : {
        paginationData  : {page : 1, count : 10},
        sortData        : {name: "id", order: "desc"},
        filterData      : {},
        showValueFilter : [],
        activeProfile   : null,
      }
    });

    provide('user', user);
    provide('notify', notify);
    provide('gridsData', gridsData);



</script>


<style>

</style>
