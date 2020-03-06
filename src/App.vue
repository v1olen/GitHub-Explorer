<template>
    <div
        id="app"
        class="View"
        :class="{ [`--Folded`]: isAppUnfolded }"
    >
        <input
            v-model="username"
            class="View__UsernameInput"
            type="text"
            placeholder="Type GitHub username…"
            @focus="onInputFocus"
            @blur="onInputBlur"
            @input="onInputChange"
            @keydown.enter="onSubmit"
        >
        <transition name="fade">
            <p
                v-if="isStatusVisible"
                class="View__Status"
                :class="{ [`--Error`]: isError }"
            >
                {{ message }}
            </p>
        </transition>
        <transition name="fade">
            <div
                v-if="areRepositoriesReady"
                v-perfect-scroll="scrollSettings"
                class="Repositories"
            >
                <RepositoryComponent
                    v-for="repository in nonForkRepositories"
                    :key="repository.id"
                    :repository="repository"
                    @branchesClick="showBranches"
                />
            </div>
            <Loader
                v-else-if="isAppUnfolded && !isStatusVisible"
            />
        </transition>
        <div class="Modal" v-if="isBranchMode">
            <div v-if="areBranchesReady">
                <div
                    v-for="branch in getBranches(branchUsername, branchRepository)"
                    :key="branch.name"
                >
                    {{ branch.name }}
                    {{ branch.commit.sha }}
                </div>
            </div>
            <Loader
                v-else
            />
        </div>
    </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from 'vue-class-component';
import { Action, Getter } from "vuex-class";
import { Repository, Branch } from "./types/github";
import RepositoryComponent from "./components/Repository.vue";
import Loader from "./components/Loader.vue";

import { isOneOfTrue, areAllTrue } from "./helpers";

@Component({
    components: {
        RepositoryComponent,
        Loader,
    },
})
export default class App extends Vue {
    @Action setUser!: ({ username, onFailure }: { username: string; onFailure: Function }) => void; 
    @Action setBranch!: ({ username, repository, onFailure }: { username: string; repository: string; onFailure: Function }) => void; 
    @Getter isUserStored!: (username: string) => boolean;
    @Getter getRepositories!: (username: string) => Repository[];
    @Getter isRepositoryStored!: (username: string, repository: string) => boolean;
    @Getter getBranches!: (username: string, repository: string) => Branch[];

    username = ``;
    branchUsername = ``;
    branchRepository = ``;
    isInputFocused = false;
    isInputTouched = false;
    isAppUnfolded = false;
    areRepositoriesVisible = false;
    userNotFound = false;
    isBranchMode = false;
    console = console

    messages = {
        HIT_ENTER: `…and hit enter when you are done`,
        CORRECT_USERNAME: `You must enter the username to move on`,
        USER_NOT_FOUND: `User not found`,
        NO_REPOS: `This user has no repositories`,
    };
    scrollSettings = {
        wheelSpeed: .75,
        wheelPropagation: true,
        minScrollbarLength: 20,
        swipeEasing: true,
        suppressScrollX: true,
    };

    onInputChange() {
        this.isInputTouched = true;
        this.userNotFound = false;
        this.disableExploringMode();
    }
    onInputFocus() {
        this.isInputFocused = true;
    }
    onInputBlur() {
        this.isInputFocused = false;
        this.isInputTouched = true;
    }
    onSubmit({ target }: { target: HTMLInputElement}) {
        if(this.isUsernameValid) {
            this.enableExploringMode(target);
            this.setUser({
                username: this.username,
                onFailure: () => this.userNotFound = true,
            });
        }
    }
    showBranches({ repository, username }: { repository: string; username: string }) {
        this.enableBranchMode(username, repository);
        this.setBranch({
            username,
            repository,
            onFailure: () => this.userNotFound = true,
        });
    }
    enableExploringMode(target: HTMLInputElement) {
        this.isAppUnfolded = true;
        setTimeout(() => {
            this.areRepositoriesVisible = true;
            target.blur();
        }, 750);
    }
    disableExploringMode() {
        this.isAppUnfolded = false;
        this.areRepositoriesVisible = false;
    }
    enableBranchMode(username: string, repository: string) {
        this.isBranchMode = true;
        this.branchRepository = repository;
        this.branchUsername = username;
    }
    disableBranchMode() {
        this.isBranchMode = false;
    }

    get message() {
        if (this.userNotFound) return this.messages[`USER_NOT_FOUND`];
        if (this.isRepositoriesLengthNull) return this.messages[`NO_REPOS`];
        return this.messages[this.isUsernameToCorrect ? `CORRECT_USERNAME` : `HIT_ENTER`];
    }
    get nonForkRepositories() {
        return this.getRepositories(this.username).filter(({ fork }) => !fork);
    }
    get isError() {
        return isOneOfTrue(
            !this.isUsernameValid && this.isInputTouched,
            this.isRepositoriesLengthNull,
            this.userNotFound,
        );
    }
    get isUsernameValid() {
        return !!this.username.length;
    }
    get isUsernameToCorrect() {
        return !this.isUsernameValid && this.isInputTouched;
    }
    get isStatusVisible() {
        return isOneOfTrue(
            this.isError,
            !this.isAppUnfolded && this.isInputFocused,
        );
    }
    get isRepositoriesLengthNull() {
        return areAllTrue(
            this.areRepositoriesReady,
            this.nonForkRepositories.length === 0,
        );
    }
    get areRepositoriesReady() {
        return areAllTrue(
            this.areRepositoriesVisible,
            this.isUserStored(this.username),
        );
    }
    get areBranchesReady() {
        console.log(this.branchUsername, this.branchRepository, this.isRepositoryStored(this.branchUsername, this.branchRepository));
        return areAllTrue(
            this.isRepositoryStored(this.branchUsername, this.branchRepository),
        );
    }
};
</script>

<style lang="sass">
@import "styles/mixins"

.Repositories
    display: grid
    gap: 1rem
    height: calc(100vh - 16rem)
    align-content: start
    transform: translate3d(0, 3.5rem, 0)
    padding: 0 1rem

.View
    display: grid
    position: absolute
    top: 0
    right: 0
    bottom: 0
    left: 0
    justify-content: center
    align-items: center
    align-content: center
    &__Username
        &Input
            position: absolute
            top: 50%
            left: 50%
            transform: translate3d(-50%, calc(-50% - 1rem), 0)
            height: 6rem
            width: 64rem
            padding: 1rem
            text-align: center
            margin-bottom: 3rem
            transition: .3s
            border: 1px solid #{_(Primary, Light)}
            box-shadow: rgba(0, 0, 0, .1) 0 0 .25rem -.125rem
            border-radius: 8px
            transition: 1s
            +Typo(JumboInput)
            &:focus
                border-color: transparent
                box-shadow: rgba(0, 0, 0, .4) 0 0 1rem
                border-radius: .5rem
            .--Folded &
                top: 0
                width: 100%
                transform: translate3d(-50%, 0, 0)
                background: transparent
    &__Status
        position: absolute
        text-align: center
        margin: .75rem 0
        width: 100%
        top: calc(50% + 3rem)
        transform: translate3d(0, -50%, 0)
        +Typo(JumboStatus)
        &.--Error
            color: #{_(Global, Warning)}

</style>
