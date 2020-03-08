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
        <transition name="fade">
            <Modal
                v-if="isBranchMode"
                @closePrompt="disableBranchMode"
            >
                <div 
                    v-if="areBranchesReady"
                    v-perfect-scroll="scrollSettings"
                    class="Branches"
                >
                    <BranchComponent
                        v-for="branch in getBranches(branchUsername, branchRepository)"
                        :key="branch.name"
                        :branch="branch"
                        class="Branch"
                    />
                </div>
                <Loader
                    v-else
                />
            </Modal>
        </transition>
    </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Action, Getter } from "vuex-class";
import { Repository, Branch } from "./types/github";
import RepositoryComponent from "./components/Repository.vue";
import BranchComponent from "./components/Branch.vue";
import Modal from "./components/Modal.vue";
import Loader from "./components/Loader.vue";

import { isOneOfTrue, areAllTrue } from "./helpers";

@Component({
    components: {
        RepositoryComponent,
        BranchComponent,
        Loader,
        Modal,
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
        return areAllTrue(
            this.isRepositoryStored(this.branchUsername, this.branchRepository),
        );
    }
};
</script>

<style lang="sass">
@import "styles/mixins"

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
            max-width: 80%
            text-align: center
            margin-bottom: 3rem
            transition: .3s
            border: 1px solid #{_(Primary, Light)}
            box-shadow: rgba(0, 0, 0, .1) 0 0 .25rem -.125rem
            border-radius: 8px
            transition: 1s
            +Typo(JumboInput)
            +Breakpoint(640px, max)
                font-size: 1.5rem
                height: 4rem
            &:focus
                border-color: transparent
                box-shadow: rgba(0, 0, 0, .4) 0 0 1rem
                border-radius: .5rem
                outline: 0
            .--Folded &
                top: 0
                width: 100%
                transform: translate3d(-50%, 0, 0)
                background: transparent
                max-width: 100%
    &__Status
        position: absolute
        text-align: center
        margin: .75rem 0
        width: 100%
        padding: 10%
        top: calc(50% + 3rem)
        transform: translate3d(0, -50%, 0)
        +Typo(JumboStatus)
        +Breakpoint(640px, max)
            font-size: 1.5rem
        &.--Error
            color: #{_(Global, Warning)}

</style>
