<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleAddOrEditPatrol({ patrolId: 0})">
        新建巡视
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
      <el-table-column label="巡视编号" prop="id" align="center" width="80">
        <template slot-scope="{row}">
          <span>{{ row.patrolId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="巡视时间" width="150px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.createTime | parseTime('{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="巡视名称" min-width="150px">
        <template slot-scope="{row}">
          <span>{{ row.patrolName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="巡视地址" min-width="150px">
        <template slot-scope="{row}">
          <span>{{ row.patrolAddress }}</span>
        </template>
      </el-table-column>
      <el-table-column label="详细描述" min-width="150px">
        <template slot-scope="{row}">
          <span>{{ row.patrolBody }}</span>
        </template>
      </el-table-column>
      <el-table-column label="巡视时间" min-width="150px">
        <template slot-scope="{row}">
          <span>{{ row.patrolTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button type="primary" size="mini" @click="handleAddOrEditPatrol(row)">
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
      :title="forEdit==='1'?'编辑巡视':'添加巡视'"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      @close="handleClose"
    >
      <el-form
        v-if="dialogVisible"
        ref="PatrolForm"
        :model="PatrolForm"
        :modal-append-to-body="true"
        :rules="rules"
        label-width="100px"
        label-position="left"
      >
        <el-form-item label="巡视名" prop="patrolName">
          <el-input
            v-model="PatrolForm.patrolName"
            placeholder="巡视名"
            maxlength="30"
          />
        </el-form-item>
        <el-form-item label="巡视描述" prop="patrolBody">
          <el-input
            v-model="PatrolForm.patrolBody"
            placeholder="巡视描述"
            maxlength="200"
          />
        </el-form-item>
        <el-form-item label="巡视地址" prop="patrolAddress">
          <el-input
            v-model="PatrolForm.patrolAddress"
            placeholder="巡视地址"
            maxlength="100"
          />
        </el-form-item>
        <el-form-item label="巡视者" prop="accountId">
          <el-select v-model="PatrolForm.accountId" style="width: 140px" class="filter-item">
            <el-option v-for="user in usersList" :key="user.accountId" :label="user.realName" :value="user.accountId" />
          </el-select>
        </el-form-item>
        <el-form-item label="巡视时间" prop="patrolTime">
          <el-date-picker v-model="PatrolForm.patrolTime" type="datetime" placeholder="选择时间" value-format="yyyy-MM-dd HH:mm" format="yyyy-MM-dd HH:mm" />
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button type="danger" @click="handleClose">取消</el-button>
        <el-button type="primary" @click="confirmAddOrUpdatePatrol">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { addOrUpdatePatrol, listPatrolData, deletePatrol } from '@/api/patrol'
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
      PatrolForm: {
        patrolId: 0,
        patrolName: '',
        patrolBody: '',
        patrolAddress: '',
        roleIds: [],
        accountId: 2,
        level: 0,
        patrolTime: ''
      },
      dialogStatus: '',
      dialogVisible: false,
      textMap: {
        update: 'Edit',
        create: 'Create'
      },
      rules: {
        patrolName: [{ required: true, message: '巡视名不能为空！', trigger: 'blur' }]
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
      listPatrolData(this.listQuery).then(response => {
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
        listPatrolData({ 'page': 1, 'limit': 1, 'patrolId': this.PatrolForm.patrolId }).then(response => {
          setTimeout(() => {
            this.dialogVisible = true
            this.$nextTick(() => {
              this.$refs['PatrolForm'].resetFields()
              this.PatrolForm = response.data.dataLists[0]
              this.listLoading = false
            })
          }, 1000)
        })
      } else {
        this.dialogVisible = true
        this.$nextTick(() => {
          this.$refs['PatrolForm'].resetFields()
        })
      }
    },
    handleAddOrEditPatrol(row) {
      this.listLoading = true
      if (row.patrolId === 0) { // 新增
        console.log('新增数据')
        this.forEdit = 0
      } else { // 修改
        console.log('修改数据')
        this.forEdit = 1
        this.PatrolForm.patrolId = row.patrolId
      }
      this.$nextTick(() => {
        this.initFormData()
      })
    },
    handleDeleteConfirm(row) {
      this.$confirm('确认删除？')
        .then(_ => {
          console.log('点击了确认')
          console.log(row['patrolId'])
          deletePatrol(row['patrolId']).then(() => {
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
      this.$refs['PatrolForm'].resetFields()
      this.PatrolForm.patrolId = 0 // 解决resetFields不能把隐藏字段进行重置的问题
      this.dialogVisible = false
      this.listLoading = false
    },
    getSortClass: function(key) {
      const sort = this.listQuery.sort
      return sort === `+${key}` ? 'ascending' : 'descending'
    },
    confirmAddOrUpdatePatrol() {
      this.$refs['PatrolForm'].validate((valid) => {
        if (valid) {
          this.listLoading = true
          console.log(this.PatrolForm)
          addOrUpdatePatrol(this.PatrolForm).then(() => {
            this.$notify({
              title: 'Success',
              message: '操作成功',
              type: 'success',
              duration: 2000
            })
            this.$refs['PatrolForm'].resetFields()
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
