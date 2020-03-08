import Vue from 'vue';
import Vuex, { StoreOptions } from 'vuex';
import VuexPersistence from 'vuex-persist';
import axios, { AxiosResponse } from 'axios';
import { Repository, Branch } from "../types/github";

Vue.use(Vuex);

interface RootState {
    users: {
        [name: string]: Repository[];
    };
    repositories: {
        [name: string]: Branch[];
    };
};

export default new Vuex.Store<RootState>(({
    state: {
        users: {},
        repositories: {},
    },
    getters: {
        isUserStored: state => (username: string) => Object.keys(state.users).includes(username),
        getRepositories: state => (username: string) => state.users[username] || [],
        isRepositoryStored: state => 
            (username: string, repository: string) => 
                Object.keys(state.repositories).includes(`${username}/${repository}`),
        getBranches: state =>
            (username: string, repository: string) =>
                state.repositories[`${username}/${repository}`] || [],
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
        STORE_REPO_BRANCHES(state, {
            username,
            repository,
            branches,
        }: {
            username: string;
            repository: string;
            branches: Branch[];
        }) {
            state.repositories = { ...state.repositories, [`${username}/${repository}`]: branches };
        },
    },
    actions: {
        async setUser({ commit }, { username, onFailure }: { username: string; onFailure: Function }) {
            try {
                const repositoriesRequest: AxiosResponse<Repository[]> = await axios
                    .get(`https://api.github.com/users/${username}/repos`);

                commit(`STORE_USER_REPOS`, { username, repositories: repositoriesRequest.data });
            } catch (error) {
                onFailure();
            }
        },
        async setBranch({ commit }, { username, repository, onFailure }: { username: string; repository: string; onFailure: Function }) {
            try {
                const branchesRequest: AxiosResponse<Branch[]> = await axios
                    .get(`https://api.github.com/repos/${username}/${repository}/branches`);

                commit(`STORE_REPO_BRANCHES`, { username, repository, branches: branchesRequest.data });
            } catch (error) {
                onFailure();
            }
        },
    },
    plugins: [new VuexPersistence<RootState>({
        storage: window.localStorage,
    }).plugin],
}) as StoreOptions<RootState>);
