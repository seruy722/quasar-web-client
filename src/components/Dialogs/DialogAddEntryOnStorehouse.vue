<template>
  <DialogComponent
    v-model:dialog="show"
    :persistent="true"
    title="Запись"
    data-vue-component-name="DialogAddEntryOnStorehouse"
  >
    <Card style="min-width: 320px; width: 100%; max-width: 900px">
      <CardSection class="row justify-between bg-grey q-mb-sm">
        <span class="text-h6">{{
          entryData.row ? "Редактирование" : "Новая запись"
        }}</span>
        <div class="row justify-center">
          <IconBtn
            v-if="entryData.row"
            dense
            icon="history"
            tooltip="История"
            @icon-btn-click="
              entryData.historyFunc(entryData.row.id, entryData.cols)
            "
          />
          <MenuComponent :items="['Код', 'Клиента', 'Категорию']" />

          <IconBtn
            dense
            icon="clear"
            tooltip="Закрыть"
            @icon-btn-click="close(storehouseData)"
          />
        </div>
      </CardSection>
      <CardSection>
        <div class="fit row wrap justify-start items-start content-start">
          <div
            v-for="(item, index) in storehouseData"
            :key="index"
            class="col-xs-12 col-sm-4 col-md-4 col-lg-4 q-pt-md q-px-sm bg-white"
          >
            <BaseInput
              v-if="item.type === 'text'"
              v-model.trim="item.value"
              v-model:change-value="item.changeValue"
              :label="item.label"
              :autofocus="item.autofocus"
              :type="item.type"
              :mask="item.mask"
              :dense="$q.screen.xs || $q.screen.sm"
              :field="index"
              :readonly="item.readonly"
              :disable="item.disable"
              :errors="errorsData"
            />

            <BaseInput
              v-else-if="item.type === 'number'"
              v-model.number="item.value"
              v-model:change-value="item.changeValue"
              :label="item.label"
              :type="item.type"
              :mask="item.mask"
              :dense="$q.screen.xs || $q.screen.sm"
              :field="index"
              :disable="item.disable"
              :errors="errorsData"
            />

            <SelectChips
              v-else-if="item.type === 'select-chips'"
              v-model="item.value"
              v-model:change-value="item.changeValue"
              :label="item.label"
              :field="index"
              :dense="$q.screen.xs || $q.screen.sm"
              :options="item.options"
              :func-load-data="item.funcLoadData"
              :errors="errorsData"
            />

            <SearchSelect
              v-else
              v-model="item.value"
              v-model:change-value="item.changeValue"
              :label="item.label"
              :field="index"
              :dense="$q.screen.xs || $q.screen.sm"
              :options="item.options"
              :func-load-data="item.funcLoadData"
              :errors="errorsData"
            />
          </div>
        </div>

        <CheckBox v-model="withoutThings" label="Без описи вложения" />
        <IconBtn
          v-if="things && !withoutThings"
          color="positive"
          icon="edit"
          :dense="$q.screen.xs || $q.screen.sm"
          tooltip="Редактировать"
          class="q-ml-md"
          @icon-btn-click="showThingsDialog = true"
        />
        <IconBtn
          v-else-if="!withoutThings"
          icon="add"
          :dense="$q.screen.xs || $q.screen.sm"
          tooltip="Добавить"
          class="q-ml-md"
          @icon-btn-click="showThingsDialog = true"
        />
        <div v-show="!withoutThings">
          <List dense bordered padding separator class="q-px-sm">
            <ItemLabel>
              <div class="row items-center">
                <div>Опись вложения</div>
                <DialogAddThings
                  v-model:things="things"
                  v-model:show-dialog="showThingsDialog"
                  v-model:change-things="changeThings"
                />
              </div>
            </ItemLabel>
            <ListItem class="text-bold">
              <ItemSection>Название</ItemSection>
              <ItemSection>Количество</ItemSection>
            </ListItem>

            <ListItem
              v-for="({ title, count }, index) in thingsList"
              :key="index"
              v-ripple
              clickable
            >
              <ItemSection>{{ title }}</ItemSection>
              <ItemSection>{{ count }}</ItemSection>
            </ListItem>
          </List>
        </div>
      </CardSection>
      <Separator />
      <CardActions>
        <BaseBtn
          :label="$t('save')"
          color="positive"
          icon="save"
          :size="size"
          @click-base-btn="checkErrors(storehouseData, saveData)"
        />

        <BaseBtn
          :label="$t('clear')"
          color="negative"
          icon="clear"
          :size="size"
          @click-base-btn="clear(storehouseData)"
        />

        <BaseBtn
          :label="$t('close')"
          color="negative"
          icon="cancel"
          :size="size"
          @click-base-btn="close(storehouseData)"
        />
      </CardActions>
    </Card>
  </DialogComponent>
