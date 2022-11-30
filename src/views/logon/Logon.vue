<template>

  <div class="flex justify-center items-center" style="height: 100vh">

    <div class="row base-card-shadow" style="width: 60vw;min-width: 300px">
      <div class="col-6 flex justify-center items-center " v-show="$q.screen.gt.sm">
        <q-skeleton type="text" height="70%" width="50%" v-if="!isLottieF"/>
        <lottie-web-cimo align="right" style="height: 70%" :path="defaultOptions.path" @isLottieFinish="handleFinish"/>
      </div>
      <q-separator vertical inset v-if="$q.screen.gt.sm"/>
      <div class="col flex justify-center items-center">
        <q-card square style="min-width: 290px;height: 100%; width: 60%;" class="no-shadow" v-if="regedit === false">
          <q-card-section align="center">
            <h3 class="text-uppercase">登录</h3>
            <!-- 用户名 -->
            <q-input class="logon-input"
                     clearable
                     standout="bg-cyan text-white"
                     bottom-slots
                     v-model="username"
                     label="账号"
            >
              <template v-slot:prepend>
                <q-icon name="account_circle"/>
              </template>
            </q-input>
            <!-- 密码 -->
            <q-input class="logon-input"
                     standout="bg-cyan text-white"
                     bottom-slots
                     v-model="password"
                     label="密码"
                     :type="isPwd ? 'password' : 'text'" hint=""
            >
              <template v-slot:prepend>
                <q-icon name="vpn_key"/>
              </template>
              <template v-slot:append>
                <q-icon
                  :name="isPwd ? 'visibility_off' : 'visibility'"
                  class="cursor-pointer"
                  @click="isPwd = !isPwd"
                />
              </template>
            </q-input>

            <!-- 登录按钮 -->
            <q-btn
              :loading="loading"
              class="logon-btn bg-logon-card-input"
              text-color="white"
              unelevated
              label=""
              style="font-size: large;"
              @click="logon"
            >登 录 系 统
            </q-btn>
            <div class="row justify-between" style="margin-bottom: 20px;">
              <q-btn flat label="忘记密码" @click="forgotPassword()"/>
              <q-btn outline label="我要注册"  @click="regedit = !regedit"/>
            </div>
            <p class="text-grey" align="left">账号为邮箱或手机号</p>
          </q-card-section>
        </q-card>
        <q-card square style="min-width: 290px;height: 100%; width: 60%;" class="no-shadow" v-else>
          <q-card-section align="center">
            <h3 class="text-uppercase">注册</h3>
            <!-- 用户名 -->
            <q-input class="logon-input"
                     clearable
                     standout="bg-cyan text-white"
                     bottom-slots
                     v-model="username"
                     label="邮箱或手机号"
            >
              <template v-slot:prepend>
                <q-icon name="account_circle"/>
              </template>
            </q-input>
            <!-- 密码 -->
            <q-input class="logon-input"
                     standout="bg-cyan text-white"
                     bottom-slots
                     v-model="password"
                     label="密码"
                     :type="isPwd ? 'password' : 'text'" hint=""
            >
              <template v-slot:prepend>
                <q-icon name="vpn_key"/>
              </template>
              <template v-slot:append>
                <q-icon
                  :name="isPwd ? 'visibility_off' : 'visibility'"
                  class="cursor-pointer"
                  @click="isPwd = !isPwd"
                />
              </template>
            </q-input>
            <!-- 重复密码 -->
            <q-input class="logon-input"
                     standout="bg-cyan text-white"
                     bottom-slots
                     v-model="password2"
                     label="重复密码"
                     :type="isPwd2 ? 'password' : 'text'" hint=""
            >
              <template v-slot:prepend>
                <q-icon name="vpn_key"/>
              </template>
              <template v-slot:append>
                <q-icon
                  :name="isPwd2 ? 'visibility_off' : 'visibility'"
                  class="cursor-pointer"
                  @click="isPwd2 = !isPwd2"
                />
              </template>
            </q-input>
<!--            邮箱或手机验证码-->
            <q-input class="logon-input"
                     standout="bg-cyan text-white"
                     bottom-slots
                     v-model="code"
                     label="邮箱或手机验证码"
            >
              <template v-slot:prepend>
                <q-icon name="mail"/>
              </template>
<!--              获取验证码-->
              <q-btn
                :loading="loadVerificationCode"
                size="10px"
                class="bg-logon-card-input"
                :label="codeLoading"
                @click="getcode"
              >
              </q-btn>
            </q-input>
            <!-- 注册按钮 -->
            <q-btn
              :loading="loading"
              class="logon-btn bg-logon-card-input"
              text-color="white"
              unelevated
              label=""
              style="font-size: large;"
              @click="regon"
            >注 册 系 统
            </q-btn>
            <div class="row justify-between" style="margin-bottom: 20px;">
              <q-btn flat label=""/>
              <q-btn outline label="我要登录" @click="regedit = !regedit"/>
            </div>
            <p class="text-grey" align="left">账号为邮箱或手机号（目前没有开启手机号注册）</p>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </div>

