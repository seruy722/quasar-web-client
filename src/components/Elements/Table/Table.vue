<template>
  <q-table
    v-model:pagination="pagination"
    v-model:selected="selected"
    :rows="tableData"
    :columns="tableProperties.columns"
    :visible-columns="tableReactiveProperties.visibleColumns"
    :selection="tableProperties.selection || 'multiple'"
    :grid="$q.screen.xs || $q.screen.sm || grid"
    :loading="loading"
    dense
    row-key="id"
    :filter="search"
    :filter-method="filterMethod"
    :rows-per-page-options="[10, 20, 50, 100, 0]"
    :separator="tableProperties.separator || 'cell'"
    :hide-bottom="tableProperties.hideBottom"
    :virtual-scroll-sticky-start="48"
    :sort-method="customSort"
    class="my-sticky-virtscroll-table"
    :style="`height: ${tableHeight}px; overflow: auto;`"
    virtual-scroll
    data-vue-component-name="TableComponent"
  >
    <template v-if="!tableProperties.hideTop" #top="props">
      <div class="col-4 q-mr-md text-bold">
        {{ title }}
      </div>

      <q-space />

      <Search v-model="search" />

      <BaseSelect
        v-model="searchField"
        label="Поле"
        style="min-width: 110px; padding-bottom: 0"
        dense
        options-dense
        :options="searchOptionsFields"
      />

      <q-space />
      <RoundBtn
        :icon="props.inFullscreen ? 'fullscreen_exit' : 'fullscreen'"
        :tooltip="props.inFullscreen ? 'hide' : 'reveal'"
        class="q-mr-sm"
        @round-btn-click="props.toggleFullscreen"
      />
      <slot name="top-buttons" />
    </template>

    <template #body="props">
      <slot name="inner-body" :props="props" />
    </template>

    <template #item="props">
      <slot name="inner-item" :props="props" />
    </template>

    <template #bottom-row>
      <q-tr>
        <q-td colspan="100%">
          <slot name="inner-bottom-row" />
        </q-td>
      </q-tr>
    </template>
  </q-table>
</template>

<script>
import { defineAsyncComponent } from "vue";
import { sortSuper } from "src/utils/sort.js";
import { isEmpty, set as setLodash, assign, get, map, filter } from "lodash";

export default {
  name: "TableComponent",
  components: {
    Search: defineAsyncComponent(
      () => import("src/components/Search/Search.vue"),
    ),
    RoundBtn: defineAsyncComponent(
      () => import("src/components/Buttons/RoundBtn.vue"),
    ),
    BaseSelect: defineAsyncComponent(
      () => import("src/components/Elements/BaseSelect.vue"),
    ),
  },
  props: {
    title: {
      type: String,
      default: "",
    },
    tableProperties: {
      type: Object,
      default: () => ({}),
    },
    tableReactiveProperties: {
      type: Object,
      default: () => ({}),
    },
    tableData: {
      type: Array,
      default: () => [],
    },
    searchData: {
      type: Array,
      default: () => [],
    },
    grid: {
      type: Boolean,
      default: false,
    },
    dataSearch: {
      type: Object,
      default: () => ({}),
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      search: null,
      pagination: {
        rowsPerPage: 20,
      },
      searchField: "Все",
      searchOptionsFields: [],
    };
  },
  computed: {
    selected: {
      get: function get() {
        return this.tableReactiveProperties.selected;
      },
      set: function set(val) {
        setLodash(this.tableReactiveProperties, "selected", val);
      },
    },
    tableHeight() {
      return this.$q.screen.height - 250;
    },
  },
  created() {
    if (!isEmpty(this.dataSearch)) {
      this.search = this.dataSearch.value;
      this.searchField = this.dataSearch.field;
    }

    this.searchOptionsFields = map(
      get(this.tableProperties, "columns"),
      ({ label, name }) =>
        assign(
          {},
          {
            label,
            value: name,
          },
        ),
    );
    this.$nextTick(() => {
      this.searchOptionsFields.unshift({
        label: "Все",
        value: "Все",
      });
    });
  },
  methods: {
    filterMethod(rows, terms, cols, cellValue) {
      const newCols =
        this.searchField === "Все"
          ? cols
          : filter(cols, { name: this.searchField });
      const lowerTerms = terms ? terms.toLowerCase() : "";
      const result = rows.filter((row) =>
        newCols.some(
          (col) =>
            `${cellValue(col, row)} `.toLowerCase().indexOf(lowerTerms) !== -1,
        ),
      );
      // this.$emit('update:searchData', result);
      return result;
    },
    customSort(rows, sortBy, descending) {
      const data = [...rows];
      if (sortBy) {
        sortSuper(data, sortBy, descending);
      }
      return data;
    },
  },
};
</script>

<style lang="scss">
.q-table__top .q-table__bottom thead tr:first-child th {
  background-color: #fff;
}

thead tr:first-child th {
  position: sticky;
  top: 0;
  text-transform: uppercase;
  font-weight: bold;
  opacity: 1;
  z-index: 1;
}
</style>