</template>

<script>
import CheckErrorsMixin from "src/mixins/CheckErrors";
import { getUrl } from "src/tools/url";
import showNotif from "src/mixins/showNotif";
import {
  getClientCodes,
  getCategories,
  getShopsList,
  setFormatedDate,
  setChangeValue,
} from "src/utils/FrequentlyCalledFunctions";
import DialogComponent from "src/components/Dialogs/DialogComponent.vue";
import DialogAddThings from "src/components/Dialogs/DialogAddThings.vue";
import IconBtn from "src/components/Buttons/IconBtn.vue";
import BaseInput from "src/components/Elements/BaseInput.vue";
import SearchSelect from "src/components/Elements/SearchSelect.vue";
import List from "src/components/Elements/List/List.vue";
import ItemSection from "src/components/Elements/List/ItemSection.vue";
import ItemLabel from "src/components/Elements/List/ItemLabel.vue";
import ListItem from "src/components/Elements/List/ListItem.vue";
import Card from "src/components/Elements/Card/Card.vue";
import CardActions from "src/components/Elements/Card/CardActions.vue";
import CardSection from "src/components/Elements/Card/CardSection.vue";
import BaseBtn from "src/components/Buttons/BaseBtn.vue";
import Separator from "src/components/Separator.vue";
import SelectChips from "src/components/Elements/SelectChips.vue";
import CheckBox from "src/components/Elements/CheckBox.vue";
import MenuComponent from "src/components/Menu.vue";
import { get, reduce, isEmpty, forEach, set, has, startCase } from "lodash";

