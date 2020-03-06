<template>
    <div class="Loader">
        <div/>
    </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from 'vue-class-component';

@Component
export default class Loader extends Vue {};
</script>

<style lang="sass">
@import "../styles/mixins"

.Loader
    position: absolute
    right: 0
    left: 0
    display: inline-flex
    justify-content: center
    transform: translateZ(1px)

.Loader > div
    display: inline-flex
    width: 4rem
    height: 4rem
    margin: .5rem
    border-radius: .25rem
    background: #{_(Primary, Dark)}
    animation: Loader 3s cubic-bezier(0, 0.2, 0.8, 1) infinite

@keyframes Loader
    0%, 100%
        animation-timing-function: ease-in-out
    0%
        transform: rotateY(0deg) skew(0deg)
    
    50%
        transform: rotateY(450deg) skew(45deg)
        animation-timing-function: linear
    
    100%
        transform: rotateY(900deg) skew(0deg)
</style>
