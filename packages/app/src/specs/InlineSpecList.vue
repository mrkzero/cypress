<template>
  <div class="w-280px">
    <InlineSpecListHeader
      v-model:tab="tab"
      v-model:search="search"
    />
    <div class="h-[calc(100vh-65px)] overflow-y-auto overflow-x-hidden pt-16px">
      <template v-if="tab === 'file-list'">
        <InlineSpecListRow
          v-for="spec in specs"
          :key="spec.absolute"
          :spec="spec"
          :selected="isCurrentSpec(spec)"
        />
      </template>
      <template v-else>
        <InlineSpecListTree
          :specs="specs"
        />
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ComputedRef, ref } from 'vue'
import { gql } from '@urql/vue'
import type { Specs_InlineSpecListFragment } from '../generated/graphql'
import { useSpecStore } from '../store'
import InlineSpecListHeader from './InlineSpecListHeader.vue'
import InlineSpecListRow from './InlineSpecListRow.vue'
import InlineSpecListTree from './InlineSpecListTree.vue'

import fuzzySort from 'fuzzysort'
import type { FoundSpec } from '@packages/types'
import type { FuzzyFoundSpec } from '@packages/frontend-shared/src/utils/buildSpecTree'

gql`
fragment SpecNode_InlineSpecList on SpecEdge {
  node {
    id
    name
    specType
    absolute
    relative
    baseName
  }
  ...SpecListRow
}
`

gql`
fragment Specs_InlineSpecList on CurrentProject {
  id
  projectRoot
  specs: specs(first: 1000) {
    edges {
      ...SpecNode_InlineSpecList
    }
  }
}
`

const props = defineProps<{
  gql: Specs_InlineSpecListFragment
}>()

const specStore = useSpecStore()

const isCurrentSpec = (spec: FoundSpec) => {
  return spec.relative === specStore.activeSpec?.relative
}

const tab = ref('file-list')
const search = ref('')

const specs: ComputedRef<FuzzyFoundSpec[]> = computed(() => {
  const specs = props.gql.specs?.edges || []

  if (!search.value) {
    return specs.map((spec) => ({ ...spec.node, indexes: [] as number[] }))
  }

  const res = fuzzySort.go(search.value, specs.map((spec) => spec.node) || [], { key: 'baseName' })

  return res.map(({ obj, indexes }) => ({ ...obj, indexes }))
})

</script>
