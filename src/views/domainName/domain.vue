<template>
  <div class="q-pa-md" style="height:100%">
    <div class="q-gutter-y-md" style="max-width: 100%;height:100%">
      <q-card style="height:100%">
        <q-tabs
          v-model="tab"
          dense
          class="text-grey"
          active-color="primary"
          indicator-color="primary"
          align="justify"
          narrow-indicator
        >
          <q-tab name="mails" label="基本配置" />
          <q-tab name="alarms" label="回源配置" />
          <q-tab name="movies" label="HTTP/S配置" />
          <q-tab name="test" label="测试" />
        </q-tabs>

        <q-separator />

        <q-tab-panels v-model="tab" animated style="height: 90%">
          <q-tab-panel name="mails">
<!--           一级-->
              <q-markup-table
                separator="none"
                :flat="true"
              >
                <thead>
                <tr style="height: 0">
                  <th class="text-left" style="width: 10px;"></th>
                  <th class="text-right" style="width: 100%"></th>
                </tr>
                </thead>
                <tbody>
                <tr>
                  <td class="text-left">网站名称</td>
                  <td class="text-left">
                    <q-input v-model="doMainInfo.basic.name"></q-input>
                  </td>
                </tr>
                <tr>
                  <td class="text-left">域名</td>
                  <td class="text-left">{{this.doMainInfo.basic.domain}}</td>
                </tr>
                <tr>
                  <td class="text-left">CNAME</td>
                  <td class="text-left">{{this.doMainInfo.basic.cname}}</td>
                </tr>
                <tr>
                  <td class="text-left">业务场景</td>
                  <td class="text-left">{{this.doMainInfo.basic.type}}</td>
                </tr>
<!--                <tr>-->
<!--                  <td class="text-left">服务地域</td>-->
<!--                  <td class="text-left">{{this.doMainInfo.basic.fwdy}}</td>-->
<!--                </tr>-->
                <tr>
                  <td class="text-left">IPv6 访问</td>
                  <td class="text-left">默认已开启(如cdn节点不支持ipv6则不支持,具体咨询客服)</td>
                </tr>
                </tbody>
              </q-markup-table>
            <q-separator />
<!--二级-->
          </q-tab-panel>
<!--          第二个菜单-->
          <q-tab-panel name="alarms">
            <q-list bordered>
              <q-expansion-item
                group="somegroup"
                icon="explore"
                label="其他设置"
                header-class="text-primary"
              >
                <q-card>
                  <q-form @submit="updateServerReverseProxy" class="q-gutter-md">
                    <q-card-section>
                      <div class="text-h6">是否启用源站</div>
                      <q-toggle
                        name="reverseProxy_isOn"
                        :label="doMainInfo.reverseProxy.isOn === true ? '启用' : '关闭'"
                        v-model="doMainInfo.reverseProxy.isOn"
                      />
                      <div>
                        <q-btn label="保存" type="submit" color="primary"/>
                      </div>
                    </q-card-section>
                  </q-form>
                </q-card>
              </q-expansion-item>
            </q-list>