export default {
  name: "DialogAddEntryOnStorehouse",
  components: {
    DialogComponent,
    DialogAddThings,
    IconBtn,
    BaseInput,
    SearchSelect,
    List,
    ItemSection,
    ItemLabel,
    ListItem,
    Card,
    CardActions,
    CardSection,
    BaseBtn,
    Separator,
    SelectChips,
    CheckBox,
    MenuComponent,
  },
  mixins: [CheckErrorsMixin, showNotif],
  props: {
    showDialog: {
      type: Boolean,
      default: false,
    },
    entryData: {
      type: Object,
      default: () => ({}),
    },
  },
  emits: ["update:entryData", "update:showDialog"],
  data() {
    return {
      show: false,
      withoutThings: false,
      showThingsDialog: false,
      changeThings: false,
      things: null,
      storehouseData: {
        code_place: {
          name: "code_place",
          type: "text",
          label: "Код",
          mask: "###/###/###",
          rules: [
            {
              name: "isLength",
              error: "Минимальное количество символов 11.",
              options: {
                min: 11,
                max: 11,
              },
            },
          ],
          require: true,
          requireError: "Поле обьзательное для заполнения.",
          autofocus: true,
          readonly: false,
          changeValue: false,
          default: "",
          value: "",
        },
        code_client_id: {
          name: "code_client_id",
          type: "select",
          label: "Клиент",
          options: [],
          require: true,
          requireError: "Выберите значение.",
          changeValue: false,
          funcLoadData: getClientCodes,
          default: null,
          value: null,
        },
        kg: {
          name: "kg",
          type: "number",
          label: "Вес",
          require: true,
          requireError: "Поле обьзательное для заполнения.",
          changeValue: false,
          default: 0,
          value: 0,
        },
        cube: {
          name: "cube",
          type: "number",
          label: "Куб",
          require: false,
          requireError: "Поле обьзательное для заполнения.",
          changeValue: false,
          default: 0,
          value: 0,
        },
        category_id: {
          name: "category_id",
          type: "select",
          label: "Категория",
          options: [],
          require: true,
          requireError: "Выберите значение.",
          changeValue: false,
          funcLoadData: getCategories,
          default: null,
          value: null,
        },
        shop: {
          name: "shop",
          type: "select-chips",
          label: "Магазин",
          options: [],
          changeValue: false,
          funcLoadData: getShopsList,
          default: null,
          value: null,
        },
        notation: {
          name: "notation",
          type: "text",
          label: "Примечания",
          changeValue: false,
          default: "",
          value: "",
        },
      },
    };
  },
  computed: {
    thingsList() {
      if (this.things) {
        return JSON.parse(this.things);
      }
      return this.things;
    },
    categories() {
      return this.$store.getters["category/getCategories"];
    },
    clientCodes() {
      return this.$store.getters["codes/getCodes"];
    },
    shopList() {
      return this.$store.getters["shopsList/getShopsList"];
    },
    size() {
      const { sm, xs, md, lg } = this.$q.screen;

      let size = "";
      if (sm) {
        size = "sm";
      } else if (xs) {
        size = "xs";
      } else if (md) {
        size = "md";
      } else if (lg) {
        size = "lg";
      }
      return size;
    },
  },
  watch: {
    entryData(val) {
      if (!isEmpty(val)) {
        forEach(this.storehouseData, (item, index) => {
          if (get(this.entryData, `row[${index}]`)) {
            set(item, "value", get(this.entryData, `row[${index}]`));
          }
        });
        this.things = get(this.entryData, "row.things");
      }
    },
    categories: {
      handler: function set(val) {
        this.storehouseData.category_id.options = val;
      },
      immediate: true,
    },
    clientCodes: {
      handler: function set(val) {
        this.storehouseData.code_client_id.options = val;
      },
      immediate: true,
    },
    shopList: {
      handler: function set(val) {
        this.storehouseData.shop.options = val;
      },
      immediate: true,
    },
    showDialog(val) {
      this.show = val;
    },
    show(val) {
      this.$emit("update:showDialog", val);
    },
  },
  methods: {
    saveData() {
      const sendData = reduce(
        this.storehouseData,
        (result, { changeValue, value }, index) => {
          if (changeValue) {
            result[index] = value;
          }
          return result;
        },
        {},
      );

      if (this.changeThings) {
        sendData.things = this.things;
      }
      if (has(sendData, "shop")) {
        sendData.shop = startCase(sendData.shop);
      }
      if (this.withoutThings || this.changeThings || this.entryData.row) {
        if (!this.entryData.row) {
          this.$q.loading.show();
          this.$axios
            .post(getUrl("addStorehouseData"), sendData)
            .then(({ data: { storehouseData, shopNames, thingsList } }) => {
              this.$store.commit("shopsList/SET_SHOPS_LIST", shopNames);
              this.$store.commit("thingsList/SET_THINGS_LIST", thingsList);
              this.$store.dispatch(
                "storehouse/addToStorehouseData",
                setFormatedDate(storehouseData, ["created_at"]),
              );
              // this.setChangeValue(this.storehouseData);
              this.$q.loading.hide();
              this.showNotif("success", "Запись успешно добавлена.", "center");
            })
            .catch((errors) => {
              this.errorsData.errors = get(errors, "response.data.errors");
              this.$q.loading.hide();
            });
        } else {
          if (!isEmpty(sendData)) {
            sendData.id = get(this.entryData, "row.id");
            this.$q.loading.show();
            this.$axios
              .post(getUrl("updateStorehouseData"), sendData)
              .then(({ data: { storehouseData, shopNames, thingsList } }) => {
                this.$store.commit("shopsList/SET_SHOPS_LIST", shopNames);
                this.$store.commit("thingsList/SET_THINGS_LIST", thingsList);
                this.$store.dispatch(
                  "storehouse/updateStorehouseData",
                  setFormatedDate(storehouseData, ["created_at"]),
                );
                setChangeValue(this.storehouseData);
                this.$q.loading.hide();
                this.showNotif(
                  "success",
                  "Запись успешно обновлена.",
                  "center",
                );
                this.close(this.storehouseData);
              })
              .catch((errors) => {
                this.errorsData.errors = get(errors, "response.data.errors");
                this.$q.loading.hide();
              });
          } else {
            this.close(this.storehouseData);
          }
        }
      } else {
        this.showThingsDialog = true;
      }
    },
    clear(data) {
      forEach(data, (item) => {
        item.value = item.default;
      });
      this.changeThings = false;
      this.withoutThings = false;
      this.things = null;
    },
    remove(index) {
      const things = JSON.parse(this.things);
      things.splice(index, 1);
      this.things = JSON.stringify(things);
    },
    close(data) {
      this.clear(data);
      this.show = false;
      if (!isEmpty(this.entryData)) {
        set(this.entryData, "selected", false);
        this.$emit("update:entryData", {});
      }
    },
  },
};
</script>
