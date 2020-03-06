<template>
    <div class="Repository">
        <a 
            :href="repository.url"
            target="_blank"
            class="Repository__Link"
        >
            <h2 class="Repository__Name">
                {{ repository.name }}
            </h2>
        </a>
        <span class="Repository__Owner">
            {{ repository.owner.login }}
        </span>
        <a
            class="Repository__BranchesRoute"
            href="#"
        >
            branches
        </a>
    </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from 'vue-class-component';
import { Repository } from "../types/github";

@Component({
    components: {},
    props: {
        repository: Object,
    },
})

export default class App extends Vue {
    repository!: Repository;
};
</script>

<style lang="sass">
@import "../styles/mixins"
.Repository
    display: grid
    width: 32rem
    height: 7rem
    background: #{_(Primary, Light)}
    padding: 1.5rem 2rem
    text-decoration: none
    grid-template-areas: "link branches" "owner ."
    justify-content: space-between
    gap: 1rem
    border-radius: .125rem
    &__Link
        grid-area: link
        text-decoration: none
        +Typo(Heading)
    &__Owner
        grid-area: owner
        color: #{_(Primary, Accent)}

    &__BranchesRoute
        grid-area: branches
        +Typo(Link)

</style>
