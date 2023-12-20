<template>
  <n-space vertical>
    <n-layout has-sider>
      <n-layout-sider
          bordered
          collapse-mode="width"
          :collapsed-width="64"
          :width="240"
          :collapsed="collapsed"
          show-trigger
          @collapse="collapsed = true"
          @expand="collapsed = false"
      >
        <n-menu
            :collapsed="collapsed"
            :collapsed-width="64"
            :collapsed-icon-size="22"
            :options="menuOptions"
            :render-label="renderMenuLabel"
            :render-icon="renderMenuIcon"
            :expand-icon="expandIcon"
        />
      </n-layout-sider>
      <n-layout>
        <slot />
      </n-layout>
    </n-layout>
  </n-space>
</template>

<script lang="ts">
import {h} from 'vue'
import {NIcon, NSpace, NSwitch, NLayout, NLayoutSider, NMenu} from 'naive-ui'
import type {MenuOption} from 'naive-ui'
import {BookmarkOutline, CaretDownOutline, BarcodeOutline} from '@vicons/ionicons5'
import {Signature} from '@vicons/tabler'
import { RouterLink } from 'vue-router'

function renderIcon (icon: Component) {
  return () => h(NIcon, null, { default: () => h(icon) })
}

const menuOptions: MenuOption[] = [
  {
    label: () =>
        h(
            RouterLink,
            {
              to: {
                name: 'hash',
                params: {
                  lang: 'en-US'
                }
              }
            },
            { default: () => 'ABI Encoder' }
        ),
    key: 'hear-the-data',
    icon: renderIcon(BarcodeOutline),
  },
  {
    label: () =>
        h(
            RouterLink,
            {
              to: {
                name: 'signature',
                params: {
                  lang: 'en-US'
                }
              }
            },
            { default: () => 'Sign thing' }
        ),
    key: 'hear-the-hash',
    icon: renderIcon(Signature),
  },
  {
    label: 'Dance Dance Dance',
    key: 'Dance Dance Dance',
    children: [
      {
        type: 'group',
        label: 'People',
        key: 'people',
        children: [
          {
            label: 'Narrator',
            key: 'narrator'
          },
          {
            label: 'Sheep Man',
            key: 'sheep-man'
          }
        ]
      },
      {
        label: 'Beverage',
        key: 'beverage',
        children: [
          {
            label: 'Whisky',
            key: 'whisky',
            href: 'https://en.wikipedia.org/wiki/Whisky'
          }
        ]
      },
      {
        label: 'Food',
        key: 'food',
        children: [
          {
            label: 'Sandwich',
            key: 'sandwich'
          }
        ]
      },
      {
        label: 'The past increases. The future recedes.',
        key: 'the-past-increases-the-future-recedes'
      }
    ]
  }
]

export default {
  name: "AppMenuLayout",
  components: {
    NSpace, NLayout, NLayoutSider, NMenu, NSwitch, NIcon
  },
  data() {
    return {
      menuOptions,
      collapsed: true,
      renderMenuLabel(option: MenuOption) {
        if (typeof option.label === 'function') {
          return option.label()
        }
        if ('href' in option) {
          return h('a', {href: option.href, target: '_blank'}, [
            option.label as string
          ])
        }
        return option.label as string
      },
      renderMenuIcon(option: MenuOption) {
        // return render placeholder for indent
        if (option.key === 'sheep-man') return true
        // return falsy, don't render icon placeholder
        if (option.key === 'food') return null
        if (option.icon) return option.icon()
        return h(NIcon, null, {default: () => h(BookmarkOutline)})
      },
      expandIcon() {
        return h(NIcon, null, {default: () => h(CaretDownOutline)})
      }
    }
  }
}
</script>
