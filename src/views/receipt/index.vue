<template>
  <div class="JNPF-common-layout">

    <div class="JNPF-common-layout-center">
      <el-row class="JNPF-common-search-box" :gutter="16">
        <el-form @submit.native.prevent>
          <el-col :span="6">
            <el-form-item label="规格">
              <el-input v-model="query.spec" placeholder="请输入" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="FRP规格">
              <el-input v-model="query.frpSpec" placeholder="请输入" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="发货日期">
              <el-date-picker v-model="query.deliveryDate" type="daterange"
                              value-format="timestamp" format="yyyy-MM-dd" start-placeholder="开始日期"
                              end-placeholder="结束日期">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <template v-if="showAll">
            <el-col :span="6">
              <el-form-item label="客户">
                <el-input v-model="query.customerName" placeholder="请输入" clearable></el-input>
              </el-form-item>
            </el-col>
          </template>
          <el-col :span="6">
            <el-form-item>
              <el-button type="primary" icon="el-icon-search" @click="search()">查询</el-button>
              <el-button icon="el-icon-refresh-right" @click="reset()">重置</el-button>
              <el-button type="text" icon="el-icon-arrow-down" @click="showAll=true" v-if="!showAll">
                展开
              </el-button>
              <el-button type="text" icon="el-icon-arrow-up" @click="showAll=false" v-else>
                收起
              </el-button>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
      <div class="JNPF-common-layout-main JNPF-flex-main">
        <div class="JNPF-common-head">
          <div>
            <el-button type="primary" icon="el-icon-plus" v-if="isCustomer"
                       @click="addOrUpdateHandle()">新增
            </el-button>
          </div>
          <div class="JNPF-common-head-right">
            <el-tooltip effect="dark" content="刷新" placement="top">
              <el-link icon="icon-ym icon-ym-Refresh JNPF-common-head-icon" :underline="false"
                       @click="reset()"/>
            </el-tooltip>
            <screenfull isContainer/>
          </div>
        </div>
        <JNPF-table v-loading="listLoading" :data="list" @sort-change='sortChange'>
          <el-table-column prop="spec" label="规格" width="0" align="left"
          />
          <el-table-column prop="frpSpec" label="FRP规格" width="0" align="left"
          />
          <el-table-column prop="deliveryDate" label="发货日期" width="0" align="left"
          />
          <el-table-column prop="customerName" label="客户" width="0" align="left"
          />
          <el-table-column prop="deliveryBoxQty" label="发货木箱(个) " width="0" align="left"
          />
          <el-table-column prop="deliveryTubeQty" label="发货管子(根)" width="0" align="left"
          />
          <el-table-column prop="recycleBoxQty" label="回收木箱(个)" width="0" align="left"
          />
          <el-table-column prop="recycleTubeQty" label="回收管子(根)" width="0" align="left"
          />
          <el-table-column prop="returnBoxQty" label="退货木箱(个)" width="0" align="left"
          />
          <el-table-column prop="returnTubeQty" label="退货管芯(根)" width="0" align="left"
          />
          <el-table-column prop="onHandBoxQty" label="结存木箱(个)" width="0" align="left"
          />
          <el-table-column prop="onHandFrpTubeQty" label="结存FRP管芯(根)" width="0" align="left"
          />
          <el-table-column label="操作" fixed="right"
                           width="100">
            <template slot-scope="scope">
              <el-button type="text" v-if="isCustomer && scope.row.status === 1"
                         @click="addOrUpdateHandle(scope.row.id)">编辑
              </el-button>
              <el-button type="text" class="JNPF-table-delBtn" v-if="isCustomer && scope.row.status === 1"
                         @click="handleDel(scope.row.id)">删除
              </el-button>
              <el-button type="text" style="color:green" v-if="!isCustomer && scope.row.status === 1"
                         @click="handleConfirm(scope.row.id)">确认
              </el-button>
              <span v-if="scope.row.status === 2" style="color:#af39b1">已确认</span>
            </template>
          </el-table-column>
        </JNPF-table>
        <pagination :total="total" :page.sync="listQuery.currentPage" :limit.sync="listQuery.pageSize" @pagination="initData"/>
      </div>
    </div>
    <JNPF-Form v-if="formVisible" ref="JNPFForm" @refresh="refresh"/>
    <!-- <ExportBox v-if="exportBoxVisible" ref="ExportBox" @download="download"/> -->
  </div>
</template>

<script>
import request from '@/utils/request'
import JNPFTable from '@/components/JNPF-table'
import Screenfull from '@/components/Screenfull'
// import {getDictionaryDataSelector} from '@/api/systemData/dictionary'
import JNPFForm from './Form'
// import {previewDataInterface} from '@/api/systemData/dataInterface'

