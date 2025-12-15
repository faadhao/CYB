<template lang="pug">
  #connection
    b-container.vh-100.mt-6
      br
      h2.text-white.mt-3.h2 留言板
      b-row
        b-col.max-height.my-5(cols="12" lg="4" v-for="(message, index) in messages" :key="message._id")
          b-card(no-body)
            b-card-header.d-flex.justify-content-end
              font-awesome-icon.mb-1(:icon="['far', 'user-circle']" size="lg")
              h4.flex-fill.ml-1 {{ message.user }}
              b-dropdown(text="管理留言" size="sm" variant="wihte" v-if="user.gender === 'root'")
                b-dropdown-item(@click="muteUser(message.userId)") 禁言此會員
                b-dropdown-item(@click="deleteMessage(message._id)") 刪除此留言
            b-card-body.pt-2
              b-card-text.mb-5 {{ message.message }}
              font-awesome-icon.ml-3(:icon="['fas', 'user-cog']" v-if="message.replyed")
              p.ml-1.d-inline(v-if="message.replyed") 管理員
              p.ml-3(v-if="message.replyed") {{ message.reply }}
              b-button(v-if="message.replyed && user.gender === 'root' " variant="danger" size="sm" @click="deleteReply(message._id, index)") 刪除回覆
            b-card-footer(v-if="user.gender === 'root' && !message.replyed")
              b-form(@submit="onSubmit(message._id, index)" @reset="reset()")
                b-textarea(rows=3 cols=10 v-model="reply[index]") {{ message._id }}
                b-button.m-btn.mt-2(type="submit" variant="primary") 送出
                b-button.mt-2.ml-2(type="reset") 重置
      b-button(pill v-if="user.gender !== 'root'" variant="info" v-b-modal.message).fixed-top.text-white.position 我要留言
      b-modal#message
          template(#modal-header='{ close }')
            h3 留言
            b-button(variant="light" @click="close()") 
              font-awesome-icon(:icon="['far', 'times-circle']")
          template(#default='{ hide }')
            b-form(@submit="sendMessage()")
              b-textarea.mb-2(rows="5" v-model="message")
              div.d-flex.justify-content-end.mt-4
                b-button(type="submit" variant="primary") 送出
                b-button.ml-2(type="reset") 清除
          template(#modal-footer='{ ok, cancel, hide }')
            h6.mr-auto &nbsp;
</template>

<script>
import API from '../api'
import { handleError, handleSuccess } from '../utils/errorHandler'

export default {
  name: 'Connection',
  data() {
    return {
      messages: [],
      reply: [],
      message: '',
      loading: false
    }
  },
  computed: {
    user() {
      return this.$store.state.user
    }
  },
  methods: {
    onSubmit(id, index) {
      let data = {
        user: this.messages[index].user,
        userId: this.messages[index].userId,
        message: this.messages[index].message,
        reply: this.reply[index]
      }
      
      this.axios.patch(API.message.reply(id), data)
        .then(res => {
          if (res.data.success) {
            this.messages[index].replyed = true
            this.messages[index].reply = this.reply[index]
            this.reply[index] = ''
            handleSuccess('回覆成功', this)
          } else {
            this.$swal({
              icon: 'error',
              title: '回覆失敗',
              text: res.data.message
            })
          }
        })
        .catch(err => {
          handleError(err, this)
        })
    },
    reset() {
      this.reply = ''
    },
    deleteMessage(id) {
      this.axios.delete(API.message.getById(id))
        .then(res => {
          if (res.data.success) {
            handleSuccess('删除成功', this)
            // 移除該留言
            this.messages = this.messages.filter(msg => msg._id !== id)
          }
        })
        .catch(err => {
          handleError(err, this)
        })
    },
    muteUser(id) {
      this.axios.patch(API.users.getById(id), { messageAble: false })
        .then(res => {
          if (res.data.success) {
            handleSuccess('禁言成功', this)
            // 重新載入留言
            this.loadMessages()
          }
        })
        .catch(err => {
          handleError(err, this)
        })
    },
    sendMessage() {
      let data = { message: this.message }
      this.axios.post(API.message.base, data)
        .then(res => {
          if (res.data.success) {
            handleSuccess('留言成功', this)
            this.message = ''
            this.$bvModal.hide('message')
            // 重新載入留言
            this.loadMessages()
          }
        })
        .catch(err => {
          handleError(err, this)
        })
    },
    deleteReply(id, index) {
      let data = {
        user: this.messages[index].user,
        userId: this.messages[index].userId,
        message: this.messages[index].message,
        reply: ''
      }
      
      this.axios.patch(API.message.reply(id), data)
        .then(res => {
          if (res.data.success) {
            this.messages[index].replyed = false
            this.messages[index].reply = ''
            handleSuccess('刪除回覆成功', this)
          } else {
            this.$swal({
              icon: 'error',
              title: '刪除失敗',
              text: res.data.message
            })
          }
        })
        .catch(err => {
          handleError(err, this)
        })
    },
    loadMessages() {
      this.loading = true
      this.axios.get(API.message.list)
        .then(res => {
          if (res.data.success) {
            this.messages = res.data.result.map(message => ({
              ...message,
              reply: message.reply || '',
              replyed: message.reply && message.reply.length > 0
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
  },
  mounted() {
    this.loadMessages()
  }
}
</script>

<style>
.a-text {
  font-size: 20px;
}
.fz {
  font-size: 24px;
}
.m-btn {
  margin-left: 180px;
}
.ml {
  margin-left: 80px;
}
.message {
  margin: 0 0 3% 3%;
  display: inline;
}
.card-header {
  background: none;
  border: none;
}
.max-height {
  max-height: 300px;
}
.position {
  top: 10%;
  left: 80%;
}
.icon-mt {
  margin-top: 12px;
}
.modal-header,
.modal-footer {
  border: none !important;
}
</style>
