<template lang="pug">
  #connection
    b-container.vh-100.mt-6
      br
      h2.text-white.mt-3.h2 留言板
      b-row
        b-col.max-height(cols="12" lg="4" v-for="(message, index) in messages" :key="message._id")
          b-card.my-5(no-body)
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

</script>
<script>
export default {
  name: 'Connection',
  data() {
    return {
      messages: [],
      reply: [],
      message: ''
    }
  },
  computed: {
    user() {
      return this.$store.state.user
    }
  },
  methods: {onSubmit(id, index) {
      let data = {}
      data[0] = this.messages[index]
      delete data[0]._id
      delete data[0].replyed
      data[0].reply = this.reply[index]
      this.axios.patch(process.env.VUE_APP_API + '/message/reply/' + id, data[0])
        .then(res => {
          if (res.data.success) {
            this.messages[index].replyed = true
            this.reply = ''
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
    },
    reset() {
      this.reply = ''
    },
    deleteMessage(id) {
      this.axios.delete(process.env.VUE_APP_API + '/message/' + id)
        .then(res => {
          if (res.data.success) {
            location.reload()
          }
        })
        .catch(err => {
          console.log(err)
          this.$swal({
            icon: 'error',
            title: '發生錯誤',
            text: err.response.data.message
          })
        })
    },
    muteUser(id) {
      this.axios.patch(process.env.VUE_APP_API + '/users/' + id, { messageAble: false })
        .then(res => {
          if (res.data.success) {
            location.reload()
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
    sendMessage() {
      let data = {message : this.message}
      this.axios.post(process.env.VUE_APP_API + '/message/', data)
        .then(res => {
          if (res.data.success) {
            this.$swal({
              icon: 'success',
              title: '成功',
              text: '留言完成'
            })
            location.reload()
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
    deleteReply(id, index) {
      let data = {}
      data[0] = this.messages[index]
      delete data[0]._id
      delete data[0].replyed
      data[0].reply = ''
      this.axios.patch(process.env.VUE_APP_API + '/message/reply/' + id, data[0])
        .then(res => {
          if (res.data.success) {
            this.messages[index].replyed = true
            this.reply = ''
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
  mounted() {
    this.axios.get(process.env.VUE_APP_API + '/message/messages')
      .then(res => {
        if(res.data.success){
          this.messages = res.data.result
          this.messages.map(message => {
            message.reply = message.reply || ""
            if (message.reply === undefined || message.reply.length === 0) {
              message.replyed = false
            } else {
              message.replyed = true
            }
          })
        }
      })
      .catch(err => {
        console.log(err)
        this.$swal({
          icon: 'error',
          title: '錯誤',
          text: err.response.data.message
        })
      })
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
