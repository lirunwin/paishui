<script lang='ts'>
import { CreateElement } from "vue";
import { Vue, Component, Prop } from "vue-property-decorator";
@Component({
  name: "MenuItem",
})
export default class Item extends Vue {
  functional = true;
  @Prop({ default: "" }) icon: string;
  @Prop({ default: "" }) title: string;
  render(createElement:CreateElement, context){
    const { icon, title } = context.props;
    const vnodes = [];
    //使用createElement创建元素
    if (icon) {
      // vnodes.push(<svg-icon icon-class={icon}/>)
      // vnodes.push(<i style='color:rgb(147,177,211)' class={icon}></i>)
      const ehtml=createElement('i',{attrs:{'class':icon,'style':'color: "#3b3b3b;'}})
      //vnodes.push(<i class={icon} style='color: "#3b3b3b;'></i>);
      // <i class="el-icon-edit"></i>
      vnodes.push(ehtml)
    }

    if (title) {
      const ehtml=createElement('span',{attrs:{'slot':'title'}},title)
      //vnodes.push(<span slot="title">{title}</span>);
      vnodes.push(ehtml)
    }
    return vnodes;
  }
}
</script>
