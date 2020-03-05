<template>
    <div
        id="app"
        class="View"
        :class="{ [`--ExploringMode`]: isExploringModeEnabled }"
    >
        <input
            v-model="username"
            class="View__UsernameInput"
            type="text"
            placeholder="Type GitHub username…"
            @focus="onInputFocus"
            @blur="onInputBlur"
            @input="onInputChange"
        >
        <transition name="fade">
            <p
                v-if="shouldBeTipVisible"
                class="View__UsernameTip"
                :class="{ [`--Error`]: !isUsernameValid }"
            >
                {{ message }}
            </p>
        </transition>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component({
    components: {},
})
export default class App extends Vue {
    username = ``;
    isInputFocused = false;
    isInputTouched = false;
    isExploringModeEnabled = false;
    messages = {
        HIT_ENTER: `…and hit enter when you are done`,
        FIX_USERNAME: `You must enter the username to move on`,
    };

    onInputChange() {
        this.isInputTouched = true;
    }
    onInputFocus() {
        this.isInputFocused = true;
    }
    onInputBlur() {
        this.isInputFocused = false;
        this.isInputTouched = true;
    }

    get message() {
        return this.messages[this.isUsernameValid ? `HIT_ENTER` : `FIX_USERNAME`];
    }
    get isUsernameValid() {
        return !((this.isInputTouched) && !this.username.length);
    }
    get shouldBeTipVisible() {
        return (this.isInputTouched || this.isInputFocused) && !this.isExploringModeEnabled;
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
            .--ExploringMode &
                top: 0
                width: 100%
                transform: translate3d(-50%, 0, 0)
                background: transparent
        &Tip
            position: absolute
            text-align: center
            margin: .75rem 0
            width: 100%
            top: calc(50% + 3rem)
            transform: translate3d(0, -50%, 0)
            +Typo(JumboTip)
            &.--Error
                color: #{_(Global, Warning)}

</style>
