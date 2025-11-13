# 统一视觉主题与组件化总结

## 1. 视觉统一
- 主题色：#10b981（绿色），圆角 12px，字体 14px
- 卡片渐变：`linear-gradient(180deg, rgba(36,36,38,1), rgba(24,24,26,1))`
- 阴影：`0 16px 40px rgba(0,0,0,0.35)`，圆角 14px
- 顶部磨砂：`backdrop-filter: blur(6px)`
- 全局暗色背景：#0e0e10，带柔和径向渐变

## 2. 通用组件（src/components）
| 组件 | 职责 | 关键 props / slots |
| ---- | ---- | ------------------ |
| LayoutDual | 左右分栏布局壳 | slot=panel / chart |
| RecordControl | 录制设置卡片 | v-model 式受控绑定 |
| ChainPanel | 左侧方法链列表卡片 | items / loading / selectedIndex |
| ChartCard | 右侧图表卡片 | title / mermaidCode / loading / emptyText |
| MethodChainList | 纯列表展示 | items / selectedIndex / @select |

## 3. 页面结构
- RecordAction.vue：RecordControl + LayoutDual（ChainPanel + ChartCard）
- Home.vue：LayoutDual（ChainPanel + ChartCard）
- 共用 LayoutDual 统一边距、分隔线、暗色样式

## 4. 代码复用要点
- 列表选中态、加载态下沉到 MethodChainList
- 卡片阴影与渐变统一在 ChainPanel / ChartCard 内部
- 页面只关心数据与事件，不再重复写布局与样式
- 主题 token 集中在 App.vue 的 a-config-provider 配置

## 5. 后续可继续
- 将 Home.vue 的“记录分组折叠”再封装为 RecordGroup 组件
- 新增图标/徽标插槽，保持接口一致
- 如需亮色模式，只需替换 App.vue 的 algorithm 与渐变变量