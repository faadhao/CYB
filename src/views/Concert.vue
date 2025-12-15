<template lang="pug">
  #concert.mt-6
    b-container
      b-row
        b-col(cols="12" lg="6" v-for="(concert, index) in concerts" :key="concert._id")
          b-card.my-3.text-white(overlay :img-src="'https://picsum.photos/540/300/?random=' + index")
            b-card-title.text-cyan {{ concert.title }}
            div.content
              h5 時間：{{ concert.time }}
              h5 地點：{{ concert.location }}
              b-card-text.information {{ concert.description }}
            b-card-footer.d-flex.justify-content-end.p-0
              b-button.mt-3(variant="info" @click.prevent="bookTicket(concert._id)") 訂票
</template>

<script>
import API from '../api'
import { handleError, handleWarning } from '../utils/errorHandler'

export default {
  name: 'Concert',
  data () {
    return {
      concerts: [],
      loading: false
    }
  },
  computed: {
    user () {
      return this.$store.state.user
    }
  },
  methods: {
    bookTicket (id) {
      if (this.user.id.length === 0) {
        handleWarning('請先登入才能訂票', this)
      } else {
        this.$store.commit('bookTicket', id)
        this.$router.push('/tickets')
      }
    },
    onhover(index) {
      let information = document.querySelectorAll('.information')
      information[index].classList.replace('none', 'block')
    },
    onMouseleave(index) {
      let information = document.querySelectorAll('.information')
      information[index].classList.replace('block', 'none')
    }
  },
  mounted () {
    this.loading = true
    this.axios.get(API.concert.list)
      .then(res => {
        if (res.data.success) {
          this.concerts = res.data.result
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
#concert .card {
  height: 300px;
  background: none;
}
#concert .card-body {
  height: 300px;
  background: rgba(0,0,0,0.5);
}
#concert .card-body .content{
  height: 160px;
  padding: 5%;
  background: rgba(0,0,0,0.5);
  text-shadow: 0 0 10px rgba(0,255,255,1), 0 0 20px rgba(0,255,255,0.8), 0 0 40px rgba(0,255,255,0.5);
}
#concert .card-footer {
  background: none;
}
.none {
  display: none;
}
.block {
  display: block;
}
.text-cyan {
  color: cyan;
}
</style>
