import Vue from 'vue';
import Vuex, { StoreOptions } from 'vuex';
import VuexPersistence from 'vuex-persist';
import axios, { AxiosResponse } from 'axios';
import { Repository } from "../types/github";

Vue.use(Vuex);

interface RootState {
    users: {
        [name: string]: Repository[];
    };
};

export default new Vuex.Store<RootState>(({
    state: {
        users: {},
    },
    getters: {
        isUserStored: state => (username: string) => Object.keys(state.users).includes(username),
        getRepositories: state => (username: string) => state.users[username] ? state.users[username] : [],
    },
    mutations: {
        STORE_USER_REPOS(state, {
            username,
            repositories,
        }: {
            username: string;
            repositories: Repository[];
        }) {
            state.users = { ...state.users, [username]: repositories };
        },
    },
    actions: {
        async setUser({ commit }, { username, onFailure }: { username: string; onFailure: Function }) {
            try {
                const repositoriesRequest: AxiosResponse<Repository[]> = await axios
                    .get(`https://api.github.com/users/${username}/repos`);
                commit(`STORE_USER_REPOS`, { username, repositories: repositoriesRequest.data });
            } catch(error) {
                onFailure();
            }
        },
    },
    plugins: [new VuexPersistence<RootState>({
        storage: window.localStorage,
    }).plugin],
}) as StoreOptions<RootState>);
