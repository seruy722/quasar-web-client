<template>
  <q-btn
    round
    :color="color || 'primary'"
    :label="label"
    :icon="icon"
    :loading="loading"
    data-vue-component-name="RoundBtn"
    @click.stop="$emit('round-btn-click')"
  >
    <q-tooltip
      v-if="tooltip"
      anchor="bottom middle"
      self="top middle"
      :offset="[10, 10]"
    >
      {{ tooltip }}
    </q-tooltip>
    <slot />
  </q-btn>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "RoundBtn",
  props: {
    color: {
      type: String,
      default: "",
    },
    label: {
      type: String,
      default: "",
    },
    icon: {
      type: String,
      default: "",
    },
    tooltip: {
      type: String,
      default: "",
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["round-btn-click"],
});
</script>