</template>

<script>
import LottieWebCimo from '../../components/LottieWebCimo/LottieWebCimo'
import { Cookies } from 'quasar'
import { loginUser, registerUser } from '@/api/UserService'
import { getcode } from '@/api/Verification'
import swal from 'sweetalert'

const options = {
  httpOnly: true,
  expires: '过期时间'
}
export default {
  name: 'Logon',
  data () {
    return {
      isPwd: true,
      isPwd2: true,
      regedit: false,
      username: 'amen',
      password: 'ljf147258',
      password2: 'ljf147258',
      code: '',
      codeLoading: '获取验证码',
      loadVerificationCode: false,
      defaultOptions: {
        path: 'https://assets9.lottiefiles.com/packages/lf20_vo0a1yca.json',
        loop: true
      },
      loading: false,
      percentage: 0,
      isLottieF: false
    }
  },
  mounted: function () {
    // getWebConfig().then((e) => {
    //   defaultNotify.message = "aa"
    //   Vue.prototype.$title = e.data.title
    //   // Cookies.set('cookie_name', '11',)
    //   Notify.create(defaultNotify)
    //   console.log(e.data)
    // }).catch((e) => {
    //   defaultNotify.message = e.message
    //   Notify.create(defaultNotify)
    // })
  },
  components: { LottieWebCimo },
  methods: {
    logon () {
      const self = this
      var ticket = '1'
      var ranstr = '1'
      this.loading = !this.loading
      var captcha1 = new TencentCaptcha('2046626881', (res) => {
        if (res.ret === 0) {
          ticket = res.ticket
          ranstr = res.randstr
          loginUser(this.username, this.password, ticket, ranstr).then((e) => {
            if (e.data.code === 200) {
              // sessionStorage.setItem('access_token', 972784674)
              sessionStorage.setItem('user_role', 'admin')
              sessionStorage.setItem('username', this.username)
              const lt = setTimeout(() => {
                this.$router.push('/console')
                this.$q.notify({
                  icon: 'insert_emoticon',
                  message: 'hi，' + this.username + ' 欢迎回来',
                  color: 'green',
                  position: 'top',
                  timeout: 1500
                })
                clearTimeout(lt)
                this.loading = !this.loading
              }, Math.random() * 3000)
            } else {
              this.$q.notify({
                icon: 'warning',
                message: e.data.message,
                color: 'warning',
                position: 'top',
                timeout: 1500
              })
              this.loading = !this.loading
            }
          })
        } else {
          this.loading = !this.loading
        }
      })
      if (Cookies.get('verificationCode') === true) {
        captcha1.show()
      } else {
        loginUser(this.username, this.password, ticket, ranstr).then((e) => {
          if (e.data.code === 200) {
            // sessionStorage.setItem('access_token', 972784674)
            sessionStorage.setItem('user_role', 'admin')
            sessionStorage.setItem('username', this.username)
            // router.push({ path: '/' })
            // window.location.herf = "/"
            self.loading = !this.loading
            const lt = setTimeout(() => {
              this.$router.push('/console')
              this.$q.notify({
                icon: 'insert_emoticon',
                message: 'hi，' + this.username + ' 欢迎回来',
                color: 'green',
                position: 'top',
                timeout: 1500
              })
              clearTimeout(lt)
              this.loading = !this.loading
            }, Math.random() * 3000)
          } else {
            this.$q.notify({
              icon: 'warning',
              message: e.data.message,
              color: 'warning',
              position: 'top',
              timeout: 1500
            })
            this.loading = !this.loading
          }
        })
      }

      // return
      // if (this.username === 'admin' || this.username === 'test') {
      //   sessionStorage.setItem('access_token', 972784674)
      //   sessionStorage.setItem('user_role', this.username)
      //   const lt = setTimeout(() => {
      //     this.$router.push('/')
      //     this.$q.notify({
      //       icon: 'insert_emoticon',
      //       message: 'hi，cimo 欢迎回来',
      //       color: 'green',
      //       position: 'top',
      //       timeout: 1500
      //     })
      //     clearTimeout(lt)
      //     this.loading = !this.loading
      //   }, Math.random() * 3000)
      // } else {
      //   this.loading = !this.loading
      //   this.$q.notify({
      //     icon: 'announcement',
      //     message: '账号错误',
      //     color: 'red',
      //     position: 'top',
      //     timeout: 1500
      //   })
      // }
    },
    regon () {
      const self = this
      var ticket = '1'
      var ranstr = '1'
      this.loading = !this.loading
      // 检测验证码
      if (this.code === '' || this.code === null) {
        this.$q.notify({
          icon: 'warning',
          message: '请填写验证码',
          color: 'warning',
          position: 'top',
          timeout: 1500
        })
        this.loading = !this.loading
        return
      }
      // 检测 用户名规范
      if (!(/^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/.test(this.username))) {
        if (!(/^1[3456789]\d{9}$/.test(this.username))) {
          this.$q.notify({
            icon: 'warning',
            message: '用户名不规范，必须是邮箱或手机号',
            color: 'warning',
            position: 'top',
            timeout: 1500
          })
          this.loading = !this.loading
          return
        }
      }
      // 检测密码规范
      if (!(/(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[\W]).{8,}/.test(this.password))) {
        this.$q.notify({
          icon: 'warning',
          message: '密码不规范，必须包含大写/小写/数字/特殊字符',
          color: 'warning',
          position: 'top',
          timeout: 1500
        })
        this.loading = !this.loading
        return
      }
      if (this.password !== this.password2) {
        this.$q.notify({
          icon: 'warning',
          message: '重复密码不一致',
          color: 'warning',
          position: 'top',
          timeout: 1500
        })
        this.loading = !this.loading
        return
      }
      var captcha1 = new TencentCaptcha('2046626881', (res) => {
        if (res.ret === 0) {
          ticket = res.ticket
          ranstr = res.randstr
          registerUser(this.username, this.password, this.code, ticket, ranstr).then((e) => {
            if (e.data.code === 200) {
              this.loading = !this.loading
              this.$q.notify({
                icon: 'insert_emoticon',
                message: '注册成功',
                color: 'green',
                position: 'top',
                timeout: 1500
              })
              this.regedit = !this.regedit
            } else {
              this.$q.notify({
                icon: 'warning',
                message: e.data.message,
                color: 'warning',
                position: 'top',
                timeout: 1500
              })
              this.loading = !this.loading
            }
          })
        } else {
          this.loading = !this.loading
        }
      })
      if (Cookies.get('verificationCode') === true) {
        captcha1.show()
      } else {
        registerUser(this.username, this.password, this.code, ticket, ranstr).then((e) => {
          if (e.data.code === 200) {
            this.loading = !this.loading
            this.$q.notify({
              icon: 'insert_emoticon',
              message: '注册成功',
              color: 'green',
              position: 'top',
              timeout: 1500
            })
            this.regedit = !this.regedit
          } else {
            this.$q.notify({
              icon: 'warning',
              message: e.data.message,
              color: 'warning',
              position: 'top',
              timeout: 1500
            })
            this.loading = !this.loading
          }
        })
      }
    },
    getcode () {
      const self = this
      var ticket = '1'
      var ranstr = '1'
      this.loadVerificationCode = !this.loadVerificationCode
      var captcha1 = new TencentCaptcha('2046626881', (res) => {
        if (res.ret === 0) {
          ticket = res.ticket
          ranstr = res.randstr
          getcode(this.username, ticket, ranstr).then((e) => {
            if (e.data.code === 200) {
              this.loadVerificationCode = !this.loadVerificationCode
              this.$q.notify({
                icon: 'insert_emoticon',
                message: '验证码发送成功，请查收',
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
              this.loadVerificationCode = !this.loadVerificationCode
            }
          })
        } else {
          this.loadVerificationCode = !this.loadVerificationCode
        }
      })
      if (Cookies.get('verificationCode') === true) {
        captcha1.show()
      } else {
        getcode(this.username, ticket, ranstr).then((e) => {
          if (e.data.code === 200) {
            this.loadVerificationCode = !this.loadVerificationCode
            this.$q.notify({
              icon: 'insert_emoticon',
              message: '验证码发送成功，请查收',
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
            this.loadVerificationCode = !this.loadVerificationCode
          }
        })
      }
    },
    handleFinish (e) {
      this.isLottieF = e
    },
    forgotPassword () {
      swal('暂时不支持自助忘记密码，请联系客服', {
        icon: 'warning'
      })
    }
  }
}
</script>

<style scoped>
.logon-btn {
  font-size: large;
  margin-top: 0px;
  margin-bottom: 20px;
  width: 100%;
}

.bg-logon-card-input {
  background: linear-gradient(to right, #36d1dc 1%, #5b86e5 99%);
  transition: all 0.3s ease-in-out;
  background-size: 200% auto;
}

.bg-logon-card-input:hover {
  background-position: right center;
  box-shadow: 0 12px 20px -11px #5b86e5;
}
</style>
