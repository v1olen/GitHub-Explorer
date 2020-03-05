<template>
    <div
        id="app"
        class="View"
    >
        <input
            v-model="username"
            class="View__UsernameInput"
            type="text"
            placeholder="Type GitHub username…"
            @focus="isInputFocused = true"
            @blur="isInputFocused = false"
        >
        <transition name="fade">
            <p
                v-if="shouldBeTipVisible"
                class="View__UsernameTip"
            >
                …and hit enter when you are done
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

    get shouldBeTipVisible() {
        return this.isInputFocused || this.username.length;
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
            height: 6rem
            width: 64rem
            padding: 1rem
            text-align: center
            margin-bottom: 3rem
            transition: .3s
            border: 1px solid #{_(Primary, Light)}
            box-shadow: rgba(0, 0, 0, .1) 0 0 .25rem -.125rem
            border-radius: 8px
            +Typo(JumboInput)
            &:focus
                border-color: transparent
                box-shadow: rgba(0, 0, 0, .4) 0 0 1rem
                border-radius: .5rem
        &Tip
            position: absolute
            text-align: center
            margin: .75rem 0
            width: 100%
            top: calc(50% + 3rem)
            transform: translate3d(0, -50%, 0)
            +Typo(JumboTip)

</style>
