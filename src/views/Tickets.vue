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
import API from '../api'
import { handleError, handleSuccess, handleWarning } from '../utils/errorHandler'

export default {
  name: 'tickets',
  data() {
    return {
      tickets: {},
      selected: {},
      options: [],
      seats: 1,
      totalPrice: 0,
      loading: false
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
      // 驗證座位數
      if (this.seats > this.selected.seats) {
        handleWarning('座位數不足，請重新選擇', this)
        return
      }

      let data
      let booked
      this.tickets.forEach(ticket => {
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

      this.loading = true
      this.axios.post(API.ticket.bookTicket, booked)
        .then(res => {
          if (res.data.success) {
            return this.axios.patch(API.ticket.getById(data.id), { seats: data.seats })
          }
        })
        .then(res2 => {
          if (res2 && res2.data.success) {
            handleSuccess('訂票成功，請到會員中心查看票券', this)
            this.$router.push({name: 'UserCenter'})
          }
        })
        .catch(err => {
          handleError(err, this)
        })
        .finally(() => {
          this.loading = false
        })
    },
    onReset() {
      this.seats = 1
    }
  },
  mounted() {
    this.loading = true
    this.axios.get(API.ticket.list)
      .then(res => {
        if (res.data.success) {
          this.tickets = res.data.result
          
          // 處理選項清單
          this.options = this.tickets.map(ticket => ({
            value: { id: ticket._id, seats: ticket.seats, price: ticket.price },
            text: ticket.title
          }))

          // 如果有預選的演出 ID，設定預設選項
          if (this.concertId) {
            const selectedTicket = this.tickets.find(ticket => 
              ticket.c_id._id === this.concertId
            )
            if (selectedTicket) {
              this.selected = {
                id: selectedTicket._id,
                seats: selectedTicket.seats,
                price: selectedTicket.price
              }
              this.totalPrice = selectedTicket.price
            }
          }

          // 如果沒有預選，選擇第一個
          if (!this.selected.id && this.tickets.length > 0) {
            this.selected = {
              id: this.tickets[0]._id,
              seats: this.tickets[0].seats,
              price: this.tickets[0].price
            }
            this.totalPrice = this.tickets[0].price
          }
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
#tickets .b-form-spinbutton {
  max-width: 120px;
}
</style>
