<template>
  <el-dialog :title="!dataForm.id ? '新建' :  isDetail ? '详情':'编辑'"
             :close-on-click-modal="false" append-to-body
             :visible.sync="visible" class="JNPF-dialog JNPF-dialog_center" lock-scroll
             width="600px">
    <el-row :gutter="15" class="">
      <el-form ref="elForm" :model="dataForm" :rules="rules" size="small" label-width="100px" label-position="right">
        <template v-if="!loading">
          <el-col :span="24">
            <el-form-item label="客户" prop="customerCode">
              <el-select v-model="dataForm.customerCode" filterable placeholder="请选择" clearable
                         @change="customerChange" :style='{"width":"100%"}'>
                <el-option v-for="(item, index) in customerSelector"
                           :key="item.enCode" :label="item.fullName" :value="item.enCode">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="发货日期" prop="deliveryDate">
              <el-date-picker v-model="dataForm.deliveryDate" placeholder="请选择" clearable :style='{"width":"100%"}'
                              type="date" format="yyyy-MM-dd" value-format="timestamp">

              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="铜箔规格" prop="spec">
              <el-select v-model="dataForm.spec" filterable placeholder="请选择" clearable
                         :style='{"width":"100%"}'>
                <el-option v-for="(item, index) in specSelector"
                           :key="item.spec" :label="item.spec" :value="item.spec">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="FRP规格" prop="frpSpec">
              <el-select v-model="dataForm.frpSpec" filterable placeholder="请选择" clearable
                         :style='{"width":"100%"}'>
                <el-option v-for="(item, index) in frpSpecSelector"
                           :key="item.frpSpec" :label="item.frpSpec" :value="item.frpSpec">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="发货木箱数量" prop="deliveryBoxQty">
              <el-input-number v-model="dataForm.deliveryBoxQty" placeholder="数字文本"
                               style="width: 100%;" :step="1" controls-position='right'>
              </el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="发货管子数量" prop="deliveryTubeQty">
              <el-input-number v-model="dataForm.deliveryTubeQty" placeholder="数字文本"
                               style="width: 100%;" :step="1" controls-position='right'>
              </el-input-number>
            </el-form-item>
          </el-col>
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
          customerCode: '',
          customerName: '',
          deliveryDate: '',
          spec: '',
          frpSpec: '',
          deliveryBoxQty: '',
          deliveryTubeQty: '',
        },
        customerSelector: [],
        specSelector: [],
        frpSpecSelector: [],
        rules:{
          customerCode: [{
            required: true,
            message: "请选择客户",
            trigger: "blur"
          }],
          //验证日期
          deliveryDate:[{ 
            type: 'date', 
            required: true, 
            message: '请选择发货日期', 
            trigger: 'blur' 
          }],
          spec:[{
            required: true,
            message: '请选择铜箔规格',
            trigger: 'blur'
          }],
          frpSpec:[{ 
            required: true, 
            message: '请选择FRP规格', 
            trigger: 'blur' 
          }],
            
      },

    }
  },
  computed: {},
  watch: {},
  created() {
  },
  mounted() {
    this.initCustomerSelector();
    this.initFRPSpecSelector();
    this.initSpecSelector();
  },
  methods: {
    initSpecSelector() {
      request({
        url: '/api/project/CusSpec/selector',
        method: 'get'
      }).then(res => {
        this.specSelector = res.data.data;
      })
    },
    initFRPSpecSelector() {
      request({
        url: '/api/project/CusFRPSpec/selector',
        method: 'get'
      }).then(res => {
        this.frpSpecSelector = res.data.data;
      })
    },
    initCustomerSelector() {
      request({
        url: '/api/permission/Organize/DepartmentByParent/customer',
        method: 'get'
      }).then(res => {
        this.customerSelector = res.data.data;
      })
    },
    customerChange(value) {
      if (!this.customerSelector)
        return;
      const obj = this.customerSelector.find((item) => {
        return item.enCode === value;
      });
      this.dataForm.customerName = obj.fullName;
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
            url: '/api/project/CusDelivery/' + this.dataForm.id,
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
          url: '/api/project/CusDelivery',
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
          url: '/api/project/CusDelivery/' + this.dataForm.id,
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
