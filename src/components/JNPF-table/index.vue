<template>
 <div style="padding:0 10px">
  <el-table :data="data" ref="JNPFTable"  class="JNPF-common-table"
    :element-loading-text="'加载中'" v-bind="$attrs" v-on="$listeners" :row-style="{height:'42px'}" :cell-style="{padding:'0'}"
    :border="border" size="small">
    <el-table-column type="selection" width="50" v-if="hasC" align="center" />
    <el-table-column type="index" width="50" label="序号" v-if="hasNO" align="center" />
    <slot></slot>
    <template slot="empty">
      <el-empty description="暂无数据" :image-size="120"></el-empty>
    </template>
  </el-table>
 </div>
</template>

<script>
export default {
  name: 'JNPF-table',
  props: {
    data: {
      type: Array,
      default: () => []
    },
    columnData: {
      type: Array,
      default: () => []
    },
    // 序号 默认有
    hasNO: {
      type: Boolean,
      default: true
    },
    // 多选框 默认无
    hasC: {
      type: Boolean,
      default: false
    },
    border: {
      type: Boolean,
      default: false
    },
    height: {
      default: '460px'
    }
  },
  watch: {
    data: {
      handler(val) {
        if (!val) return
        this.doLayout()
      },
      deep: true
    },
    columnData: {
      handler(val) {
        if (!val) return
        this.doLayout()
      },
      deep: true
    }
  },
  methods: {
    doLayout() {
      setTimeout(() => {
        this.$nextTick(() => {
          this.$refs.JNPFTable.doLayout()
        })
      }, 50)
    }
  }
}
</script>