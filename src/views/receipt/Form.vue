<template>
  <el-dialog :title="!dataForm.id ? '新建' :  isDetail ? '详情':'编辑'"
             :close-on-click-modal="false" append-to-body
             :visible.sync="visible" class="JNPF-dialog JNPF-dialog_center" lock-scroll
             width="600px">
    <el-row :gutter="15" class="">
      <el-form ref="elForm" :model="dataForm" :rules="rules" size="small" label-width="120px" label-position="right">
        <template v-if="!loading">
<!--          <el-col :span="24">-->
<!--            <el-form-item label="规格" prop="spec">-->
<!--              <el-select v-model="dataForm.spec" filterable placeholder="请选择" clearable-->
<!--                         :style='{"width":"100%"}'>-->
<!--                <el-option v-for="(item, index) in specSelector"-->
<!--                           :key="item.spec" :label="item.spec" :value="item.spec">-->
<!--                </el-option>-->
<!--              </el-select>-->
<!--            </el-form-item>-->
<!--          </el-col>-->
          <el-col :span="24">
            <el-form-item label="FRP规格" prop="frpSpec">
              <el-select v-model="dataForm.frpSpec" filterable placeholder="请选择" clearable
                         :style='{"width":"100%"}'>
                <el-option v-for="(item) in frpSpecSelector"
                           :key="item.frpSpec" :label="item.frpSpec" :value="item.frpSpec">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="回收日期" prop="deliveryDate">
              <el-date-picker v-model="dataForm.deliveryDate" placeholder="请选择" clearable :style='{"width":"100%"}'
                              type="date" format="yyyy-MM-dd" value-format="timestamp">

              </el-date-picker>
            </el-form-item>
          </el-col>
<!--          <el-col :span="12">-->
<!--            <el-form-item label="发货木箱(个) " prop="deliveryBoxQty">-->
<!--              <el-input-number v-model="dataForm.deliveryBoxQty" placeholder="数字文本" :step="1" controls-position='right'>-->

<!--              </el-input-number>-->
<!--            </el-form-item>-->
<!--          </el-col>-->
<!--          <el-col :span="12">-->
<!--            <el-form-item label="发货管子(根)" prop="deliveryTubeQty">-->
<!--              <el-input-number v-model="dataForm.deliveryTubeQty" placeholder="数字文本" :step="1"-->
<!--                               controls-position='right'>-->

<!--              </el-input-number>-->
<!--            </el-form-item>-->
<!--          </el-col>-->
          <el-col :span="12">
            <el-form-item label="回收木箱(个)" prop="recycleBoxQty">
              <el-input-number v-model="dataForm.recycleBoxQty" placeholder="数字文本" :step="1" controls-position='right'>

              </el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="回收管子(根)" prop="recycleTubeQty">
              <el-input-number v-model="dataForm.recycleTubeQty" placeholder="数字文本" :step="1" controls-position='right'>

              </el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="退货木箱(个)" prop="returnBoxQty">
              <el-input-number v-model="dataForm.returnBoxQty" placeholder="数字文本" :step="1" controls-position='right'>

              </el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="退货管芯(根)" prop="returnTubeQty">
              <el-input-number v-model="dataForm.returnTubeQty" placeholder="数字文本" :step="1" controls-position='right'>

              </el-input-number>
            </el-form-item>
          </el-col>
<!--          <el-col :span="12">-->
<!--            <el-form-item label="结存木箱(个)" prop="onHandBoxQty">-->
<!--              <el-input-number v-model="dataForm.onHandBoxQty" placeholder="数字文本" :step="1" controls-position='right'>-->

<!--              </el-input-number>-->
<!--            </el-form-item>-->
<!--          </el-col>-->
<!--          <el-col :span="12">-->
<!--            <el-form-item label="结存FRP管芯(根)" prop="onHandFrpTubeQty">-->
<!--              <el-input-number v-model="dataForm.onHandFrpTubeQty" placeholder="数字文本" :step="1" controls-position='right'>-->

<!--              </el-input-number>-->
<!--            </el-form-item>-->
<!--          </el-col>-->
        </template>
      </el-form>
    </el-row>
    <span slot="footer" class="dialog-footer">
        <el-button @click="visible = false"> 取 消</el-button>
        <el-button type="primary" @click="dataFormSubmit()" v-if="!isDetail"> 确 定</el-button>
    </span>
  </el-dialog>
</template>
<script>
import request from '@/utils/request'
// import {previewDataInterface} from '@/api/systemData/dataInterface'
// import {getDictionaryDataSelector} from '@/api/systemData/dictionary'

export default {
  components: {},
  props: [],
  data() {
    return {
      visible: false,
      loading: false,
      isDetail: false,
      dataForm: {
        spec: '',
        frpSpec: '',
        deliveryDate: '',
        customerCode: '',
        customerName: '',
        status: '',
        deliveryBoxQty: '',
        deliveryTubeQty: '',
        recycleBoxQty: '',
        recycleTubeQty: '',
        returnBoxQty: '',
        returnTubeQty: '',
        onHandBoxQty: '',
        onHandFrpTubeQty: '',
      },
      specSelector: [],
      frpSpecSelector: [],
      rules:
        {},

    }
  },
  computed: {},
  watch: {},
  created() {
  },
  mounted() {
    this.initFRPSpecSelector();
    this.initSpecSelector();
  },
  methods: {
    initFRPSpecSelector() {
      request({
        url: '/api/project/CusFRPSpec/selector',
        method: 'get'
      }).then(res => {
        this.frpSpecSelector = res.data.data;
      })
    },
    initSpecSelector() {
      request({
        url: '/api/project/CusSpec/selector',
        method: 'get'
      }).then(res => {
        this.specSelector = res.data.data;
      })
    },
    init(id, isDetail) {
      this.dataForm.id = id || 0;
      this.visible = true;
      this.isDetail = isDetail || false;
      this.$nextTick(() => {
        this.$refs['elForm'].resetFields();
        if (this.dataForm.id) {
          this.loading = true
          request({
            url: '/api/project/CusReceipt/' + this.dataForm.id,
            method: 'get'
          }).then(res => {
            this.dataInfo(res.data.data)
            this.loading = false
          })
        }

      })
    },
    // 表单提交
    dataFormSubmit() {
      this.$refs['elForm'].validate((valid) => {
        if (valid) {
          this.request()
        }
      })
    },
    request() {
      var _data = this.dataList()
      if (!this.dataForm.id) {
        request({
          url: '/api/project/CusReceipt',
          method: 'post',
          data: _data
        }).then((res) => {
          this.$message({
            message: res.data.msg,
            type: 'success',
            duration: 1000,
            onClose: () => {
              this.visible = false
              this.$emit('refresh', true)
            }
          })
        })
      } else {
        request({
          url: '/api/project/CusReceipt/' + this.dataForm.id,
          method: 'PUT',
          data: _data
        }).then((res) => {
          this.$message({
            message: res.data.msg,
            type: 'success',
            duration: 1000,
            onClose: () => {
              this.visible = false
              this.$emit('refresh', true)
            }
          })
        })
      }
    },
    dataList() {
      var _data = JSON.parse(JSON.stringify(this.dataForm));
      return _data;
    },
    dataInfo(dataAll) {
      let _dataAll = dataAll
      this.dataForm = _dataAll
    },
  },
}

</script>
