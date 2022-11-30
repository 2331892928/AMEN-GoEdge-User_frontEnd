<template>
  <div class="q-pa-md">
    <q-table
      :data="rows"
      :columns="columns"
      :filter="filter"
      :loading="loading"
      title="域名管理"
      no-data-label="你还没有域名,去添加吧"
      no-results-label="没有这个域名"
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
          <q-td key="domain" :props="props">
            {{ props.row.domain }}
          </q-td>
          <q-td key="name" :props="props">
            {{ props.row.name }}
          </q-td>
          <q-td key="status" :props="props">
            <q-badge color="green" v-if="props.row.status">
              正常
            </q-badge>
            <q-badge color="red" v-else>
              已停用
            </q-badge>
          </q-td>
          <q-td key="operation" :props="props">
            <div class="q-gutter-sm">
              <q-btn
                round
                color="grey-4"
                text-color="grey-7"
                icon="settings"
                size="10px"
                @click="settingDomain(props.row.id)"
              >
                <q-tooltip
                  transition-show="scale"
                  transition-hide="scale"
                >
                  修改配置
                </q-tooltip>
              </q-btn>
              <q-btn
                round
                color="grey-4"
                text-color="grey-7"
                :icon="props.row.status === true ? 'do_disturb_alt' : 'lock_open'"
                size="10px"
                @click="updateDomainNameStatus(props.row.id,props.row.domain,!props.row.status)"
              >
                <q-tooltip
                  transition-show="scale"
                  transition-hide="scale"
                >
                  {{ props.row.status === true ? '停用域名' : '启用域名' }}
                </q-tooltip>
              </q-btn>
              <q-btn
                round
                color="grey-4"
                text-color="grey-7"
                icon="delete"
                size="10px"
                :disable="props.row.status"
                @click="removeDomainName(props.row.id,props.row.domain)"
              >
                <q-tooltip
                  transition-show="scale"
                  transition-hide="scale"
                >
                  删除域名
                </q-tooltip>
              </q-btn>
            </div>

          </q-td>
        </q-tr>
      </template>

      <template v-slot:top>
        <q-toolbar-title>
          域名管理
          <div class="q-gutter-sm">
            <q-btn color="primary" label="+ 添加域名" @click="prompt = true" />
            <q-dialog v-model="prompt" persistent>
              <q-card style="min-width: 40%">
                <q-card-section>
                  <div class="text-h6">添加域名</div>
                  <p>其余设置添加完后可管理</p>
                </q-card-section>

                <q-card-section class="q-pt-none">
                  <q-input v-model="address" autofocus label="加速域名" hint="输入加速域名，要求必须是通过 ICP 备案的域名，暂不支持泛域名。"/>
<!--                   @keyup.enter="prompt = false" -->
                </q-card-section>
                <q-card-section class="q-pt-none">
                  <q-input v-model="address_name" autofocus label="网站名称" hint="输入网站名称。"/>
                  <!--                   @keyup.enter="prompt = false" -->
                </q-card-section>
<!--                <q-card-section class="q-pt-none">-->
<!--                  <q-input v-model="address_hy" autofocus label="源站域名/ip" hint="只支持一个域名。可以配置端口，必须带端口，80端口也得带，如 www.example.com:8080，1.1.1.1:9090 "/>-->
<!--                  &lt;!&ndash;                   @keyup.enter="prompt = false" &ndash;&gt;-->
<!--                </q-card-section>-->

                <q-card-actions align="right" class="text-primary">
                  <q-btn flat label="取消" v-close-popup @click="address='';address_hy=''"/>
                  <q-btn flat label="确定添加" @click="addDomain" />
                </q-card-actions>
              </q-card>
            </q-dialog>
          </div>

        </q-toolbar-title>
        <q-input borderless dense debounce="20" v-model="filter" placeholder="Search">
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
import { createServer, deleteServer, findAllUserServers, updateServerIsOn } from '@/api/ServerService'
import swal from 'sweetalert'
import { SessionStorage } from 'quasar'

