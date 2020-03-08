<template>
    <aside
        v-click-outside="() => $emit(`closePrompt`)"
        class="Modal"
    >
        <slot/>
    </aside>
</template>

<script lang="ts">
import Vue from "vue";
import Component from 'vue-class-component';

@Component
export default class Modal extends Vue {
    mounted() {
        document.addEventListener(`keydown`, (event) => {
            if ((event || window.event).keyCode == 27) this.$emit(`closePrompt`);
        });
    }
};
</script>

<style lang="sass">
@import "../styles/mixins"

.Modal
    position: fixed
    top: 50%
    left: 50%
    width: 40rem
    height: 48rem
    max-width: 90%
    padding: 2rem
    transform: translate3d(-50%, -50%, 0)
    background: #{_(Secondary, Light)}
    box-shadow: rgba(0,0,0,.125) 0 0 1rem .25rem
    border-radius: .25rem

</style>
