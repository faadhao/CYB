<template lang="pug">
  #tickets.mt-6
    b-container
      b-row
        b-col(cols="10").bg-light.mt-3.rounded-lg.mx-auto
          h1.my-3 訂票
          b-form.mx-5.my-3(@submit="onSubmit" @reset="onReset")
            b-form-group(label="場次" label-for="title")
              b-form-select#title(v-model="selected")
                b-form-select-option(v-for="option in options" :value="option.value") {{ option.text }}
            p 剩餘座位數: {{ selected.seats }}
            b-form-group(label="張數" label-for="seat")
              b-form-spinbutton#seat(v-model="seats" min=1 :max="selected.seats")
            p.d-inline 總價
            p.d-inline.ml-2(v-model="seats") ${{ seats * totalPrice }}
            div.d-flex.justify-content-end
              b-button(variant="success" type="submit") 送出
              b-button.ml-2(type="reset") 重填
</template>

<script>
export default {
  name: 'tickets',
  data() {
    return {
      tickets: {},
      selected: {},
      options: [],
      seats: 1,
      totalPrice: 0
    }
  },
  computed: {
    user() {
      return this.$store.state.user
    },
    concertId() {
      return this.$store.state.concertId
    }
  },
  methods: {
    onSubmit() {
      let data
      let booked
      this.tickets.map(ticket => {
        if (ticket._id === this.selected.id) {
          booked = {
            t_id: ticket.c_id._id,
            quantity: this.seats
          }
          data = {
            seats: ticket.seats - this.seats,
            id: ticket._id
          }
        }
      })
      this.axios.post(process.env.VUE_APP_API + '/ticket/bookTicket', booked)
        .then(res => {
          if (res.data.success) {
            this.axios.patch(process.env.VUE_APP_API + '/ticket/' + data.id, { seats: data.seats })
              .then(res2 => {
                if (res2.data.success) {
                  this.$swal({
                    icon: 'success',
                    title: '成功',
                    text: '訂票成功，請確認 會員中心 > 我的票券'
                  })
                  this.$router.push({name: 'UserCenter'})
                }
              })
          }
        })
        .catch(err => {
          this.$swal({
            icon: 'error',
            title: '錯誤',
            text: err.response.data.message
          })
        })
    },
    onReset() {
      this.seats = 1
    }
  },
  mounted() {
    this.axios.get(process.env.VUE_APP_API + '/ticket/tickets')
      .then(res => {
        if (res.data.success) {
          this.tickets = res.data.result
          this.tickets.map(ticket => {
            this.options.push(
              {value: {id: ticket._id, seats: ticket.seats}, text: ticket.title}
            )
          })
        }
      })
      .then(res => {
        this.tickets.map(ticket => {
          if (this.concertId === ticket.c_id._id) {
            this.selected = {id: ticket._id, seats: ticket.seats}
            this.totalPrice = ticket.price
          }
        })
      })
  }
}
</script>

<style>
#tickets .b-form-spinbutton {
  max-width: 120px;
}
</style>
