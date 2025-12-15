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
import API from '../api'
import { handleError } from '../utils/errorHandler'

export default {
  name: 'UserCenter',
  data() {
    return {
      user: {},
      nameEdit: false,
      accountEdit: false,
      tickets: {},
      value: {},
      loading: false
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
      this.axios.patch(API.users.edit, data)
        .then(res => {
          if (res.data.success) {
            this[edit] = false
            this.user.name = data.userName
            this.user.account = data.account
            this.$swal({
              icon: 'success',
              title: '成功',
              text: '資料更新成功'
            })
          } else {
            this.$swal({
              icon: 'error',
              title: '更新失敗',
              text: res.data.message
            })
          }
        })
        .catch(err => {
          handleError(err, this)
        })
    },
    approach(id) {
      this.value = id
    }
  },
  mounted() {
    this.loading = true
    this.axios.get(API.users.user)
      .then(res => {
        if (res.data.success) {
          const result = res.data.result
          this.user = {
            id: result._id,
            account: result.account,
            name: result.userName,
            model: {
              userName: result.userName,
              account: result.account
            },
            gender: result.gender,
            userGender: result.gender === 'male' ? '男' : '女'
          }
          
          // 處理票券數據
          this.tickets = result.tickets.map(ticket => ({
            tid: ticket._id,
            title: ticket.t_id.title,
            time: ticket.t_id.time,
            location: ticket.t_id.location,
            quantity: ticket.quantity,
            paid: ticket.paid || false,
            cid: ticket.t_id._id
          }))
        }
      })
      .catch(err => {
        handleError(err, this)
      })
      .finally(() => {
        this.loading = false
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
