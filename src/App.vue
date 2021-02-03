<template lang="pug">
  div#app
    b-navbar.fixed-top.bg-black(toggleable='lg' type='dark')
      b-navbar-brand(to="/") 
        img.ml-1(:src="'./icon.png'" width="90" height="40")
      b-navbar-toggle(target='nav-collapse')
      b-collapse#nav-collapse(is-nav)
        b-navbar-nav
          b-nav-item(to="/") 首頁
          b-nav-item(to="/about") 關於我們
          b-nav-item(to="/concert") 表演資訊
          b-nav-item(to="/messagebord") 留言板
          b-nav-item(v-if="user.gender !== 'root' && user.id.length > 0" to="/userCenter") 會員中心
          b-nav-item(v-if="user.gender === 'root'" to="/backstage") 後台
        b-navbar-nav.ml-auto
          b-nav-item(v-if="user.id.length === 0" v-b-modal.signUp) 註冊
          b-nav-item(v-if="user.id.length === 0" v-b-modal.logIn) 登入
          b-nav-item(v-if="user.id.length > 0" @click="logout") 登出
        b-modal#signUp
          template(#modal-header='{ close }')
            h3 註冊
            b-button(variant="light" @click="close()") 
              font-awesome-icon(:icon="['far', 'times-circle']")
          template(#default='{ hide }')
            b-form(@submit.prevent="onSubmit" @resset="onReset")
              b-form-group#input-group-userName(label='姓名:' label-for='userName')
                b-form-input#userName(v-model='form.userName' type='text' placeholder='請輸入姓名' required)
              b-form-group#input-group-gender(label='性別:' label-for='gender')
                b-form-radio-group#gender(v-model='form.gender' required)
                  b-form-radio(value="male" checked) 男
                  b-form-radio(value="female") 女
              b-form-group#input-group-userName(label='帳號:' label-for='account' :state="accountState" invalid-feedback="帳號必須為 6-16 個字")
                b-form-input#account(v-model='form.account' type='text' placeholder='請輸入帳號' required :state="accountState")
              b-form-group#input-group-password(label='密碼:' label-for='password' :state="passwordState" invalid-feedback="密碼必須為 6-16 個字" )
                b-form-input#password(v-model='form.password' type='password' placeholder='請輸入密碼' required :state="passwordState")
              b-form-group#input-group-passwordCheck(label='確認密碼:' label-for='passwordCheck' :state="passwordCheckState" invalid-feedback="密碼不相符")
                b-form-input#passwordCheck(v-model='form.passwordCheck' type='password' placeholder='請再次輸入密碼' required:state="passwordCheckState")
              b-button.mr-1(type="submit" variant="primary") 送出
              b-button(type="reset") 重填
          template(#modal-footer='{ ok, cancel, hide }')
            h6.mr-auto Signup with:
        b-modal#logIn
          template(#modal-header='{ close }')
            h3 登入
            b-button(variant="light" @click="close()") 
              font-awesome-icon(:icon="['far', 'times-circle']")
          template(#default='{ hide }')
            b-form(@submit.prevent="login" @resset="onReset")
              b-form-group#input-group-userName(label='帳號:' label-for='account' :state="accountState" invalid-feedback="帳號必須為 6-16 個字")
                b-form-input#account(v-model='logInForm.account' type='text' placeholder='請輸入帳號' required :state="accountState")
              b-form-group#input-group-password(label='密碼:' label-for='password' :state="passwordState" invalid-feedback="密碼必須為 6-16 個字")
                b-form-input#password(v-model='logInForm.password' type='password' placeholder='請輸入密碼' required :state="passwordState")
              b-button.mr-1(type="submit" variant="primary") 送出
              b-button(type="reset") 重填
          template(#modal-footer='{ ok, cancel, hide }')
            h6.mr-auto Login with:
    router-view
</template>

<script>
export default {
  name: 'App',
  data () {
    return {
      form: {
        userName: '',
        gender: '',
        account: '',
        password: '',
        passwordCheck: ''
      },
      logInForm: {
        account: '',
        password: ''
      }
    }
  },
  computed: {
    user () {
      return this.$store.state.user
    },
    accountState () {
      let account = this.form.account || this.logInForm.account
      if (account.length === 0) {
        return null
      } else if ((account.length >= 6 && account.length <= 16) || account === 'root') {
        return true
      } else {
        return false
      }
    },
    passwordState () {
      let password = this.form.password || this.logInForm.password
      if (password.length === 0) {
        return null
      } else if (password.length >= 6 && password.length <= 16) {
        return true
      } else {
        return false
      }
    },
    passwordCheckState () {
      if (this.form.passwordCheck.length === 0) {
        return null
      } else if (this.form.passwordCheck === this.form.password) {
        return true
      } else {
        return false
      }
    }
  },
  methods: {
    onSubmit () {
      if (this.accountState && this.passwordState && this.passwordCheckState) {
        let data = {
          account: this.form.account,
          password: this.form.password,
          userName: this.form.userName,
          gender: this.form.gender
        }
        this.axios.post(process.env.VUE_APP_API + '/users/', data)
          .then(res => {
            if (res.data.success) {
              this.$swal({
                icon: 'success',
                title: '註冊成功',
                text: '歡迎加入琴音部會員'
              })
              this.form.userName = ''
              this.form.gender = ''
              this.form.account = ''
              this.form.password = ''
              this.form.passwordCheck = ''
              location.reload()
            } else {
              this.$swal({
                icon: 'error',
                title: '發生錯誤',
                text: res.data.message
              })
            }
          })
          .catch(err => {
            this.$swal({
              icon: 'error',
                title: '發生錯誤',
                text: err.response.data.message
            })
          })
      }
    },
    onReset () {
      if (this.form.userName === undefined) {
        this.form.account = ''
        this.form.password = ''
      } else {
        this.form.userName = ''
        this.form.gender = ''
        this.form.account = ''
        this.form.password = ''
        this.form.passwordCheck = ''
      }
    },
    login () {
      if (this.accountState && this.passwordState) {
        this.axios.post(process.env.VUE_APP_API + '/users/login', this.logInForm)
          .then(res => {
            if (res.data.success) {
              this.$store.commit('login', res.data.result[0])
              this.$swal({
                icon: 'success',
                title: '登入成功'
              })
              location.reload()
            } else {
              this.$swal({
                icon: 'error',
                title: '發生錯誤',
                text: res.data.message
              })
            }
          })
          .catch(err => {
            this.$swal({
              icon: 'error',
                title: '發生錯誤',
                text: err.response.data.message
            })
          })
      }
    },
    logout () {
      this.axios.delete(process.env.VUE_APP_API + '/users/logout')
        .then(res => {
          if (res.data.success) {
            alert('登出成功')
            this.$store.commit('logout')

            if (this.$route.path !== '/') {
              this.$router.push('/')
            }
          } else {
            this.$swal({
              icon: 'error',
              title: '錯誤',
              text: res.data.message
            })
          }
        })
        .catch(error => {
          this.$swal({
            icon: 'error',
            title: '錯誤',
            text: error.response.data.message
          })
        })
    },
    heartbeat () {
      this.axios.get(process.env.VUE_APP_API + '/users/heartbeat')
        .then(res => {
          if (this.user.id.length > 0) {
            if (!res.data) {
              alert('登入時效已過')
              this.$store.commit('logout')
              if (this.$route.path !== '/') {
                this.$router.push('/')
              }
            }
          }
        })
        .catch(() => {
          this.$store.commit('logout')
          if (this.$route.path !== '/') {
            this.$router.push('/')
          }
        })
    }
  },
  mounted () {
    this.heartbeat()
    setInterval(() => {
      this.heartbeat()
    }, 5000)
  }
}
</script>

<style>
.bg-black {
  background: #000;
}
.h2 {
  border-left: 10px solid cyan;
  padding-left: 10px;
  text-shadow: 0 0 10px rgba(255,255,255,1), 0 0 20px rgba(255,255,255,0.8), 0 0 40px rgba(255,255,255,0.5);
  margin-left: 10px;
}
</style>