export default {
  components: {JNPFForm, Screenfull, JNPFTable},
  data() {
    return {
      showAll: false,
      query: {
        spec: undefined,
        frpSpec: undefined,
        deliveryDate: undefined,
        customerName: undefined,
      },
      treeProps: {
        children: 'children',
        label: 'fullName',
        value: 'id'
      },
      list: [],
      listLoading: true,
      total: 0,
      listQuery: {
        currentPage: 1,
        pageSize: 20,
        sort: "desc",
        sidx: "",
      },
      formVisible: false,
      exportBoxVisible: false,
      isCustomer: false,
      columnList: [
        {prop: 'spec', label: '规格'},
        {prop: 'frpSpec', label: 'FRP规格'},
        {prop: 'deliveryDate', label: '发货日期'},
        {prop: 'customerCode', label: '客户（部门）编码'},
        {prop: 'customerName', label: '客户（部门）名称'},
        {prop: 'status', label: '状态 1已提交 2已确认'},
        {prop: 'deliveryBoxQty', label: '发货木箱(个) '},
        {prop: 'deliveryTubeQty', label: '发货管子(根)'},
        {prop: 'recycleBoxQty', label: '回收木箱(个)'},
        {prop: 'recycleTubeQty', label: '回收管子(根)'},
        {prop: 'returnBoxQty', label: '退货木箱(个)'},
        {prop: 'returnTubeQty', label: '退货管芯(根)'},
        {prop: 'onHandBoxQty', label: '结存木箱(个)'},
        {prop: 'onHandFrpTubeQty', label: '结存FRP管芯(根)'},
      ],
    }
  },
  computed: {},
  created() {
    this.initData()
    this.initIsCustomer();
  },
  methods: {
    initIsCustomer() {
      request({
        url: '/api/project/CusDelivery/isCustomer',
        method: 'get'
      }).then(res => {
        this.isCustomer = res.data;
      })
    },
    sortChange({column, prop, order}) {
      this.listQuery.sort = order == 'ascending' ? 'asc' : 'desc'
      this.listQuery.sidx = !order ? '' : prop
      this.initData()
    },
    initData() {
      this.listLoading = true;
      let _query = {
        ...this.listQuery,
        ...this.query
      };
      request({
        url: `/api/project/CusReceipt/getList`,
        method: 'post',
        data: _query
      }).then(res => {
        let result = res.data
        var _list = [];
        for (let i = 0; i < result.data.list.length; i++) {
          let _data = result.data.list[i];
          _list.push(_data)
        }
        this.list = _list
        this.total = result.data.pagination.total

        this.listLoading = false
      })
    },
    handleDel(id) {
      this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
        type: 'warning'
      }).then(() => {
        request({
          url: `/api/project/CusReceipt/${id}`,
          method: 'DELETE'
        }).then(res => {
          this.$message({
            type: 'success',
            message: res.msg,
            onClose: () => {
              this.initData()
            }
          });
        })
      }).catch(() => {
      });
    },
    handleConfirm(id) {
      request({
        url: `/api/project/CusReceipt/confirm/${id}`,
        method: 'PUT'
      }).then(res => {
        this.$message({
          type: 'success',
          message: res.msg,
          onClose: () => {
            this.initData()
          }
        });
      })
    },
    addOrUpdateHandle(id, isDetail) {
      this.formVisible = true
      this.$nextTick(() => {
        this.$refs.JNPFForm.init(id, isDetail)
      })
    },
    exportData() {
      this.exportBoxVisible = true
      this.$nextTick(() => {
        this.$refs.ExportBox.init(this.columnList)
      })
    },
    download(data) {
      let query = {...data, ...this.listQuery, ...this.query}
      request({
        url: `/api/project/CusReceipt/Actions/Export`,
        method: 'GET',
        data: query
      }).then(res => {
        if (!res.data.url) return
        window.location.href = this.define.comUrl + res.data.url
        this.$refs.ExportBox.visible = false
        this.exportBoxVisible = false
      })
    },
    search() {
      this.listQuery = {
        currentPage: 1,
        pageSize: 20,
        sort: "desc",
        sidx: "",
      }
      this.initData()
    },
    refresh(isrRefresh) {
      this.formVisible = false
      if (isrRefresh) this.reset()
    },
    reset() {
      for (let key in this.query) {
        this.query[key] = undefined
      }
      this.listQuery = {
        currentPage: 1,
        pageSize: 20,
        sort: "desc",
        sidx: "",
      }
      this.initData()
    }
  }
}
</script>
