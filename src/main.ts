import Vue from "vue";
import PerfectScrollbar from "perfect-scrollbar";
import vClickOutside from "v-click-outside";

import App from "./App.vue";
import "./styles/main.sass";

import store from "@Store";

Vue.use(vClickOutside);

Vue.config.productionTip = false;

Vue.directive(`perfect-scroll`, {
    inserted(element, { value }) {
        new PerfectScrollbar(element, value);
    },
});

new Vue({
    store,
    render: h => h(App),
}).$mount(`#app`);
