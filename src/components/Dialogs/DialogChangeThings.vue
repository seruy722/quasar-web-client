<template>
  <div data-vue-component-name="DialogChangeThings">
    <DialogComponent
      v-model:dialog="thingsData.dialog"
      :persistent="true"
      title="Запись"
    >
      <Card style="min-width: 320px; width: 100%; max-width: 800px">
        <CardSection class="row justify-between bg-grey q-mb-sm">
          <span class="text-h6">{{ title }}</span>
          <div>
            <IconBtn dense icon="add_box" @icon-btn-click="add" />

            <IconBtn
              dense
              color="info"
              icon="clear_all"
              @icon-btn-click="clear"
            />

            <IconBtn
              dense
              color="negative"
              icon="clear"
              @icon-btn-click="cancel(thingsData)"
            />
          </div>
        </CardSection>
        <CardSection>
          <List dense bordered padding separator class="q-px-sm">
            <ListItem class="text-bold">
              <ItemSection>Название</ItemSection>
              <ItemSection>Количество</ItemSection>
              <ItemSection side> Действие </ItemSection>
            </ListItem>

            <ListItem v-for="(item, index) in localThings" :key="index">
              <ItemSection>
                <SelectChips
                  v-model.trim="item.label"
                  dense
                  :options="thingsList"
                />
              </ItemSection>
              <ItemSection>
                <BaseInput v-model.number="item.value" type="number" />
              </ItemSection>
              <ItemSection side>
                <IconBtn
                  color="negative"
                  icon="delete"
                  :dense="$q.screen.xs || $q.screen.sm"
                  :tooltip="$t('delete')"
                  @icon-btn-click="deleteLocalThing(index)"
                />
              </ItemSection>
            </ListItem>
          </List>
        </CardSection>

        <Separator />
        <CardActions>
          <BaseBtn
            label="Cancel"
            color="negative"
            @click-base-btn="cancel(thingsData)"
          />
          <BaseBtn
            label="Save"
            @click-base-btn="save(localThings, thingsData)"
          />
        </CardActions>
      </Card>
    </DialogComponent>
  </div>
</template>

<script>
import DialogComponent from "src/components/Dialogs/DialogComponent.vue";
import BaseInput from "src/components/Elements/BaseInput.vue";
import Separator from "src/components/Separator.vue";
import Card from "src/components/Elements/Card/Card.vue";
import CardActions from "src/components/Elements/Card/CardActions.vue";
import CardSection from "src/components/Elements/Card/CardSection.vue";
import IconBtn from "src/components/Buttons/IconBtn.vue";
import BaseBtn from "src/components/Buttons/BaseBtn.vue";
import SelectChips from "src/components/Elements/SelectChips.vue";
import List from "src/components/Elements/List/List.vue";
import ItemSection from "src/components/Elements/List/ItemSection.vue";
import ListItem from "src/components/Elements/List/ListItem.vue";
import {
  isEmpty,
  forEach,
  isString,
  trim,
  remove,
  map,
  join,
  upperFirst,
  split,
} from "lodash";

export default {
  name: "DialogChangeThings",
  components: {
    BaseInput,
    SelectChips,
    List,
    ItemSection,
    ListItem,
    IconBtn,
    DialogComponent,
    Card,
    CardActions,
    CardSection,
    BaseBtn,
    Separator,
  },
  props: {
    title: {
      type: String,
      default: "",
    },
    thingsData: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    this.$_changeData = false;
    return {
      localThings: [],
    };
  },
  computed: {
    thingsList() {
      return this.$store.getters["thingsList/getThingsList"];
    },
  },
  watch: {
    "thingsData.things": {
      handler: function set(val) {
        this.setLocalThings(val);
      },
      immediate: true,
    },
    "thingsData.dialog": {
      handler: function set(val) {
        this.thingsData.edit = val;
      },
      immediate: true,
    },
    localThings: {
      handler: function get() {
        this.$_changeData = true;
      },
      deep: true,
      immediate: false,
    },
  },
  methods: {
    setLocalThings(value) {
      if (isString(value) && trim(value)) {
        try {
          this.localThings = JSON.parse(value);
        } catch (e) {
          console.error(`Неправильный JSON формат строки - ${value}`);
        }
      }
    },
    deleteLocalThing(index) {
      this.localThings.splice(index, 1);
    },
    cancel(data) {
      this.closeDialog(data);
      this.setLocalThings(data.things);
    },
    save(values, data) {
      if (this.$_changeData) {
        if (isEmpty(values)) {
          data.things = null;
        } else {
          // Удаление пустых обьектов
          remove(values, (item) => !item.label && !item.value);
          // Каждое слово с большой буквы
          forEach(values, (item) => {
            if (isString(item.label)) {
              item.label = join(
                map(split(item.label, " "), (elem) => upperFirst(elem)),
                " ",
              );
            }
          });
          data.things = JSON.stringify(values);
        }
        this.$emit("add-to-save");
      }
      this.closeDialog(data);
    },
    closeDialog(data) {
      data.dialog = false;
    },
    add() {
      this.localThings.unshift({
        label: null,
        value: 0,
      });
    },
    clear() {
      if (!isEmpty(this.localThings)) {
        this.localThings = [];
      }
    },
  },
};
</script>
