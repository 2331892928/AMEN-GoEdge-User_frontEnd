<template>
  <div class="q-pa-md">
    <q-table
      :data="rows"
      :columns="columns"
      :filter="filter"
      :loading="loading"
      :pagination.sync="pagination"
      @request="onRequest"
      title="证书管理"
      no-data-label="你还没有证书,去添加/申请吧"
      no-results-label="没有这个证书"
      loading-label="稍等哦，正在加载中"
      rows-per-page-label="每页显示数量："
      :rows-per-page-options="[10,15,20,25,50,0]"
      row-key="name"
    >
      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td key="id" :props="props">
            {{ props.row.id }}
          </q-td>
          <q-td key="name" :props="props">
            {{ props.row.name }}
          </q-td>
          <q-td key="commonNames1" :props="props">
            {{ props.row.commonNames1 }}
          </q-td>
          <q-td key="commonNames0" :props="props">
            {{ props.row.commonNames0 }}
          </q-td>
          <q-td key="dnsNames" :props="props">
            <div v-for="(val,key,i) in props.row.dnsNames">
              <q-badge align="middle">{{val}}</q-badge>
            </div>
          </q-td>
          <q-td key="timeBeginAt" :props="props">
            {{ props.row.timeBeginAt }}
          </q-td>
          <q-td key="timeEndAt" :props="props">
            {{ props.row.timeEndAt }}
          </q-td>
          <q-td key="nums" :props="props">
            {{ props.row.nums }}
          </q-td>
          <q-td key="edit" :props="props">
            <div class="q-gutter-sm">
              <q-btn
                round
                color="grey-4"
                text-color="grey-7"
                icon="add_link"
                size="10px"
                @click="shuttleBoxGetData(props.row.id,props.row.name,props.row.timeEndAt)"
              >
                <q-tooltip
                  transition-show="scale"
                  transition-hide="scale"
                >
                  绑定域名
                </q-tooltip>
              </q-btn>
              <q-btn
                round
                color="grey-4"
                text-color="grey-7"
                icon="delete"
                size="10px"
                @click="deleteSSLCert1(props.row.id,props.row.edit)"
              >
                <q-tooltip
                  transition-show="scale"
                  transition-hide="scale"
                >
                  删除证书
                </q-tooltip>
              </q-btn>
            </div>

          </q-td>
        </q-tr>
      </template>

      <template v-slot:top>
        <q-toolbar-title>
          证书管理
          <div class="q-gutter-sm">
            <q-btn color="primary" label="+ 添加证书" @click="prompt = true" />
            <q-dialog v-model="prompt" persistent>
              <q-card style="min-width: 40%">
                <q-card-section>
                  <div class="text-h6">添加证书</div>
                </q-card-section>
                <q-card-section>
                  <div class="row">
                    <div class="col-3"><div class="text-h6">*证书说明</div></div>
                    <div class="col-8">
                      <q-input dense autofocus hint="可以简单说明证书的用途。" v-model="certName"/>
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-3"><div class="text-h6">*证书类型</div></div>
                    <div class="col-8">
                      <q-select
                        filled
                        v-model="isCA"
                        :options="['加密证书','CA证书']"
                        style="width: 62%"
                        emit-value
                        map-options
                        dense
                      />
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-3"><div class="text-h6">*选择证书文件</div></div>
                    <div class="col-8">
                      <q-uploader
                        :factory="factoryFn"
                        :auto-upload="true"
                        :auto-hide-upload-btn="true"
                        style="width: 62%"
                        :filter="files => files.filter(file => file.type === 'application/x-x509-ca-cert')"
                      />
                    </div>
                  </div>
                  <div class="row" v-if="isCA==='加密证书'">
                    <div class="col-3"><div class="text-h6">*选择私钥文件</div></div>
                    <div class="col-8">
                      <q-uploader
                        :factory="factoryFn"
                        :auto-upload="true"
                        :auto-hide-upload-btn="true"
                        style="width: 62%"
                      />
                    </div>
                  </div>
                </q-card-section>
                <q-card-actions align="right" class="text-primary">
                  <q-btn flat label="取消" v-close-popup @click="// 清空
              certData_d = ''
              keyData_d = ''
              certData = ''
              keyData = ''
              certName = ''"/>
                  <q-btn flat label="确定添加" @click="updateCert()"/>
                </q-card-actions>
              </q-card>
            </q-dialog>
            <q-dialog v-model="bind" persistent>
              <q-card style="min-width: 40%;height:70%">
                <q-card-section>
                  <shuttleFrame :data="shuttleFrameData" :label="shuttleFrameTitle" @getMobileItems="getMobileItems" @preservation="preservation" @cancel="shuttleBoxCancel"></shuttleFrame>
                </q-card-section>
              </q-card>
            </q-dialog>
          </div>

        </q-toolbar-title>
        <q-input borderless dense debounce="600" v-model="filter" placeholder="Search">
          <q-icon slot="append" name="search" />
        </q-input>
      </template>
      <!--      <template v-slot:top-right>-->
      <!--        <q-input borderless dense debounce="300" v-model="filter" placeholder="Search">-->
      <!--          <q-icon slot="append" name="search" />-->
      <!--        </q-input>-->
      <!--      </template>-->
      <template v-slot:no-data="{ icon, message, filter }">
        <div class="full-width row flex-center text-accent q-gutter-sm">
          <q-icon size="2em" name="sentiment_dissatisfied" />
          <span>
            oh~... {{ message }}
          </span>
          <q-icon size="2em" :name="filter ? 'filter_b_and_w' : icon" />
        </div>
      </template>

    </q-table>

  </div>
