<template>
  <q-fab
    :color="color"
    :icon="icon"
    :direction="direction"
    data-vue-component-name="Fab"
    @click="$emit('fab-click')"
  >
    <slot />
  </q-fab>
</template>

<script>
export default {
  name: "FabComponent",
  props: {
    color: {
      type: String,
      default: "primary",
    },
    icon: {
      type: String,
      default: "add",
    },
    direction: {
      type: String,
      default: "up",
    },
  },
  emits: ["fab-click"],
};
</script>
