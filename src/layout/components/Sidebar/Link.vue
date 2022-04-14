
<template>
  <div v-bind="linkProps(to)">
    <slot />
  </div>
</template>

<script lang='ts'>
import { Vue, Component, Prop } from "vue-property-decorator";
import { isExternal } from "@/utils/validate";
@Component
export default class Link extends Vue {
  @Prop({ required: true }) to: string;

  linkProps(url) {
    console.log("app跳转")
    // debugger
    if (isExternal(url)) {
      return {
        is: "a",
        href: url,
        target: "_blank",
        rel: "noopener",
      };
    }
    return {
      is: "router-link",
      to: url,
    };
  }
}
</script>
