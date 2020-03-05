import Vue from 'vue';
import Vuex, { StoreOptions } from 'vuex';
import VuexPersistence from 'vuex-persist';


Vue.use(Vuex);

// eslint-disable-next-line
interface RootState {};

export default new Vuex.Store<RootState>(({
    state: {
    },
    mutations: {
    },
    actions: {
    },
    modules: {
    },
    plugins: [new VuexPersistence<RootState>({
        storage: window.localStorage,
    }).plugin],
}) as StoreOptions<RootState>);