<!--            用响应式表格-->
            <template>
              <div class="q-pa-md">
                <q-table
                  title="主要源站"
                  no-data-label="你还没有主源站,去添加吧"
                  no-results-label="没有这个主源站"
                  loading-label="稍等哦，正在加载中"
                  rows-per-page-label="每页显示数量："
                  :loading="loading_master_proxy"
                  :data="doMainInfo.reverseProxy.data"
                  :columns="doMainInfo.reverseProxy.columns"
                  row-key="name"
                >
                  <template v-slot:body="props">
                    <q-tr :props="props">
                      <q-td key="id" :props="props">
                        {{ props.row.id }}
                      </q-td>
                      <q-td key="isOn" :props="props">
                        <q-badge color="green" v-if="props.row.isOn">
                          正常
                        </q-badge>
                        <q-badge color="red" v-else>
                          已停用
                        </q-badge>
                      </q-td>
                      <q-td key="protocol" :props="props">
                        <div><q-badge align="middle">{{ props.row.protocol[0] }}</q-badge></div>
                        <div><q-badge align="middle" v-if="props.row.protocol[1]">有证书</q-badge></div>
                      </q-td>
                      <q-td key="host" :props="props">
                        {{ props.row.host }}
                      </q-td>
                      <q-td key="portRange" :props="props">
                        {{ props.row.portRange }}
                      </q-td>
                      <q-td key="weight" :props="props">
                        {{ props.row.weight }}
                      </q-td>
                      <q-td key="edit" :props="props">
                        <div class="q-gutter-sm">
                          <q-btn
                            round
                            color="grey-4"
                            text-color="grey-7"
                            icon="settings"
                            size="10px"
                            @click="modifyOrigin(props.row.id)"
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
                            :icon="props.row.isOn === true ? 'do_disturb_alt' : 'lock_open'"
                            size="10px"
                            @click="enableOrigin(props.row.id,props.row.host+':'+props.row.portRange)"
                          >
                            <q-tooltip
                              transition-show="scale"
                              transition-hide="scale"
                            >
                              {{ props.row.isOn === true ? '停用源站' : '启用源站' }}
                            </q-tooltip>
                          </q-btn>
                          <q-btn
                            round
                            color="grey-4"
                            text-color="grey-7"
                            icon="delete"
                            size="10px"
                            :disable="props.row.isOn"
                            @click="isMaster=true;deleteOrigin1(props.row.id,props.row.host)"
                          >
                            <q-tooltip
                              transition-show="scale"
                              transition-hide="scale"
                            >
                              删除源站
                            </q-tooltip>
                          </q-btn>
                        </div>
                      </q-td>
                    </q-tr>
                  </template>
                  <template v-slot:top>
                    <q-toolbar-title>
                      主要源站
                      <div class="q-gutter-sm">
                        <q-btn color="primary" label="+ 添加域名" @click="isMaster=true;modifyOrigin_add();prompt = true" />
                      </div>

                    </q-toolbar-title>
                    <q-input borderless dense debounce="20" v-model="master_filter" placeholder="Search">
                      <q-icon slot="append" name="search" />
                    </q-input>
                  </template>
                </q-table>
              </div>
            </template>
            <template>
              <div class="q-pa-md">
                <q-table
                  title="备用源站"
                  no-data-label="你还没有备用源站,去添加吧"
                  no-results-label="没有这个备用源站"
                  loading-label="稍等哦，正在加载中"
                  rows-per-page-label="每页显示数量："
                  :loading="loading_slave1_proxy"
                  :data="doMainInfo.reverseProxy.alternateData"
                  :columns="doMainInfo.reverseProxy.columns"
                  row-key="name"
                >
                  <template v-slot:body="props">
                    <q-tr :props="props">
                      <q-td key="id" :props="props">
                        {{ props.row.id }}
                      </q-td>
                      <q-td key="isOn" :props="props">
                        <q-badge color="green" v-if="props.row.isOn">
                          正常
                        </q-badge>
                        <q-badge color="red" v-else>
                          已停用
                        </q-badge>
                      </q-td>
                      <q-td key="protocol" :props="props">
                        <div><q-badge align="middle">{{ props.row.protocol[0] }}</q-badge></div>
                        <div><q-badge align="middle" v-if="props.row.protocol[1]">有证书</q-badge></div>
                      </q-td>
                      <q-td key="host" :props="props">
                        {{ props.row.host }}
                      </q-td>
                      <q-td key="portRange" :props="props">
                        {{ props.row.portRange }}
                      </q-td>
                      <q-td key="weight" :props="props">
                        {{ props.row.weight }}
                      </q-td>
                      <q-td key="edit" :props="props">
                        <div class="q-gutter-sm">
                          <q-btn
                            round
                            color="grey-4"
                            text-color="grey-7"
                            icon="settings"
                            size="10px"
                            @click="modifyOrigin(props.row.id)"
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
                            :icon="props.row.isOn === true ? 'do_disturb_alt' : 'lock_open'"
                            size="10px"
                            @click="enableOrigin(props.row.id,props.row.host+':'+props.row.portRange)"
                          >
                            <q-tooltip
                              transition-show="scale"
                              transition-hide="scale"
                            >
                              {{ props.row.isOn === true ? '停用源站' : '启用源站' }}
                            </q-tooltip>
                          </q-btn>
                          <q-btn
                            round
                            color="grey-4"
                            text-color="grey-7"
                            icon="delete"
                            size="10px"
                            :disable="props.row.isOn"
                            @click="deleteOrigin1(props.row.id,props.row.host)"
                          >
                            <q-tooltip
                              transition-show="scale"
                              transition-hide="scale"
                            >
                              删除源站
                            </q-tooltip>
                          </q-btn>
                        </div>
                      </q-td>
                    </q-tr>
                  </template>
                  <template v-slot:top>
                    <q-toolbar-title>
                      备用源站
                      <div class="q-gutter-sm">
                        <q-btn color="primary" label="+ 添加域名" @click="isMaster=false;modifyOrigin_add();prompt = true" />
                      </div>

                    </q-toolbar-title>
                    <q-input borderless dense debounce="20" v-model="master_filter" placeholder="Search">
                      <q-icon slot="append" name="search" />
                    </q-input>
                  </template>
                </q-table>
              </div>
            </template>
            <q-dialog v-model="prompt" persistent>
              <q-card style="min-width: 40%">
                <q-card-section>
                  <div class="text-h6">{{ isAdd===true ? '新增源站' : '修改源站' }}</div>
                </q-card-section>
                <q-card-section class="q-pt-none">
                  <div class="row">
                    <div class="col-3">
                      <div class="text-h6">*取源协议</div>
                    </div>
                    <div class="col-8">
                      <q-select
                        filled
                        v-model="doMainInfo.reverseProxy.editData.addr.protocol"
                        :options="['http','https']"
                        style="width: 60%"
                        emit-value
                        map-options
                        dense
                      />
                      <div>源站使用的协议</div>
                    </div>
                  </div>
                  <div class="row" v-if="doMainInfo.reverseProxy.editData.addr.protocol==='https'">
                    <div class="col-3">
                      <div class="text-h6">https证书</div>
                    </div>
                    <div class="col-8">
                      <q-select
                        filled
                        v-model="doMainInfo.HTTPS.SSL_origin"
                        :options="doMainInfo.HTTPS.SSLoptions"
                        style="width: 60%"
                        emit-value
                        map-options
                        dense
                      />
                      <div>可以选择连接源站使用的证书。添加证书请到证书管理</div>
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-3">
                      <div class="text-h6">*源站地址</div>
                    </div>
                    <div class="col-8">
                      <q-input dense v-model="doMainInfo.reverseProxy.editData.addr.host" autofocus hint="源站服务器地址，通常是一个IP（或域名），不需要加 http:// 或 https://。"/>
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-3">
                      <div class="text-h6">*源站端口</div>
                    </div>
                    <div class="col-8">
                      <q-input type="number" :rules="[ val => (val > 0 && val <= 65535) || '端口必须为1-65535']" dense v-model="doMainInfo.reverseProxy.editData.addr.portRange" autofocus hint="源站端口，通常是1-65535"/>
                    </div>
                  </div>
                  <q-list bordered class="rounded-borders">
                    <q-expansion-item
                      dense
                      expand-separator
                      group="somegroup"
                      label="更多选项"
                    >
                      <q-card>
                        <q-card-section>
                          <div class="row">
                            <div class="col-3">
                              <div class="text-h6">回源主机名</div>
                            </div>
                            <div class="col-8">
                              <q-input dense v-model="doMainInfo.reverseProxy.editData.requestHost" autofocus hint="请求源站时的Host，用于修改源站接收到的域名，自定义Host内容中支持请求变量。默认请求地址"/>
                            </div>
                          </div>
                          <div class="row">
                            <div class="col-3">
                              <div class="text-h6">权重</div>
                            </div>
                            <div class="col-8">
                              <q-input type="number" :rules="[ val => val >= 0 || '权重必须>=0']" dense v-model="doMainInfo.reverseProxy.editData.weight" autofocus hint="数字越大，代表分配的请求比例越多。"/>
                            </div>
                          </div>
                          <div class="row">
                            <div class="col-3">
                              <div class="text-h6">连接失败超时时间</div>
                            </div>
                            <div class="col-8">
                              <q-input type="number" :rules="[ val => val >= 0 || '连接失败超时时间必须>=0']" suffix="秒" dense v-model="doMainInfo.reverseProxy.editData.connTimeout.count" autofocus hint="连接源站失败的最大超时时间，0表示不限制。"/>
                            </div>
                          </div>
                          <div class="row">
                            <div class="col-3">
                              <div class="text-h6">读取超时时间</div>
                            </div>
                            <div class="col-8">
                              <q-input type="number" :rules="[ val => val >= 0 || '读取超时时间必须>=0']" suffix="秒" dense v-model="doMainInfo.reverseProxy.editData.readTimeout.count" autofocus hint="读取内容时的最大超时时间，0表示不限制。"/>
                            </div>
                          </div>
                        </q-card-section>
                      </q-card>
                    </q-expansion-item>
                  </q-list>
                </q-card-section>
                <q-card-actions align="right" class="text-primary">
                  <q-btn flat label="取消" v-close-popup />
                  <q-btn flat label="保存" @click="isAdd===true  ? createOrigin() : updateOrigin()" />
                </q-card-actions>
              </q-card>
            </q-dialog>
          </q-tab-panel>
