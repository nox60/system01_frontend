<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleAddOrEditWorkRecord({ recordId: 0})">
        新建记录
      </el-button>
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
      <el-table-column label="记录编号" prop="id" align="center" width="80">
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
      <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button type="primary" size="mini" @click="handleAddOrEditWorkRecord(row)">
            编辑
          </el-button>
          <el-button size="mini" type="danger" @click="handleDeleteConfirm(row,$index)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
    <el-dialog
      :title="forEdit==='1'?'编辑记录':'添加记录'"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      @close="handleClose"
    >
      <el-form
        v-if="dialogVisible"
        ref="workRecordForm"
        :model="workRecordForm"
        :modal-append-to-body="true"
        :rules="rules"
        label-width="100px"
        label-position="left"
      >
        <el-form-item label="工作名" prop="recordName">
          <el-input
            v-model="workRecordForm.recordName"
            placeholder="工作名"
            maxlength="10"
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
        <el-form-item label="相关责任人" prop="accountId">
          <el-select v-model="workRecordForm.accountId" style="width: 140px" class="filter-item">
            <el-option v-for="user in usersList" :key="user.accountId" :label="user.realName" :value="user.accountId" />
          </el-select>
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
import { listUserData } from '@/api/user'
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination'

export default {
  inject: ['reload'],
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
      usersList: [],
      listQuery: {
        page: 1,
        limit: 20,
        importance: undefined,
        title: undefined,
        type: undefined,
        sort: '+id'
      },
      sortOptions: [{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }],
      showReviewer: false,
      workRecordForm: {
        recordId: 0,
        recordName: '',
        recordBody: '',
        recordAddress: '',
        roleIds: [],
        accountId: 2
      },
      dialogStatus: '',
      dialogVisible: false,
      textMap: {
        update: 'Edit',
        create: 'Create'
      },
      rules: {
        recordName: [{ required: true, message: '工作名称不能为空！', trigger: 'blur' }]
      },
      downloadLoading: false
    }
  },
  created() {
    this.getUsers()
    this.getList()
  },
  methods: {
    getUsers() {
      listUserData({ accountId: -1, page: 1, limit: 100 }).then(response => {
        this.usersList = response.data.dataLists
        setTimeout(() => {
        }, 1.5 * 1000)
      })
    },
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
        listWorkRecordData({ 'page': 1, 'limit': 1, 'recordId': this.workRecordForm.recordId }).then(response => {
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
          console.log(row['recordId'])
          deleteWorkRecord(row['recordId']).then(() => {
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
      this.workRecordForm.recordId = 0 // 解决resetFields不能把隐藏字段进行重置的问题
      this.dialogVisible = false
      this.listLoading = false
    },
    getSortClass: function(key) {
      const sort = this.listQuery.sort
      return sort === `+${key}` ? 'ascending' : 'descending'
    },
    confirmAddOrUpdateRecord() {
      this.$refs['workRecordForm'].validate((valid) => {
        if (valid) {
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
        }
      })
    }
  }
}
</script>
