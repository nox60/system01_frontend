<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" :disabled="listLoading" @click="handleAddOrEditFod({ fodId: 0})">
        新建外来物
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
      <el-table-column label="外来物编号" prop="id" align="center" width="100">
        <template slot-scope="{row}">
          <span>{{ row.fodId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="捕获时间" width="150px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.createTime | parseTime('{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="外来物名称" min-width="150px">
        <template slot-scope="{row}">
          <span>{{ row.fodName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="捕获地址" min-width="150px">
        <template slot-scope="{row}">
          <span>{{ row.fodAddress }}</span>
        </template>
      </el-table-column>
      <el-table-column label="详细描述" min-width="150px">
        <template slot-scope="{row}">
          <span>{{ row.fodBody }}</span>
        </template>
      </el-table-column>
      <el-table-column label="危险评级" min-width="150px">
        <template slot-scope="{row}">
          <span>{{ row.level }}级</span>
        </template>
      </el-table-column>
      <el-table-column label="捕获时间" min-width="150px">
        <template slot-scope="{row}">
          <span>{{ row.fodTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button type="primary" size="mini" @click="handleAddOrEditFod(row)">
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
      :title="forEdit==='1'?'编辑外来物':'添加外来物'"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      @close="handleClose"
    >
      <el-form
        v-if="dialogVisible"
        ref="FodForm"
        :model="FodForm"
        :modal-append-to-body="true"
        :rules="rules"
        label-width="100px"
        label-position="left"
      >
        <el-form-item label="外来物名" prop="fodName">
          <el-input
            v-model="FodForm.fodName"
            placeholder="外来物名"
            maxlength="30"
          />
        </el-form-item>
        <el-form-item label="外来物描述" prop="fodBody">
          <el-input
            v-model="FodForm.fodBody"
            placeholder="外来物描述"
            maxlength="230"
          />
        </el-form-item>
        <el-form-item label="捕获地址" prop="fodAddress">
          <el-input
            v-model="FodForm.fodAddress"
            placeholder="外来物地址"
            maxlength="100"
          />
        </el-form-item>
        <el-form-item label="捕获者" prop="accountId">
          <el-select v-model="FodForm.accountId" style="width: 140px" class="filter-item">
            <el-option v-for="user in usersList" :key="user.accountId" :label="user.realName" :value="user.accountId" />
          </el-select>
        </el-form-item>
        <el-form-item label="捕获时间" prop="fodTime">
          <el-date-picker v-model="FodForm.fodTime" type="datetime" placeholder="选择时间" value-format="yyyy-MM-dd HH:mm" format="yyyy-MM-dd HH:mm" />
        </el-form-item>
        <el-form-item label="危险评级" prop="level">
          <el-select v-model="FodForm.level" style="width: 140px" class="filter-item">
            <el-option key="1" label="1级" value="1" />
            <el-option key="2" label="2级" value="2" />
            <el-option key="3" label="3级" value="3" />
            <el-option key="4" label="4级" value="4" />
            <el-option key="5" label="5级" value="5" />
            <el-option key="6" label="6级" value="6" />
            <el-option key="7" label="7级" value="7" />
            <el-option key="8" label="8级" value="8" />
            <el-option key="9" label="9级" value="9" />
          </el-select>

        </el-form-item>

      </el-form>
      <div style="text-align:right;">
        <el-button type="danger" @click="handleClose">取消</el-button>
        <el-button type="primary" @click="confirmAddOrUpdateFod">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { addOrUpdateFod, listFodData, deleteFod } from '@/api/fod'
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
      FodForm: {
        fodId: 0,
        fodName: '',
        fodBody: '',
        fodAddress: '',
        roleIds: [],
        accountId: 2,
        level: '1',
        fodTime: ''
      },
      dialogStatus: '',
      dialogVisible: false,
      textMap: {
        update: 'Edit',
        create: 'Create'
      },
      rules: {
        fodName: [{ required: true, message: '外来物名称不能为空！', trigger: 'blur' }]
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
      listFodData(this.listQuery).then(response => {
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
        listFodData({ 'page': 1, 'limit': 1, 'fodId': this.FodForm.fodId }).then(response => {
          setTimeout(() => {
            this.dialogVisible = true
            this.$nextTick(() => {
              this.$refs['FodForm'].resetFields()
              this.FodForm = response.data.dataLists[0]
              this.listLoading = false
            })
          }, 1000)
        })
      } else {
        this.dialogVisible = true
        this.$nextTick(() => {
          this.$refs['FodForm'].resetFields()
        })
      }
    },
    handleAddOrEditFod(row) {
      this.listLoading = true
      if (row.fodId === 0) { // 新增
        console.log('新增数据')
        this.forEdit = 0
      } else { // 修改
        console.log('修改数据')
        this.forEdit = 1
        this.FodForm.fodId = row.fodId
      }
      this.$nextTick(() => {
        this.initFormData()
      })
    },
    handleDeleteConfirm(row) {
      this.$confirm('确认删除？')
        .then(_ => {
          console.log('点击了确认')
          console.log(row['fodId'])
          deleteFod(row['fodId']).then(() => {
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
      this.$refs['FodForm'].resetFields()
      this.FodForm.fodId = 0 // 解决resetFields不能把隐藏字段进行重置的问题
      this.dialogVisible = false
      this.listLoading = false
    },
    getSortClass: function(key) {
      const sort = this.listQuery.sort
      return sort === `+${key}` ? 'ascending' : 'descending'
    },
    confirmAddOrUpdateFod() {
      this.$refs['FodForm'].validate((valid) => {
        if (valid) {
          this.listLoading = true
          console.log(this.FodForm)
          addOrUpdateFod(this.FodForm).then(() => {
            this.$notify({
              title: 'Success',
              message: '操作成功',
              type: 'success',
              duration: 2000
            })
            this.$refs['FodForm'].resetFields()
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