<!--第三个菜单-->
          <q-tab-panel name="movies">

            <div class="row">
              <div class="col-2">
                <div>HTTPS证书</div>
              </div>
              <div class="col-8">
                <q-select
                  filled
                  v-model="doMainInfo.HTTPS.SSL"
                  :options="doMainInfo.HTTPS.SSLoptions"
                  style="width: 60%"
                  @input="updateSSLPolicy()"
                  emit-value
                  map-options
                  dense
                />
              </div>
            </div>
            <div class="row">
              <div class="col-2">
                <div>强制HTTPS</div>
              </div>
              <div class="col-8">
                <q-toggle
                  v-model="doMainInfo.HTTPS.isHTTPS"
                  label="强制跳转HTTPS"
                  @input="updateHTTPWebRedirectToHTTPS()"
                />
                <div class="row">
                  <div class="col-1">
                    <div>跳转方式</div>
                  </div>
                  <div class="col-8">
                    <q-option-group
                      v-model="doMainInfo.HTTPS.HTTPSgroup"
                      :options="doMainInfo.HTTPS.HTTPSoptions"
                      @input="updateHTTPWebRedirectToHTTPS()"
                      color="primary"
                      inline
                      dense
                    />
                  </div>
                </div>
                <div>开启后，即使用户发起 HTTP 请求，也会强制跳转为 HTTPS 请求进行访问。</div>
              </div>
            </div>
            <div class="row">
              <div class="col-2">
                <div>启用HTTP/2</div>
              </div>
              <div class="col-8">
                <q-toggle
                  v-model="doMainInfo.HTTPS.HTTP2"
                  label="启用HTTP/2"
                  @input="updateSSLPolicy()"
                />
                <div>是否开启 HTTP/2 。</div>
              </div>
            </div>
            <div class="row">
              <div class="col-2">
                <div>TLS版本</div>
              </div>
              <div class="col-8">
                <q-option-group
                  name="accepted_genres"
                  v-model="doMainInfo.HTTPS.TLSaccepted"
                  :options="doMainInfo.HTTPS.TLSgroup"
                  type="checkbox"
                  color="primary"
                  inline
                  :disable="true"
                />
                <div>默认支持以上版本，不可更改</div>
              </div>
            </div>
            <div class="row">
              <div class="col-2">
                <div>TLS最低版本</div>
              </div>
              <div class="col-8">
                <q-select
                  filled
                  v-model="doMainInfo.HTTPS.TLSversion"
                  :options="doMainInfo.HTTPS.TLSoptions"
                  @input="updateSSLPolicy()"
                  style="width: 60%"
                  emit-value
                  map-options
                  dense
                />
                <div>TLS最低使用的版本</div>
              </div>
            </div>
            <div class="row">
              <div class="col-2">
                <div>HSTS</div>
              </div>
              <div class="col-8">
                <q-toggle
                  v-model="doMainInfo.HTTPS.HSTS"
                  label="开启HSTS"
                  @input="updateSSLPolicy()"
                />
                <div>开启后，CDN 将会自动在响应Header中加入 Strict-Transport-Security: max-age=xxx，用于告知客户端强制使用 HTTPS。
                  当请求为 HTTP 时，浏览器不会理会此响应头，所以建议与“强制跳转 HTTPS”一同开启。</div>
                <q-list bordered>
                  <q-expansion-item
                    group="somegroup"
                    icon="explore"
                    label="修改"
                    header-class="text-primary"
                  >
                    <q-card>
                      <q-card-section>
                        <div class="row">
                          <div class="col-4">HSTS有效时间（max-age）</div>
                          <div class="col-6">
                            <q-input type="number" :rules="[ val => (val > 0) || '时间必须>0']" dense v-model="doMainInfo.HTTPS.HSTSgroup.maxtime" suffix="秒"></q-input>
                          </div>
                        </div>
                        <div class="row">
                          <div class="col-4">HSTS包含子域名</div>
                          <div class="col-6">
                            <q-toggle
                              v-model="doMainInfo.HTTPS.HSTSgroup.includeSubDomains"
                              label="HSTS包含子域名"
                            />
                          </div>
                        </div>
                        <div class="row">
                          <div class="col-4">HSTS预加载</div>
                          <div class="col-6">
                            <q-toggle
                              v-model="doMainInfo.HTTPS.HSTSgroup.preload"
                              label="HSTS预加载"
                            />
                          </div>
                        </div>
                        <div class="row">
                          <div class="col-5">
                            <q-btn @click="updateSSLPolicy()">保存</q-btn>
                          </div>
                        </div>
                      </q-card-section>
                    </q-card>
                  </q-expansion-item>
                </q-list>
              </div>
            </div>
            <div class="row">
              <div class="col-2">
                <div>OCSP装订</div>
              </div>
              <div class="col-8">
                <q-toggle
                  v-model="doMainInfo.HTTPS.OCSP"
                  label="OCSP装订"
                  @input="updateSSLPolicy()"
                />
                <div>启用 OCSP 装订后， CDN 节点在 TLS 握手时会发送事先缓存的在线证书状态协议（OCSP）响应，供用户验证，无需用户再向数字证书认证机构（CA）发送查询请求。</div>
              </div>
            </div>
            <div class="row">
              <div class="col-2">
                <div>启用HTTP</div>
              </div>
              <div class="col-8">
                <q-toggle
                  v-model="doMainInfo.HTTPS.HTTP"
                  label="启用HTTP"
                  @input="updateHttp()"
                />
                <div>关闭后无法使用http访问网址</div>
              </div>
            </div>
            <div class="row">
              <div class="col-2">
                <div>启用HTTPS</div>
              </div>
              <div class="col-8">
                <q-toggle
                  v-model="doMainInfo.HTTPS.HTTPS"
                  label="启用HTTPS"
                  @input="updateHttps()"
                />
                <div>关闭后无法使用https访问网址</div>
              </div>
            </div>
          </q-tab-panel>