</template>

<script>

import swal from 'sweetalert'
import { Base64 } from 'js-base64'
import { createSSLCert, deleteSSLCert, listSSLCerts } from '@/api/SSLCertService'
import moment from 'moment'
import ShuttleFrame from '@/components/ShuttleFrame/shuttleFrame'
import { findAllUserServers } from '@/api/ServerService'
import { Loading } from 'quasar'
import { updateOriginSSL } from '@/api/OriginService'

export default {
  name: 'cert',
  components: { ShuttleFrame },
  data () {
    return {
      rows: [],
      prompt: false,
      bind: false,
      isCA: '加密证书',
      certData: '',
      certData_d: '',
      keyData: '',
      keyData_d: '',
      certName: '',
      shuttleFrameData: [],
      shuttleFrameDataV2: [],
      shuttleFrameTitle: '',
      pagination: {
        sortBy: 'desc',
        descending: false,
        page: 1, // 当前页码
        rowsPerPage: 10, // 当前页显示数量
        rowsNumber: 10 // 总行数
      },
      columns: [
        {
          name: 'id',
          required: true,
          label: 'id',
          align: 'left',
          field: 'id',
          style: 'width: 100px',
          sortable: true
        },
        { name: 'name', align: 'left', label: '备注名', field: 'name', sortable: true },
        { name: 'commonNames1', align: 'left', label: '发行组织', field: 'commonNames1', sortable: true },
        { name: 'commonNames0', align: 'left', label: '证书类型', field: 'commonNames0', sortable: true },
        { name: 'dnsNames', align: 'left', label: '域名', field: 'dnsNames', sortable: true },
        { name: 'timeBeginAt', align: 'left', label: '生效日期', field: 'timeBeginAt', sortable: true },
        { name: 'timeEndAt', align: 'left', label: '过期日期', field: 'timeEndAt', sortable: true },
        { name: 'nums', align: 'left', label: '绑定域名数', field: 'nums', sortable: true },
        { name: 'edit', align: 'center', label: '操作', field: 'edit', sortable: true }
      ],
      filter: '',
      loading: false
    }
  },
  mounted () {
    this.getCertificateData(this.pagination.page * this.pagination.rowsPerPage - this.pagination.rowsPerPage, this.pagination.page * this.pagination.rowsPerPage)
  },
  methods: {
    factoryFn (files) {
      const file = files[0]
      const reader = new FileReader()
      const promise = new Promise((resolve, reject) => {
        reader.onload = function () {
          resolve(reader.result)
        }
        reader.onerror = function (e) {
          reader.abort()
          reject(e)
        }
      })
      reader.readAsText(file, 'UTF-8') // 将文件读取为文本
      if (file.type === 'application/x-x509-ca-cert') {
        this.certData = promise
      } else {
        this.keyData = promise
      }

      return promise
    },
    updateCert () {
      this.certData.then((e) => {
        this.certData_d = e
        // base64编码
        this.certData_d = Base64.encode(this.certData_d)
        if (this.isCA === '加密证书') {
          this.keyData.then((e) => {
            this.keyData_d = e
            // base64编码
            this.keyData_d = Base64.encode(this.keyData_d)
            createSSLCert(this.certName, false, this.certData_d, this.keyData_d).then((e) => {
              if (e.data.code === 200) {
                swal('创建成功', {
                  icon: 'success'
                })
                this.$q.notify({
                  icon: 'insert_emoticon',
                  message: e.data.message,
                  color: 'green',
                  position: 'top',
                  timeout: 1500
                })
                this.getCertificateData()
                this.prompt = false
                // 清空
                this.certData_d = ''
                this.keyData_d = ''
                this.certData = ''
                this.keyData = ''
                this.certName = ''
              } else {
                swal(e.data.message, {
                  icon: 'error'
                })
                this.$q.notify({
                  icon: 'warning',
                  message: e.data.message,
                  color: 'warning',
                  position: 'top',
                  timeout: 1500
                })
              }
            }).catch((e) => {
              console.log(e)
            })
          })
        } else {
          // base64编码
          this.keyData_d = Base64.encode(null)
          createSSLCert(this.certName, true, this.certData_d, this.keyData_d).then((e) => {
            if (e.data.code === 200) {
              swal('创建成功', {
                icon: 'success'
              })
              this.$q.notify({
                icon: 'insert_emoticon',
                message: '创建成功',
                color: 'green',
                position: 'top',
                timeout: 1500
              })
              this.getCertificateData()
              this.prompt = false
              // 清空
              this.certData_d = ''
              this.keyData_d = ''
              this.certData = ''
              this.keyData = ''
              this.certName = ''
            } else {
              swal(e.data.message, {
                icon: 'error'
              })
              this.$q.notify({
                icon: 'warning',
                message: e.data.message,
                color: 'warning',
                position: 'top',
                timeout: 1500
              })
            }
          }).catch((e) => {
            console.log(e)
          })
        }
      })
    },
    getCertificateData (offset = 0, size = 10, keyword = null) {
      this.loading = true
      listSSLCerts(offset, size, keyword).then((e) => {
        if (e.data.code === 200) {
          // rows
          const certSSLlist = JSON.parse(Base64.decode(e.data.data.data))
          const len = certSSLlist.length
          this.rows = []
          for (let i = 0; i < len; i++) {
            this.rows.push({
              id: certSSLlist[i].id,
              name: certSSLlist[i].name,
              commonNames1: certSSLlist[i].commonNames[1],
              commonNames0: certSSLlist[i].commonNames[0],
              dnsNames: certSSLlist[i].dnsNames,
              timeBeginAt: moment(parseInt(certSSLlist[i].timeBeginAt * 1000)).format('YYYY/MM/DD hh:mm:ss'),
              timeEndAt: moment(parseInt(certSSLlist[i].timeEndAt * 1000)).format('YYYY/MM/DD hh:mm:ss'),
              nums: certSSLlist[i].count,
              edit: certSSLlist[i].name
            })
          }
          this.pagination.rowsNumber = e.data.data.count
        } else {
          this.$q.notify({
            icon: 'warning',
            message: e.data.message,
            color: 'warning',
            position: 'top',
            timeout: 1500
          })
        }
        this.loading = false
      }).catch((e) => {
        console.log(e)
        this.loading = false
      })
    },
    onRequest (props) {
      const { page, rowsPerPage, sortBy, descending } = props.pagination
      this.pagination.rowsPerPage = rowsPerPage
      this.pagination.page = page
      this.getCertificateData(this.pagination.page * this.pagination.rowsPerPage - this.pagination.rowsPerPage, this.pagination.page * this.pagination.rowsPerPage, props.filter)
    },
    deleteSSLCert1 (sslCertId, name) {
      swal({
        title: '确定要删除证书？',
        text: '确定要删除证书 ' + name,
        icon: 'warning',
        buttons: ['取消', '确定'],
        dangerMode: true
      }).then((willDelete) => {
        if (willDelete) {
          deleteSSLCert(sslCertId).then((e) => {
            if (e.data.code === 200) {
              swal('删除成功', {
                icon: 'success'
              })
              this.$q.notify({
                icon: 'insert_emoticon',
                message: '删除成功',
                color: 'green',
                position: 'top',
                timeout: 1500
              })
              this.getCertificateData()
            } else {
              swal(e.data.message, {
                icon: 'error'
              })
              this.$q.notify({
                icon: 'insert_emoticon',
                message: e.data.message,
                color: 'green',
                position: 'top',
                timeout: 1500
              })
            }
          }).catch((e) => {
            console.log(e)
          })
        }
      })
    },
    getMobileItems (event) {
      // 穿梭框获取数据选择后
      this.shuttleFrameDataV2 = event
    },
    preservation () {
      // 穿梭框应用证书
      const len = this.shuttleFrameDataV2.length
      if (len === 0) {
        swal('未选择域名', {
          icon: 'warning'
        })
      }
      for (let i = 0; i < len; i++) {
        Loading.show()
        updateOriginSSL(this.shuttleFrameDataV2[i].value, this.certId).then((e) => {
          if (e.data.code === 200) {
            this.$q.notify({
              icon: 'insert_emoticon',
              message: this.shuttleFrameDataV2[i].title + ' 成功绑定',
              color: 'green',
              position: 'top',
              timeout: 1500
            })
          } else {
            this.$q.notify({
              icon: 'warning',
              message: this.shuttleFrameDataV2[i].title + ' 绑定失败',
              color: 'warning',
              position: 'top',
              timeout: 1500
            })
          }
          Loading.hide()
        }).catch((e) => {
          Loading.hide()
          console.log(e)
        })
      }
    },
    shuttleBoxGetData (id, name, Etime) {
      // 穿梭框获取数据选择前
      this.shuttleFrameData = []
      this.shuttleFrameTitle = '选择要绑定 ' + name + '(' + Etime + ') 的域名'
      // 获取当前用户所有的域名
      Loading.show()
      findAllUserServers().then((e) => {
        if (e.data.code === 200) {
          this.certId = id
          const len = e.data.data.length
          for (let i = 0; i < len; i++) {
            this.shuttleFrameData.push({
              title: e.data.data[i].name,
              desc: e.data.data[i].firstServerName,
              value: e.data.data[i].id
            })
          }
          this.bind = true
        } else {
          this.$q.notify({
            icon: 'warning',
            message: e.data.message,
            color: 'warning',
            position: 'top',
            timeout: 1500
          })
        }
        Loading.hide()
      }).catch((e) => {
        Loading.hide()
        console.log(e)
      })
    },
    shuttleBoxCancel () {
      this.bind = false
    }
  }
}
</script>
