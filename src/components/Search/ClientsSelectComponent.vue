<template>
  <div data-vue-component-name="ClientsSelectComponent">
    <SearchSelect
      v-model="model"
      label="Выберите код клиента"
      :dense="$q.screen.xs || $q.screen.sm"
      :func-load-data="fetchClientList"
      :options="clientsOptions"
    />
  </div>
</template>
<script>
import { defineAsyncComponent, ref, computed, watch } from "vue";
import { useStore } from "vuex";
import { set, toNumber, clone } from "lodash";

export default {
  name: "ClientsSelectComponent",
  components: {
    SearchSelect: defineAsyncComponent(
      () => import("src/components/Elements/SearchSelect.vue"),
    ),
  },
  props: {
    values: {
      type: Object,
      default: () => ({}),
    },
    field: {
      type: String,
      default: null,
    },
  },
  setup(props) {
    const store = useStore();
    const model = ref(null);
    const clientsOptions = computed(() => store.getters["codes/getCodes"]);
    const { field } = props;

    watch(model, (currentValue) => {
      set(props, `values.${field}`, toNumber(currentValue));
    });

    if (props.values[field]) {
      model.value = clone(props.values[field]);
    } else {
      set(props, `values.${field}`, model.value);
    }

    return {
      model,
      clientsOptions,
      fetchClientList() {
        return isEmpty(clientsOptions.value)
          ? store.dispatch("codes/setCodes")
          : new Promise(() => {});
      },
    };
  },
};
</script>
