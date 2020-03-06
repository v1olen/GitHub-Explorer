import Vue from "vue";
import App from "./App.vue";
import store from "./store";
import "./styles/main.sass";
import PerfectScrollbar from "perfect-scrollbar";

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