<!--          四菜单-->
          <q-tab-panel name="test">
            <div class="text-h4 q-mb-md">Mails</div>
            <test></test>
          </q-tab-panel>
        </q-tab-panels>
      </q-card>
    </div>
  </div>
</template>

<script>
import swal from 'sweetalert'
import {
  findEnabledServerConfig,
  updateServerHTTP,
  updateServerHTTPS,
  updateServerReverseProxy
} from '@/api/ServerService'
import { utf16to8, utf8to16 } from '@/utils/CloneUtils'
import { Loading } from 'quasar'
import { createOrigin, deleteOrigin, findEnabledOrigin, updateOrigin } from '@/api/OriginService'
import { Base64 } from 'js-base64'
import { listSSLCerts } from '@/api/SSLCertService'
import moment from 'moment'
import { updateSSLPolicy } from '@/api/SSLPolicyService'
import { updateHTTPWebRedirectToHTTPS } from '@/api/HTTPWebService'
import test from '@/components/test/test'

export default {
  name: 'domain',
  components: {
    test
  },
  data () {
    return {
      id: 1,
      tab: 'mails',
      rightItem: [],
      isAdd: false,
      isMaster: false,
      prompt: false,
      loading_master_proxy: false,
      master_filter: '',
      slave1_filter: '',
      loading_slave1_proxy: false,
      doMainInfo: {
        basic: {
          domain: 'domain',
          name: 'name',
          cname: 'cname',
          type: 'httpProxy',
          fwdy: '暂未开启'
        },
        HTTPS: {
          isHTTPS: false,
          HTTPSoptions: [{
            label: '301',
            value: '301'
          },
          {
            label: '302',
            value: '302'
          }
          ],
          HTTPSgroup: '301',
          HTTP2: false,
          TLSgroup: [{
            label: '1.0',
            value: '1.0'
          }, {
            label: '1.1',
            value: '1.1'
          }, {
            label: '1.2',
            value: '1.2'
          }, {
            label: '1.3',
            value: '1.3'
          }, {
            label: '3.0',
            value: '3.0'
          }
          ],
          TLSaccepted: ['1.0', '1.1', '1.2', '1.3', '3.0'],
          TLSoptions: ['TLS 1.0', 'TLS 1.1', 'TLS 1.2', 'TLS 1.3', 'SSL 3.0'],
          TLSversion: 'TLS 1.1',
          HSTSgroup: {
            maxtime: 30,
            includeSubDomains: false,
            preload: false
          },
          OCSP: false,
          HSTS: false,
          HTTP: true,
          HTTPS: false,
          SSL: 0,
          SSL_origin: 0,
          SSLoptions: [{
            label: '无',
            value: 0
          }]
        },
        reverseProxy: {
          isOn: false,
          editData: {
            requestHost: '',
            weight: 10,
            certRef: null,
            connTimeout: {
              count: 30
            },
            readTimeout: {
              count: 0
            },
            addr: {
              protocol: 'http',
              host: 'host',
              portRange: '80',
              minPort: 0,
              maxPort: 0
            }
          },
          data: [],
          alternateData: [],
          sourceData: {},
          columns: [{
            name: 'id',
            required: true,
            label: 'id',
            align: 'left',
            field: 'id',
            style: 'width: 150px',
            sortable: true
          },
          { name: 'isOn', align: 'left', label: '状态', field: 'isOn', sortable: true },
          { name: 'protocol', align: 'left', label: '取源协议', field: 'protocol', sortable: true },
          { name: 'host', align: 'left', label: '源站地址', field: 'host', sortable: true },
          { name: 'portRange', align: 'left', label: '源站端口', field: 'portRange', sortable: true },
          { name: 'weight', align: 'left', label: '权重', field: 'weight', sortable: true },
          { name: 'edit', align: 'center', label: '操作', field: 'edit', sortable: true, style: 'width: 200px' }
          ]
        }
      }
    }
  },
  mounted () {
    if (this.$route.query.id === undefined) {
      this.$router.push('/domainName/domainNameList')
      swal('请从站点管理的设置进入此页面!', {
        icon: 'warning'
      })
      return
    }
    // 查找Serverid
    this.id = this.$route.query.id
    Loading.show()
    this.getOriginInformation()
  },
  methods: {
    updateServerReverseProxy () {
      this.doMainInfo.reverseProxy.sourceData.reverseProxyRef.isOn = this.doMainInfo.reverseProxy.isOn
      // const reverseProxy = utf16to8(window.btoa(JSON.stringify(this.doMainInfo.reverseProxy.sourceData)))
      const reverseProxy = window.btoa(utf16to8(JSON.stringify(this.doMainInfo.reverseProxy.sourceData.reverseProxyRef)))
      updateServerReverseProxy(this.id, reverseProxy).then((e) => {
        if (e.data.code === 200) {
          this.$q.notify({
            icon: 'insert_emoticon',
            message: '保存成功',
            color: 'green',
            position: 'top',
            timeout: 1500
          })
        } else {
          this.$q.notify({
            icon: 'warning',
            message: e.data.message,
            color: 'warning',
            position: 'top',
            timeout: 1500
          })
        }
      }).catch((e) => {
        this.$q.notify({
          icon: 'warning',
          message: e.data.message,
          color: 'warning',
          position: 'top',
          timeout: 1500
        })
      })
    },
    modifyOrigin (originId) {
      this.isAdd = false
      findEnabledOrigin(originId).then((e) => {
        // const originData = utf8to16(window.atob(utf8to16(e.data.data)))
        if (e.data.code === 200) {
          this.doMainInfo.reverseProxy.editData = JSON.parse(Base64.decode(e.data.data))
          if (this.doMainInfo.reverseProxy.editData.certRef === null) {
            this.doMainInfo.HTTPS.SSL_origin = 0
          } else {
            this.doMainInfo.HTTPS.SSL_origin = this.doMainInfo.reverseProxy.editData.certRef.certId
          }
          this.prompt = true
        } else {
          this.$q.notify({
            icon: 'warning',
            message: e.data.message,
            color: 'warning',
            position: 'top',
            timeout: 1500
          })
        }
      }).catch((e) => {
        swal('没有此源站信息!', {
          icon: 'error'
        })
        console.log(e)
      })
    },
    updateOrigin () {
      // 匹配domain是否是域名
      if (!(/^(([-\u4E00-\u9FA5a-z0-9]{1,63})\.)+([\u4E00-\u9FA5a-z]{2,63})\.?$/.test(this.doMainInfo.reverseProxy.editData.addr.host))) {
        // 匹配是否是ip
        if (!(/^(\d+)\.(\d+)\.(\d+)\.(\d+)$/g.test(this.doMainInfo.reverseProxy.editData.addr.host))) {
          this.$q.notify({
            icon: 'warning',
            message: '源站地址不合法，不是有效的源站地址，必须是ip/域名',
            color: 'warning',
            position: 'top',
            timeout: 1500
          })
          return
        }
      }
      if (this.doMainInfo.HTTPS.SSL_origin === 0) {
        this.doMainInfo.reverseProxy.editData.certRef = { isOn: true, certId: 0 }
      } else {
        this.doMainInfo.reverseProxy.editData.certRef = { isOn: true, certId: this.doMainInfo.HTTPS.SSL_origin }
      }
      var originData = this.doMainInfo.reverseProxy.editData
      originData = Base64.encode(JSON.stringify(this.doMainInfo.reverseProxy.editData))
      updateOrigin(originData).then((e) => {
        if (e.data.code === 200) {
          swal('保存成功!', {
            icon: 'success'
          })
          this.$q.notify({
            icon: 'insert_emoticon',
            message: '保存成功',
            color: 'green',
            position: 'top',
            timeout: 1500
          })
          this.getOriginInformation()
          this.prompt = false
        } else {
          swal(e.data.message, {
            icon: 'warning'
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
    },
    createOrigin () {
      var submit = {}
      submit.connTimeout = {
        count: this.doMainInfo.reverseProxy.editData.connTimeout.count
      }
      submit.readTimeout = {
        count: this.doMainInfo.reverseProxy.editData.readTimeout.count
      }
      // submit.idleTimeout = {
      //   count: this.doMainInfo.reverseProxy.editData.idleTimeout.count
      // }
      submit.addr = this.doMainInfo.reverseProxy.editData.addr
      // 匹配domain是否是域名
      if (!(/^(([-\u4E00-\u9FA5a-z0-9]{1,63})\.)+([\u4E00-\u9FA5a-z]{2,63})\.?$/.test(this.doMainInfo.reverseProxy.editData.addr.host))) {
        // 匹配是否是ip
        if (!(/^(\d+)\.(\d+)\.(\d+)\.(\d+)$/g.test(this.doMainInfo.reverseProxy.editData.addr.host))) {
          this.$q.notify({
            icon: 'warning',
            message: '源站地址不合法，不是有效的源站地址，必须是ip/域名',
            color: 'warning',
            position: 'top',
            timeout: 1500
          })
          return
        }
      }
      if (this.doMainInfo.HTTPS.SSL_origin === 0) {
        submit.certRef = { isOn: true, certId: 0 }
      } else {
        submit.certRef = { isOn: true, certId: this.doMainInfo.HTTPS.SSL_origin }
      }
      submit.weight = this.doMainInfo.reverseProxy.editData.weight
      submit.host = this.doMainInfo.reverseProxy.editData.requestHost
      // 准备源数据，源反向代理
      // 遍历源站信息
      // 如果是新增源站，遍历源站，否则相同
      if (this.isMaster) {
        const len = this.doMainInfo.reverseProxy.sourceData.reverseProxy.primaryOrigins.length
        submit.sourceData = []
        for (let i = 0; i < len; i++) {
          submit.sourceData.push({
            id: this.doMainInfo.reverseProxy.sourceData.reverseProxy.primaryOrigins[i].id,
            isOn: true
          })
        }
      } else {
        const len = this.doMainInfo.reverseProxy.sourceData.reverseProxy.backupOrigins.length
        submit.sourceData = []
        for (let i = 0; i < len; i++) {
          submit.sourceData.push({
            originId: this.doMainInfo.reverseProxy.sourceData.reverseProxy.backupOrigins[i].id,
            isOn: true
          })
        }
      }
      submit = Base64.encode(JSON.stringify(submit))
      createOrigin(submit, this.isMaster, this.doMainInfo.reverseProxy.sourceData.reverseProxyRef.reverseProxyId).then((e) => {
        if (e.data.code === 200) {
          swal('新增成功!', {
            icon: 'success'
          })
          this.$q.notify({
            icon: 'insert_emoticon',
            message: '新增成功',
            color: 'green',
            position: 'top',
            timeout: 1500
          })
          this.getOriginInformation()
          this.prompt = false
        } else {
          swal('新增失败!', {
            icon: 'warning'
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
    },
    enableOrigin (originId, domain) {
      // await this.modifyOrigin(originId, false)
      swal({
        title: '确定' + (this.doMainInfo.reverseProxy.editData.isOn === true ? '停用' : '启用') + '源站域名?',
        text: '确定要' + (this.doMainInfo.reverseProxy.editData.isOn === true ? '停用' : '启用') + ' ' + domain + ' 这个源站？',
        icon: 'warning',
        buttons: ['取消', '确定'],
        dangerMode: true
      }).then((willDelete) => {
        if (willDelete) {
          findEnabledOrigin(originId).then((e) => {
            if (e.data.code === 200) {
              this.doMainInfo.reverseProxy.editData = JSON.parse(Base64.decode(e.data.data))
              this.doMainInfo.reverseProxy.editData.isOn = !this.doMainInfo.reverseProxy.editData.isOn
              this.updateOrigin()
            } else {
              this.$q.notify({
                icon: 'warning',
                message: e.data.message,
                color: 'warning',
                position: 'top',
                timeout: 1500
              })
            }
          }).catch((e) => {
            swal('没有此源站信息!', {
              icon: 'error'
            })
            console.log(e)
          })
        }
      })
    },
    deleteOrigin1 (originId, domain) {
      // 准备源数据，源反向代理
      // 遍历源站信息
      // 如果是新增源站，遍历源站，否则相同
      swal({
        title: '确定删除这个源站?',
        text: '确定要 ' + domain + ' 这个源站？',
        icon: 'warning',
        buttons: ['取消', '确定'],
        dangerMode: true
      }).then((willDelete) => {
        if (willDelete) {
          var submit = {}
          if (this.isMaster) {
            const len = this.doMainInfo.reverseProxy.sourceData.reverseProxy.primaryOrigins.length
            submit.sourceData = []
            for (let i = 0; i < len; i++) {
              submit.sourceData.push({
                originId: this.doMainInfo.reverseProxy.sourceData.reverseProxy.primaryOrigins[i].id,
                isOn: true
              })
            }
          } else {
            const len = this.doMainInfo.reverseProxy.sourceData.reverseProxy.backupOrigins.length
            submit.sourceData = []
            for (let i = 0; i < len; i++) {
              submit.sourceData.push({
                originId: this.doMainInfo.reverseProxy.sourceData.reverseProxy.backupOrigins[i].id,
                isOn: true
              })
            }
          }
          submit.sourceData = Base64.encode(JSON.stringify(submit.sourceData))
          deleteOrigin(originId, this.doMainInfo.reverseProxy.sourceData.reverseProxyRef.reverseProxyId, this.isMaster, submit.sourceData).then((e) => {
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
              this.getOriginInformation()
            } else {
              swal(e.data.message, {
                icon: 'warning'
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
    modifyOrigin_add () {
      // 清空面板
      this.doMainInfo.reverseProxy.editData = {
        requestHost: '',
        weight: 10,
        connTimeout: {
          count: 30
        },
        readTimeout: {
          count: 0
        },
        addr: {
          protocol: 'http',
          host: '',
          portRange: '80',
          minPort: 0,
          maxPort: 0
        }
      }
      this.isAdd = true
    },
    getOriginInformation () {
      findEnabledServerConfig(this.id).then((e) => {
        if (e.data.code === 200) {
          var decData = utf8to16(window.atob(e.data.data))
          decData = JSON.parse(decData)
          // 检查是否初始化中
          if (decData.reverseProxyRef === null || decData.web === null){
            this.$router.push('/domainName/domainNameList')
            swal('站点不久前创建，需要一段时间初始化，请稍等几分钟再次操作!', {
              icon: 'warning'
            })
          }
          this.doMainInfo.basic.domain = decData.serverNames[0].name
          this.doMainInfo.basic.name = decData.name
          this.doMainInfo.basic.cname = decData.cnameDomain
          this.doMainInfo.basic.type = decData.type
          switch (this.doMainInfo.basic.type) {
            case 'httpProxy':
              this.doMainInfo.basic.type = 'CDN加速'
              break
            case 'httpWeb':
              this.doMainInfo.basic.type = 'HTTP Web服务'
              break
            case 'tcpProxy':
              this.doMainInfo.basic.type = 'TCP反向代理'
              break
            case 'udpProxy':
              this.doMainInfo.basic.type = 'UDP反向代理'
              break
            default:
              this.doMainInfo.basic.type = '类型异常，建议删除重建'
          }
          //  第二页
          // 主要源站
          this.loading_master_proxy = !this.loading_master_proxy
          this.doMainInfo.reverseProxy.data = []
          // 将数据保存进this，后续需要
          this.doMainInfo.reverseProxy.sourceData = decData

          if (decData.reverseProxyRef === null){
            this.doMainInfo.reverseProxy.isOn = false
          } else {
            this.doMainInfo.reverseProxy.isOn = decData.reverseProxyRef.isOn
          }

          // 检查主和源是否为空，为空源数据则为[]，这里顺带检测
          if (decData.reverseProxy === null || decData.reverseProxy.primaryOrigins === null) {
            this.doMainInfo.reverseProxy.data = []
            this.doMainInfo.reverseProxy.sourceData.reverseProxy.primaryOrigins = []
          } else {
            const len = decData.reverseProxy.primaryOrigins.length
            for (let i = 0; i < len; i++) {
              this.doMainInfo.reverseProxy.data.push({
                id: decData.reverseProxy.primaryOrigins[i].id,
                isOn: decData.reverseProxy.primaryOrigins[i].isOn,
                protocol: [decData.reverseProxy.primaryOrigins[i].addr.protocol, decData.reverseProxy.primaryOrigins[i].cert !== null],
                host: decData.reverseProxy.primaryOrigins[i].addr.host,
                portRange: decData.reverseProxy.primaryOrigins[i].addr.portRange,
                weight: decData.reverseProxy.primaryOrigins[i].weight,
                edit: '操作'
              })
            }
          }
          this.loading_master_proxy = false
          //  备用源站

          this.loading_slave1_proxy = !this.loading_slave1_proxy
          this.doMainInfo.reverseProxy.alternateData = []
          if (decData.reverseProxy === null || decData.reverseProxy.backupOrigins === null) {
            this.doMainInfo.reverseProxy.sourceData.reverseProxy.backupOrigins = []
            this.doMainInfo.reverseProxy.alternateData = []
          } else {
            const len = decData.reverseProxy.backupOrigins.length
            for (let i = 0; i < len; i++) {
              this.doMainInfo.reverseProxy.alternateData.push({
                id: decData.reverseProxy.backupOrigins[i].id,
                isOn: decData.reverseProxy.backupOrigins[i].isOn,
                protocol: [decData.reverseProxy.backupOrigins[i].addr.protocol, decData.reverseProxy.backupOrigins[i].cert !== null],
                host: decData.reverseProxy.backupOrigins[i].addr.host,
                portRange: decData.reverseProxy.backupOrigins[i].addr.portRange,
                weight: decData.reverseProxy.backupOrigins[i].weight,
                edit: '操作'
              })
            }
          }
          this.loading_slave1_proxy = false
          // 第三页
          // console.log(decData)
          // 是否启用https
          this.doMainInfo.HTTPS.HTTPS = decData.https.isOn
          // 是否启用http
          this.doMainInfo.HTTPS.HTTP = decData.http.isOn
          // 强制https
          // 重定向
          if (decData.web === null) {
            this.doMainInfo.HTTPS.isHTTPS = false
            this.doMainInfo.HTTPS.HTTPSgroup = '301'
          } else {
            if (decData.web.redirectToHTTPS === null) {
              this.doMainInfo.HTTPS.isHTTPS = false
              this.doMainInfo.HTTPS.HTTPSgroup = '301'
            } else {
              this.doMainInfo.HTTPS.isHTTPS = decData.web.redirectToHTTPS.isOn
              this.doMainInfo.HTTPS.HTTPSgroup = decData.web.redirectToHTTPS.status === 0 ? '301' : decData.web.redirectToHTTPS.status.toString()
            }


          }


          if (decData.https.sslPolicy === null || decData.https.sslPolicy.hsts === null) {
            this.doMainInfo.HTTPS.HSTS = false
            this.doMainInfo.HTTPS.OCSP = false
            this.doMainInfo.HTTPS.TLSversion = 'TLS 1.0'
            this.doMainInfo.HTTPS.SSL = 0
            this.doMainInfo.HTTPS.HTTP2 = false
          } else {
            // hsts
            this.doMainInfo.HTTPS.HSTS = decData.https.sslPolicy.hsts.isOn
            // hsts子选项
            this.doMainInfo.HTTPS.HSTSgroup.maxtime = decData.https.sslPolicy.hsts.maxAge
            this.doMainInfo.HTTPS.HSTSgroup.includeSubDomains = decData.https.sslPolicy.hsts.includeSubDomains
            this.doMainInfo.HTTPS.HSTSgroup.preload = decData.https.sslPolicy.hsts.preload
            // ocps
            this.doMainInfo.HTTPS.OCSP = decData.https.sslPolicy.ocspIsOn
            // 最低tls
            this.doMainInfo.HTTPS.TLSversion = decData.https.sslPolicy.minVersion
            // ssl证书和当前使用
            if (decData.https.sslPolicy.certs !== null && decData.https.sslPolicy.certs.length > 0) {
              // this.doMainInfo.HTTPS.SSL = decData.https.sslPolicy.certs[0].name
              this.doMainInfo.HTTPS.SSL = decData.https.sslPolicy.certs[0].id
            } else {
              // this.doMainInfo.HTTPS.SSL = '关闭'
              this.doMainInfo.HTTPS.SSL = 0
            }
            // http2
            this.doMainInfo.HTTPS.HTTP2 = decData.https.sslPolicy.http2Enabled
          }

          // 列出证书列表
          listSSLCerts(0, 99999999, null).then((e) => {
            if (e.data.code === 200) {
              this.doMainInfo.HTTPS.SSLoptions = [{ label: '无', value: 0 }]
              const certSSLlist = JSON.parse(Base64.decode(e.data.data.data))
              const len = certSSLlist.length
              for (let i = 0; i < len; i++) {
                const val = certSSLlist[i].name + '(过期时间：' + moment(parseInt(certSSLlist[i].timeEndAt * 1000)).format('YYYY/MM/DD hh:mm:ss') + ')'
                this.doMainInfo.HTTPS.SSLoptions.push({
                  label: val,
                  value: certSSLlist[i].id
                })
              }
            }
          }).catch((e) => {
            console.log(e)
          })
          Loading.hide()
        } else {
          swal(e.data.message, {
            icon: 'warning'
          })
          this.$router.push('/console')
          Loading.hide()
        }
      })
    },
    test (event) {
      console.log(event)
    },
    updateHttps () {
      Loading.show()
      updateServerHTTPS(this.id, this.doMainInfo.HTTPS.HTTPS).then((e) => {
        if (e.data.code === 200) {
          this.$q.notify({
            icon: 'insert_emoticon',
            message: '更新成功',
            color: 'green',
            position: 'top',
            timeout: 1500
          })
        } else {
          this.$q.notify({
            icon: 'warning',
            message: e.data.message,
            color: 'warning',
            position: 'top',
            timeout: 1500
          })
          // 还原
          this.doMainInfo.HTTPS.HTTPS = !this.doMainInfo.HTTPS.HTTPS
        }
        Loading.hide()
      }).catch((e) => {
        // 还原
        this.doMainInfo.HTTPS.HTTPS = !this.doMainInfo.HTTPS.HTTPS
        Loading.hide()
        console.log(e)
      })
    },
    updateHttp () {
      Loading.show()
      updateServerHTTP(this.id, this.doMainInfo.HTTPS.HTTP).then((e) => {
        if (e.data.code === 200) {
          this.$q.notify({
            icon: 'insert_emoticon',
            message: '更新成功',
            color: 'green',
            position: 'top',
            timeout: 1500
          })
        } else {
          this.$q.notify({
            icon: 'warning',
            message: e.data.message,
            color: 'warning',
            position: 'top',
            timeout: 1500
          })
          // 还原
          this.doMainInfo.HTTPS.HTTP = !this.doMainInfo.HTTPS.HTTP
        }
        Loading.hide()
      }).catch((e) => {
        // 还原
        this.doMainInfo.HTTPS.HTTP = !this.doMainInfo.HTTPS.HTTP
        Loading.hide()
        console.log(e)
      })
    },
    updateSSLPolicy () {
      const sslPolicyId = this.doMainInfo.reverseProxy.sourceData.https.sslPolicyRef.sslPolicyId
      const ocsp = this.doMainInfo.HTTPS.OCSP
      const sslID = this.doMainInfo.HTTPS.SSL === '无' ? 0 : this.doMainInfo.HTTPS.SSL
      const hstsEnabled = this.doMainInfo.HTTPS.HSTS
      const hstsMaxTime = this.doMainInfo.HTTPS.HSTSgroup.maxtime
      const hstsIncludeSubDomains = this.doMainInfo.HTTPS.HSTSgroup.includeSubDomains
      const hstsPreload = this.doMainInfo.HTTPS.HSTSgroup.preload
      const minVersion = this.doMainInfo.HTTPS.TLSversion
      const http2Enabled = this.doMainInfo.HTTPS.HTTP2
      let hsts = { isOn: hstsEnabled, maxAge: hstsMaxTime, preload: hstsPreload, includeSubDomains: hstsIncludeSubDomains }
      hsts = Base64.encode(JSON.stringify(hsts))
      Loading.show()
      updateSSLPolicy(sslPolicyId, ocsp, sslID, hsts, minVersion, http2Enabled).then((e) => {
        if (e.data.code === 200) {
          this.$q.notify({
            icon: 'insert_emoticon',
            message: '更新成功',
            color: 'green',
            position: 'top',
            timeout: 1500
          })
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
    updateHTTPWebRedirectToHTTPS () {
      const enabled = this.doMainInfo.HTTPS.isHTTPS
      const status = this.doMainInfo.HTTPS.HTTPSgroup
      Loading.show()
      updateHTTPWebRedirectToHTTPS(this.doMainInfo.reverseProxy.sourceData.web.id, this.id, enabled, status === '301').then((e) => {
        if (e.data.code === 200) {
          this.$q.notify({
            icon: 'insert_emoticon',
            message: '更新成功',
            color: 'green',
            position: 'top',
            timeout: 1500
          })
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
    }
  }
}
</script>

<style scoped>

</style>
