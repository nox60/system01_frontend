<template>
  <div class="app-container">
    <div class="filter-container">
<!--      <el-input v-model="listQuery.title" placeholder="Title" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />-->
<!--      <el-select v-model="listQuery.importance" placeholder="Imp" clearable style="width: 90px" class="filter-item">-->
<!--        <el-option v-for="item in importanceOptions" :key="item" :label="item" :value="item" />-->
<!--      </el-select>-->
<!--      <el-select v-model="listQuery.type" placeholder="Type" clearable class="filter-item" style="width: 130px">-->
<!--        <el-option v-for="item in typeValuesArray" :key="item.key" :label="item.display_name+'('+item.key+')'" :value="item.key" />-->
<!--      </el-select>-->
<!--      <el-select v-model="listQuery.sort" style="width: 140px" class="filter-item" @change="handleFilter">-->
<!--        <el-option v-for="item in sortOptions" :key="item.key" :label="item.label" :value="item.key" />-->
<!--      </el-select>-->
<!--      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">-->
<!--        搜索-->
<!--      </el-button>-->
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleAddOrEditWorkRecord({ recordId: 0})">
        新建记录
      </el-button>
<!--      <el-button v-waves :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">-->
<!--        导出-->
<!--      </el-button>-->
<!--      <el-checkbox v-model="showReviewer" class="filter-item" style="margin-left:15px;" @change="tableKey=tableKey+1">-->
<!--        审批-->
<!--      </el-checkbox>-->
    </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column label="记录编号" prop="id" sortable="custom" align="center" width="80" :class-name="getSortClass('id')">
        <template slot-scope="{row}">
          <span>{{ row.recordId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="记录时间" width="150px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.createTime | parseTime('{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="标题" min-width="150px">
        <template slot-scope="{row}">
          <span>{{ row.recordName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="记录地址" min-width="150px">
        <template slot-scope="{row}">
          <span>{{ row.recordAddress }}</span>
        </template>
      </el-table-column>
      <el-table-column label="记录内容" min-width="150px">
        <template slot-scope="{row}">
          <span>{{ row.recordBody }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Actions" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button v-if="row.itemStatus=='0'" type="primary" size="mini" @click="handleUpdate(row)">
            编辑
          </el-button>

          <el-button v-if="row.itemStatus=='0'" size="mini" type="danger" @click="handleDeleteConfirm(row,$index)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
    <el-dialog
      :title="forEdit==='1'?'编辑记录':'添加记录'"
      :visible.sync="dialogVisible"
      @close="handleClose"
    >
      <el-form
        v-if="dialogVisible"
        ref="workRecordForm"
        :model="workRecordForm"
        :modal-append-to-body="true"
        label-width="100px"
        label-position="left"
      >
        <el-form-item label="工作名" prop="recordName">
          <el-input
            v-model="workRecordForm.recordName"
            placeholder="工作名"
          />
        </el-form-item>
        <el-form-item label="工作描述" prop="recordBody">
          <el-input
            v-model="workRecordForm.recordBody"
            placeholder="工作描述"
          />
        </el-form-item>
        <el-form-item label="记录地址" prop="recordAddress">
          <el-input
            v-model="workRecordForm.recordAddress"
            placeholder="记录地址"
          />
        </el-form-item>

      </el-form>
      <div style="text-align:right;">
        <el-button type="danger" @click="handleClose">取消</el-button>
        <el-button type="primary" @click="confirmAddOrUpdateRecord">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { addOrUpdateWorkRecord, listWorkRecordData, deleteWorkRecord } from '@/api/work-record'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination'
import {addOrUpdateUser, listUserData} from '@/api/user'

const typeValuesArray = [
  { typeValue: 0, typeName: '数据' },
  { typeValue: 1, typeName: '数据' },
  { typeValue: 2, typeName: '数据' },
  { typeValue: 3, typeName: '其他' },
  { typeValue: 4, typeName: '测试数据1' },
  { typeValue: 5, typeName: '测试数据2' },
  { typeValue: 6, typeName: '测试数据3' },
  { typeValue: 7, typeName: '测试数据4' },
]

const statusOptions = [
  { statusValue: 0, statusName: '编辑中' },
  { statusValue: 1, statusName: '审核中' },
  { statusValue: 2, statusName: '已发布' }
]

export default {
  name: 'ComplexTable',
  components: { Pagination },
  directives: { waves },
  filters: {
  },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      forEdit: 0,
      listLoading: false,
      listQuery: {
        page: 1,
        limit: 20,
        importance: undefined,
        title: undefined,
        type: undefined,
        sort: '+id'
      },
      importanceOptions: [1, 2, 3],
      typeValuesArray,
      statusOptions,
      sortOptions: [{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }],
      showReviewer: false,
      workRecordForm: {
        recordId: -1,
        recordName: '',
        recordBody: '',
        recordAddress: '',
        roleIds: []
      },
      dialogStatus: '',
      dialogVisible: false,
      textMap: {
        update: 'Edit',
        create: 'Create'
      },
      dialogPvVisible: false,
      pvData: [],
      rules: {
        type: [{ required: true, message: 'type is required', trigger: 'change' }],
        timestamp: [{ type: 'date', required: true, message: 'timestamp is required', trigger: 'change' }],
        title: [{ required: true, message: 'title is required', trigger: 'blur' }]
      },
      downloadLoading: false
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      listWorkRecordData(this.listQuery).then(response => {
        this.list = response.data.dataLists
        this.total = response.data.totalCounts
        console.log(this.list)
        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    initFormData() {
      if (this.forEdit === 1) { // 编辑数据
        listUserData({ 'page': 1, 'limit': 1, 'recordId': this.workRecordForm.recordId }).then(response => {
          setTimeout(() => {
            this.dialogVisible = true
            this.$nextTick(() => {
              this.$refs['workRecordForm'].resetFields()
              this.workRecordForm = response.data.dataLists[0]
              this.listLoading = false
            })
          }, 1000)
        })
      } else {
        this.dialogVisible = true
        this.$nextTick(() => {
          this.$refs['workRecordForm'].resetFields()
        })
      }
    },
    handleAddOrEditWorkRecord(row) {
      this.listLoading = true
      if (row.recordId === 0) { // 新增
        console.log('新增数据')
        this.forEdit = 0
      } else { // 修改
        console.log('修改数据')
        this.forEdit = 1
        this.workRecordForm.recordId = row.recordId
      }
      this.$nextTick(() => {
        this.initFormData()
      })
    },
    handleDeleteConfirm(row) {
      this.$confirm('确认删除？')
        .then(_ => {
          console.log('点击了确认')
          console.log(row['itemId'])
          deleteWorkRecord(row['itemId']).then(() => {
            this.dialogVisible = false
            this.$notify({
              title: 'Success',
              message: '删除数据成功！',
              type: 'success',
              duration: 2000
            })
            this.getList()
          })
        })
        .catch(_ => {})
    },
    handleClose() {
      this.$refs['workRecordForm'].resetFields()
      this.dialogVisible = false
    },
    getSortClass: function(key) {
      const sort = this.listQuery.sort
      return sort === `+${key}` ? 'ascending' : 'descending'
    },
    confirmAddOrUpdateRecord() {
      this.listLoading = true
      console.log(this.workRecordForm)
      addOrUpdateWorkRecord(this.workRecordForm).then(() => {
        this.$notify({
          title: 'Success',
          message: '操作成功',
          type: 'success',
          duration: 2000
        })
        this.$refs['workRecordForm'].resetFields()
        this.listLoading = false
        this.dialogVisible = false
        this.reload()
      })
    },
  }
}
</script>
