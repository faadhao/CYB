<template lang="pug">
  #userCenter.mt-6.pt-3
    b-container
      h2.text-white.h2.my-5 會員中心
      b-tabs(content-class='bg-light rounded-lg' card)
        b-tab(title='會員資料' active)
          b-container
            h2.my-4 會員資料
            div.my-4
              h5.ml-5.d-inline 姓名:
              h5.ml-3.d-inline(v-if="!nameEdit") {{ user.name }}
              b-form-input.d-inline.ml-3(v-if="nameEdit" v-model="user.model.userName")
              b-button.ml-4.mb-1(size="sm" variant="info" v-if="!nameEdit" @click="edit('nameEdit')") 編輯
              b-button.ml-4.mb-1(size="sm" variant="success" v-if="nameEdit" @click="save('nameEdit', user.model)") 儲存
              b-button.ml-2.mb-1(size="sm" v-if="nameEdit" @click="cancel('nameEdit','nameModel','userName')") 取消
            div.my-4
              h5.ml-5.d-inline 帳號:
              h5.ml-3.d-inline(v-if="!accountEdit") {{ user.account }}
              b-form-input.d-inline.ml-3(v-if="accountEdit" v-model="user.model.account")
              b-button.ml-4.mb-1(size="sm" variant="info" v-if="!accountEdit" @click="edit('accountEdit')") 編輯
              b-button.ml-4.mb-1(size="sm" variant="success" v-if="accountEdit" @click="save('accountEdit', user.model)") 儲存
              b-button.ml-2.mb-1(size="sm" v-if="accountEdit" @click="cancel('accountEdit','accountModel','account')") 取消
            div.my-4
              h5.d-inline.ml-5 性別:
              h5.d-inline.ml-3 {{ user.userGender }}
            div.my-4
              h5.d-inline.ml-5 會員編號:
              h5.d-inline.ml-3 {{ user.id }}
        b-tab(title='我的票券').mb-5
          b-container
            h2.my-3 我的票券
            b-row
              b-col.mx-auto.my-3(cols="10" v-for="(ticket, index) in tickets" :key="ticket._id")
                h3 {{ ticket.title }}
                p 時間：　{{ ticket.time }}
                p 地點：　{{ ticket.location }}
                p 人數：　{{ ticket.quantity }}
                p(v-if="ticket.paid") 付款狀態：　已付款
                p(v-if="!ticket.paid") 付款狀態：　未付款
                b-button(variant="info") 付款
                b-button(variant="success" v-b-modal.approach @click="approach(ticket.cid)").ml-2 入場
      b-modal#approach
        template(#modal-header='{ close }')
          h3 入場
          b-button(variant="light" @click="close()") 
            font-awesome-icon(:icon="['far', 'times-circle']")
        template(#default='{ hide }')
          b-row
            b-col.d-flex.justify-content-center
              vue-qrcode(:value="value")
        template(#modal-footer='{ ok, cancel, hide }')
          h6.mr-auto &nbsp;
</template>

<script>
import VueQrcode from 'vue-qrcode'
export default {
  name: 'UserCenter',
  data() {
    return {
      user: {},
      nameEdit: false,
      accountEdit: false,
      tickets: {},
      value: {}
    }
  },
  components: {
    VueQrcode
  },
  methods: {
    edit(edit) {
      this[edit] = true
    },
    cancel(edit, model, data) {
      this.user[model] = this.user[data]
      this[edit] = false
    },
    save(edit, data) {
      this.axios.patch(process.env.VUE_APP_API + '/users/edit', data)
        .then(res => {
          if (res.data.success) {
            this[edit] = false
            this.user.name = data.userName
            this.user.account = data.account
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
    },
    approach(id) {
      this.value = id
    }
  },
  mounted() {
    this.axios.get(process.env.VUE_APP_API + '/users/user')
      .then(res => {
        if (res.data.success) {
          this.user = {
            id: res.data.result._id,
            account: res.data.result.account,
            name: res.data.result.userName,
            model: {
              userName: res.data.result.userName,
              account: res.data.result.account
            },
            gender:　res.data.result.gender
          }
          this.tickets = res.data.result.tickets
          this.tickets.map(ticket => {
            ticket.tid = ticket._id
            ticket.title = ticket.t_id.title
            ticket.time = ticket.t_id.time
            ticket.location = ticket.t_id.location
            ticket.quantity = ticket.quantity
            ticket.cid = ticket.t_id._id
            delete ticket.t_id
          })
          if (this.user.gender === 'male') {
            this.user.userGender = '男'
          } else if (this.user.gender === 'female') {
            this.user.userGender = '女'
          }
        }
      })
  }
}
</script>

<style>
#userCenter li a{
  color: white;
}
#userCenter li .active {
  color: black;
}
#userCenter input {
  width: 200px;
}
.col img {
  width: 300px;
}
.modal-header,
.modal-footer {
  border: none;
}
</style>