export default {
  name: 'domainNameList',
  data () {
    return {
      columns: [
        {
          name: 'id',
          required: true,
          label: 'id',
          align: 'left',
          field: 'id',
          style: 'width: 150px',
          sortable: true
        },
        { name: 'domain', align: 'left', label: '域名', field: 'domain', sortable: true },
        { name: 'name', align: 'left', label: '网站名称', field: 'name', sortable: true },
        { name: 'status', align: 'center', label: '状态', field: 'status' },
        { name: 'operation', align: 'center', label: '操作', field: 'operation', style: 'width: 200px' }
      ],
      rows: [],
      filter: '',
      loading: false,
      prompt: false,
      address: '',
      address_hy: '',
      address_name: ''
    }
  },
  mounted () {
    this.getDomainList()
  },
  methods: {
    addDomain () {
      // 匹配domain是否是域名
      if (!(/^(([-\u4E00-\u9FA5a-z0-9]{1,63})\.)+([\u4E00-\u9FA5a-z]{2,63})\.?$/.test(this.address))) {
        this.$q.notify({
          icon: 'warning',
          message: '域名不合法，不是有效的域名',
          color: 'warning',
          position: 'top',
          timeout: 1500
        })
        return
      }
      // 源暂时没做，添加完编辑里才有
      // 匹配源检测是否是ip+端
      //   if(!(/^((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.){3}(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])(?::(?:[0-9]|[1-9][0-9]{1,3}|[1-5][0-9]{4}|6[0-4][0-9]{3}|65[0-4][0-9]{2}|655[0-2][0-9]|6553[0-5]))?$/.test(this.address_hy))){
      //     // ip+端口匹配失败，检测是否是域名+端口
      //     if(!(/[\w-]+(\.[\w-]+)+:\d{1,5}\/?$/.test(this.address_hy))){
      //       this.$q.notify({
      //         icon: 'warning',
      //         message: '回源域名/ip地址不合法，不是有效的回源域名/ip地址，必须 回源域名/ip地址:端口 格式',
      //         color: 'warning',
      //         position: 'top',
      //         timeout: 1500
      //       })
      //       return
      //     }
      //   }
      createServer(this.address, this.address_name).then((e) => {
        if (e.data.code === 200) {
          const lt = setTimeout(() => {
            // this.$router.go(0)
            this.getDomainList()
            this.$q.notify({
              icon: 'insert_emoticon',
              message: '添加成功',
              color: 'green',
              position: 'top',
              timeout: 1500
            })
            clearTimeout(lt)
            this.prompt = false
          }, Math.random() * 3000)
        } else {
          this.$q.notify({
            icon: 'warning',
            message: e.data.message,
            color: 'warning',
            position: 'top',
            timeout: 5000
          })
        }
      })
    },
    getDomainList () {
      this.loading = !this.loading
      findAllUserServers().then((e) => {
        if (e.data.code === 200) {
          const len = e.data.data.length
          this.rows = []
          for (let i = 0; i < len; i++) {
            this.rows.push({
              id: e.data.data[i].id,
              domain: e.data.data[i].firstServerName,
              name: e.data.data[i].name,
              status: e.data.data[i].isOn,
              operation: '编辑'
            })
          }
          this.loading = !this.loading
        }
      })
    },
    updateDomainNameStatus (serverId, domain, isOn) {
      swal({
        title: '确定' + (isOn === true ? '启用' : '停用') + '域名?',
        text: '确定要' + (isOn === true ? '启用' : '停用') + ' ' + domain + ' 这个域名？',
        icon: 'warning',
        buttons: ['取消', '确定'],
        dangerMode: true
      })
        .then((willDelete) => {
          if (willDelete) {
            updateServerIsOn(serverId, isOn).then((e) => {
              if (e.data.code === 200) {
                this.$q.notify({
                  icon: 'insert_emoticon',
                  message: '更新成功',
                  color: 'green',
                  position: 'top',
                  timeout: 1500
                })
                swal('更新成功!', {
                  icon: 'success'
                })
                this.getDomainList()
              } else {
                this.$q.notify({
                  icon: 'warning',
                  message: e.data.message,
                  color: 'warning',
                  position: 'top',
                  timeout: 5000
                })
              }
            }).catch((e) => {
              this.$q.notify({
                icon: 'warning',
                message: e.data.message,
                color: 'warning',
                position: 'top',
                timeout: 5000
              })
            })
          }
        })
    },
    removeDomainName (serverId, domain) {
      swal({
        title: '确定删除域名?',
        text: '确定要删除 ' + domain + ' 这个域名？',
        icon: 'warning',
        buttons: ['取消', '确定'],
        dangerMode: true
      })
        .then((willDelete) => {
          if (willDelete) {
            deleteServer(serverId).then((e) => {
              if (e.data.code === 200) {
                swal('删除成功!', {
                  icon: 'success'
                })
                this.$q.notify({
                  icon: 'insert_emoticon',
                  message: '删除成功',
                  color: 'green',
                  position: 'top',
                  timeout: 1500
                })
                this.getDomainList()
              } else {
                this.$q.notify({
                  icon: 'warning',
                  message: e.data.message,
                  color: 'warning',
                  position: 'top',
                  timeout: 1500
                })
              }
            }).then((e) => {
              this.$q.notify({
                icon: 'warning',
                message: e.data.message,
                color: 'warning',
                position: 'top',
                timeout: 1500
              })
            })
          }
        })
    },
    settingDomain (serverId) {
      // this.$router.push({ path: '/domainName/domain', params: { id: serverId } })
      this.$router.push({ path: '/domainName/domain?id=' + serverId })
    }
  }
}
</script>
