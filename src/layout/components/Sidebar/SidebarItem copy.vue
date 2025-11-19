<template>
  <div v-if="!item.meta?.hidden">
    <template
      v-if="
        hasOneShowingChild(item.children,item) &&
          (!onlyOneChild.children || onlyOneChild.noShowingChildren) &&
          !item.meta?.alwaysShow
      "
    >
      <AppLink v-if="onlyOneChild.meta" :to="resolvePath(onlyOneChild.path)">
        <el-menu-item :index="resolvePath(onlyOneChild.path)" :class="{ 'submenu-title-noDropdown': !props.isNest }">
          <svg-icon
            v-show="onlyOneChild.meta?.icon || (item.meta && item.meta.icon)"
            class-name="menu-icons"
            :icon-class="onlyOneChild.meta?.icon || (item.meta && item.meta.icon || 'default-icon')"
          />
          <template #title>
            <span> {{ onlyOneChild.meta.title }} </span>
          </template>
        </el-menu-item>
      </AppLink>
    </template>

    <el-sub-menu v-else ref="subMenu" popper-class="sub-menu-test" :index="resolvePath(props.item.path)">
      <template #title>
        <svg-icon
          v-show="item.meta?.icon"
          class-name="menu-icons"
          :icon-class="item.meta?.icon || 'default-icon'"
        />
        <span> {{ props.item.meta.title }} </span>
      </template>
      <SidebarItem
        v-for="child in item.children"
        :key="child.path"
        :is-nest="true"
        :item="child"
        :base-path="resolvePath(child.path)"
        class="nest-menu"
      />
    </el-sub-menu>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import path from 'path-browserify'
import { isExternal } from '@/utils/validate'
import AppLink from './Link.vue'

// eslint-disable-next-line no-undef
const props = defineProps({
  item: {
    type: Object,
    required: true
  },
  isNest: {
    type: Boolean,
    default: false
  },
  basePath: {
    type: String,
    default: ''
  }
})

const onlyOneChild = ref(null)
const subMenu = ref(null)


function hasOneShowingChild(children = [], parent) {
  const showingChildren = children.filter(item => {
    if (item.meta?.hidden) {
      return false
    } else {
      onlyOneChild.value = item
      return true
    }
  })
  if (showingChildren.length === 1) {
    return true
  }
  if (showingChildren.length === 0) {
    onlyOneChild.value = { ...parent, path: '', noShowingChildren: true }
    return true
  }
  return false
}

const resolvePath = routePath => {
  if (isExternal(routePath)) {
    return routePath
  }
  if (isExternal(props.basePath)) {
    return props.basePath
  }
  return path.resolve(props.basePath, routePath)
}

defineOptions({
  name: 'SidebarItem'
})
</script>
