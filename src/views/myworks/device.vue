<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleAddOrEditDevice({ deviceId: 0})">
        新建设备
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
      <el-table-column label="设备编号" prop="id" align="center" width="80">
        <template slot-scope="{row}">
          <span>{{ row.deviceId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="设备时间" width="150px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.createTime | parseTime('{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="标题" min-width="150px">
        <template slot-scope="{row}">
          <span>{{ row.deviceName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="设备地址" min-width="150px">
        <template slot-scope="{row}">
          <span>{{ row.deviceAddress }}</span>
        </template>
      </el-table-column>
      <el-table-column label="设备内容" min-width="150px">
        <template slot-scope="{row}">
          <span>{{ row.deviceBody }}</span>
        </template>
      </el-table-column>
      <el-table-column label="设备评级" min-width="150px">
        <template slot-scope="{row}">
          <el-rate v-model="row.level" :allow-half="true" disabled text-color="#ff9900" />
        </template>
      </el-table-column>
      <el-table-column label="维护时间" min-width="150px">
        <template slot-scope="{row}">
          <span>{{ row.deviceTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button type="primary" size="mini" @click="handleAddOrEditDevice(row)">
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
      :title="forEdit==='1'?'编辑设备':'添加设备'"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      @close="handleClose"
    >
      <el-form
        v-if="dialogVisible"
        ref="DeviceForm"
        :model="DeviceForm"
        :modal-append-to-body="true"
        :rules="rules"
        label-width="100px"
        label-position="left"
      >
        <el-form-item label="设备名" prop="deviceName">
          <el-input
            v-model="DeviceForm.deviceName"
            placeholder="设备名"
            maxlength="30"
          />
        </el-form-item>
        <el-form-item label="设备描述" prop="deviceBody">
          <el-input
            v-model="DeviceForm.deviceBody"
            placeholder="设备描述"
            maxlength="200"
          />
        </el-form-item>
        <el-form-item label="设备地址" prop="deviceAddress">
          <el-input
            v-model="DeviceForm.deviceAddress"
            placeholder="设备地址"
            maxlength="100"
          />
        </el-form-item>
        <el-form-item label="相关责任人" prop="accountId">
          <el-select v-model="DeviceForm.accountId" style="width: 140px" class="filter-item">
            <el-option v-for="user in usersList" :key="user.accountId" :label="user.realName" :value="user.accountId" />
          </el-select>
        </el-form-item>
        <el-form-item label="设备时间" prop="deviceTime">
          <el-date-picker v-model="DeviceForm.deviceTime" type="datetime" placeholder="选择时间" value-format="yyyy-MM-dd HH:mm" format="yyyy-MM-dd HH:mm" />
        </el-form-item>
        <el-form-item label="设备评级" prop="level">
          <el-rate v-model="DeviceForm.level" :colors="['#99A9BF', '#F7BA2A', '#FF9900']" :max="5" style="margin-top:8px;" />
        </el-form-item>

      </el-form>
      <div style="text-align:right;">
        <el-button type="danger" @click="handleClose">取消</el-button>
        <el-button type="primary" @click="confirmAddOrUpdateDevice">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { addOrUpdateDevice, listDeviceData, deleteDevice } from '@/api/device'
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
      DeviceForm: {
        deviceId: 0,
        deviceName: '',
        deviceBody: '',
        deviceAddress: '',
        roleIds: [],
        accountId: 2,
        level: 0,
        deviceTime: ''
      },
      dialogStatus: '',
      dialogVisible: false,
      textMap: {
        update: 'Edit',
        create: 'Create'
      },
      rules: {
        deviceName: [{ required: true, message: '设备名称不能为空！', trigger: 'blur' }]
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
      listDeviceData(this.listQuery).then(response => {
        this.list = response.data.dataLists
        this.total = response.data.totalCounts
        // console.log(this.list)
        console.log('请求结果 : ', this.list)
        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    initFormData() {
      if (this.forEdit === 1) { // 编辑数据
        listDeviceData({ 'page': 1, 'limit': 1, 'deviceId': this.DeviceForm.deviceId }).then(response => {
          setTimeout(() => {
            this.dialogVisible = true
            this.$nextTick(() => {
              this.$refs['DeviceForm'].resetFields()
              this.DeviceForm = response.data.dataLists[0]
              this.listLoading = false
            })
          }, 1000)
        })
      } else {
        this.dialogVisible = true
        this.$nextTick(() => {
          this.$refs['DeviceForm'].resetFields()
        })
      }
    },
    handleAddOrEditDevice(row) {
      this.listLoading = true
      if (row.deviceId === 0) { // 新增
        console.log('新增数据')
        this.forEdit = 0
      } else { // 修改
        console.log('修改数据')
        this.forEdit = 1
        this.DeviceForm.deviceId = row.deviceId
      }
      this.$nextTick(() => {
        this.initFormData()
      })
    },
    handleDeleteConfirm(row) {
      this.$confirm('确认删除？')
        .then(_ => {
          console.log('点击了确认')
          console.log(row['deviceId'])
          deleteDevice(row['deviceId']).then(() => {
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
      this.$refs['DeviceForm'].resetFields()
      this.DeviceForm.deviceId = 0 // 解决resetFields不能把隐藏字段进行重置的问题
      this.dialogVisible = false
      this.listLoading = false
    },
    getSortClass: function(key) {
      const sort = this.listQuery.sort
      return sort === `+${key}` ? 'ascending' : 'descending'
    },
    confirmAddOrUpdateDevice() {
      this.$refs['DeviceForm'].validate((valid) => {
        if (valid) {
          this.listLoading = true
          // console.log(this.DeviceForm)
          addOrUpdateDevice(this.DeviceForm).then(() => {
            this.$notify({
              title: 'Success',
              message: '操作成功',
              type: 'success',
              duration: 2000
            })
            this.$refs['DeviceForm'].resetFields()
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
