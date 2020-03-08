<template>
    <div class="Repository">
        <a 
            :href="repository.html_url"
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
            @click.prevent="$emit(`branchesClick`, {
                repository: repository.name,
                username: repository.owner.login,
            })"
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

export default class RepositoryComponent extends Vue {
    repository!: Repository;
};
</script>

<style lang="sass">
@import "../styles/mixins"
.Repository
    display: grid
    width: 32rem
    height: 7rem
    max-width: 100%
    background: #{_(Primary, Light)}
    padding: 1.5rem 2rem
    text-decoration: none
    grid-template-areas: "link branches" "owner ."
    justify-content: space-between
    gap: 1rem
    border-radius: .125rem
    & + &
        margin-top: 1rem
    &__Link
        display: inline-grid
        grid-area: link
        text-decoration: none
        +Typo(Heading)
    &__Owner
        grid-area: owner
        color: #{_(Primary, Accent)}
    &__Name
        overflow: hidden
        white-space: nowrap
        text-overflow: ellipsis
        height: 2.5rem
        margin-bottom: -.5rem
    &__BranchesRoute
        grid-area: branches
        +Typo(Link)

.Repositories
    display: flex
    flex-direction: column
    height: calc(100vh - 16rem)
    align-content: flex-start
    transform: translate3d(0, 3.5rem, 0)
    padding: 0 1rem

</style>
