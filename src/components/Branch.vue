<template>
    <div class="Branch">
        <h3 class="Branch__Name">
            {{ branch.name }}
        </h3>
        <span class="Branch__LastCommit">
            {{ branch.commit.sha }}
        </span>
    </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from 'vue-class-component';
import { Branch } from "@Types/github";

@Component({
    components: {},
    props: {
        branch: Object,
    },
})

export default class BranchComponent extends Vue {
    branch!: Branch;
};
</script>

<style lang="sass">
@import "../styles/mixins"

.Branch
    padding: .5rem
    font-size: 14px
    font-style: italic
    color: #{_(Primary, Dark)}
    border-radius: .125rem
    display: grid
    gap: .25rem
    border-bottom: 1px solid var(--PrimaryAccent)
    &__LastCommit
        white-space: nowrap
        overflow: hidden
        text-overflow: ellipsis
.Branches
    position: relative
    display: grid
    max-height: 100%
    gap: .5rem

</style>
