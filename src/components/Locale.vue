<template>
  <div data-vue-component-name="LocaleComponent">
    <q-btn flat :icon="icon" style="font-size: 1.1em">
      <q-menu transition-show="rotate" transition-hide="rotate" auto-close>
        <q-list style="min-width: 150px" bordered separator>
          <q-item
            v-for="(item, i) in langs"
            :key="i"
            v-ripple
            :active="item.active"
            clickable
            active-class="bg-teal-1"
            @click="setLocale(item)"
          >
            <q-item-section avatar>
              <q-icon :name="item.icon" />
            </q-item-section>
            <q-item-section>{{ item.label }}</q-item-section>
          </q-item>
        </q-list>
      </q-menu>
    </q-btn>
  </div>
</template>

<script>
import { getLSKey } from "src/tools/lsKeys";
import { isEmpty, find, forEach } from "lodash";

export default {
  name: "LocaleComponent",
  data() {
    return {
      icon: "",
      langs: [
        {
          label: "Русский",
          value: "ru",
          icon: "img:icons/flag/ru.png",
          active: true,
        },
        {
          label: "Turkish",
          value: "tr",
          icon: "img:icons/flag/tr.png",
          active: false,
        },
        {
          label: "English",
          value: "en",
          icon: "img:icons/flag/en.png",
          active: false,
        },
      ],
    };
  },
  created() {
    // this.$q.localStorage.remove(getLSKey('lang'));
    const langFromLs = this.$q.localStorage.getItem(getLSKey("lang"));
    if (!isEmpty(langFromLs)) {
      this.setLocale(langFromLs);
    } else {
      const findActiveLang = find(this.langs, { active: true });
      this.setLocale(findActiveLang);
    }
    this.icon = `img:icons/flag/${
      langFromLs ? langFromLs.value : this.$i18n.locale
    }.png`;
  },
  methods: {
    setLocale(item) {
      this.setActive(this.langs, item.value);
      this.$i18n.locale = item.value;
      this.icon = item.icon;
      this.$q.lang.set(item.value);
      this.$q.localStorage.set(getLSKey("lang"), item);
    },
    setActive(arr, lang) {
      forEach(arr, (item) => {
        item.active = item.value === lang;
      });
    },
  },
};
</script>
