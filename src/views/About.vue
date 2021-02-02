<template lang="pug">
  #about.mt-6.text-white
    b-container.pt-3
      h2.my-5.h2 關於琴音部 
      b-row#CYB
        b-col(cols='12')
          b-card(img-src="../../004.jpg" no-body).bg
            b-card-body.card-img-overlay.d-flex.justify-content-center.align-items-center
              b-card-text.letter-spacing.w50.pd {{ about }}
      h2.my-5.h2 成員介紹
      b-row#member.mb-3.mt
        b-col(cols="12" lg="4" v-for="member in members" :key="member._id" :id="member.memberName")
          b-card.mt-2.text-black.h-100
            div.image
              b-img(:src="member.image").img-fluid.rounded-circle
            b-card-body.mt-6
              h3 {{ member.memberName }}
              p {{ member.aboutMember }}
      h2.my-5.h2 聯絡我們
      b-row.d-flex.align-items-center.mb-5
        b-col(cols="12" lg="4").my-1
          b-button.facebook-btn(@click="toFacebook()")
            font-awesome-icon.facebook(:icon="['fab', 'facebook']" size="lg")
            p.d-inline.ml-3.fz  琴音部(台湾の軽音部)
        b-col(cols="12" lg="3").my-1
          font-awesome-icon.icon-mt(:icon="['fas', 'envelope']" size="lg")
          p.d-inline.ml-3.fz {{ connections.email }}
        b-col(cols="12" lg="2").my-1
          font-awesome-icon.icon-mt(:icon="['fas', 'phone-alt']" size="lg")
          p.d-inline.ml-3.fz {{ connections.phone }}
        b-col(cols="12" lg="3").my-1
          font-awesome-icon.icon-mt(:icon="['fab', 'instagram']" size="lg")
          p.d-inline.ml-3.fz {{ connections.instagram }}
</template>

<script>
export default {
  name: 'About',
  data () {
    return {
      connections: [],
      about: '',
      members: []
    }
  },
  methods: {
    toFacebook() {
      window.open(this.connections.facebook, '_blank')
    }
  },
  mounted () {
    this.axios.get(process.env.VUE_APP_API + '/about/')
      .then(res => {
        if (res.data.success) {
          this.about = res.data.result[0].about
        }
      })
      .catch(err => {
        this.$swal({
          icon: 'error',
          title: '錯誤',
          text: err.response.data.message
        })
      })
    this.axios.get(process.env.VUE_APP_API + '/member/about')
      .then(res => {
        if (res.data.success) {
          this.members = res.data.result
          this.members.map(member => {
            member.image = process.env.VUE_APP_API + '/member/file/' + member.file
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
    this.axios.get(process.env.VUE_APP_API + '/connection/connectUs')
      .then(res => {
        if (res.data.success) {
          this.connections = res.data.result[0]
        }
      })
  }
}
</script>

<style>
#about #menu {
  width: 150px;
  margin: 10% 0 0 1%;
}
.font-24{
  font-size: 24px;
}
#about .image {
  width: 150px;
  height: 150px;
  position: absolute;
  top: 0;
  left: 50%;
  transform: translate(-50%, -50%);
}
.text-black {
  color: black;
}
#member .card-body {
  position: relative;
}
#member img {
  min-height: 150px;
}
.letter-spacing {
  line-height: 2rem;
}
.mt {
  margin-top: 100px;
}
.facebook {
  border-radius: 50%;
  color:#395185;
  background: radial-gradient(#fff 66%, rgba(255,255,255,0) 66%, rgba(255,255,255,0));
  margin-bottom: 3px;
}
.bg {
  background: none;
  border-color: cyan;
  box-shadow: inset 0 0 10px rgba(0,255,255,1);
}
#CYB .card-body {
  background: rgba(0,0,0,0.5);
}
#CYB .card-body p {
  text-shadow: 0 0 10px rgba(0,255,255,1), 0 0 20px rgba(0,255,255,0.8), 0 0 40px rgba(0,255,255,0.5);
}
@media (max-width: 991px) {
  #member .card {
    margin-top: 120px !important;
  }
  .mb {
    margin-bottom: 0;
  }
}
@media (min-width: 992px) {
  #about .pd {
    padding: 5rem !important;
  }
  #about .w50 {
    width: 50% !important;
  }
}
#about .pd {
  padding: 0;
}
#about .w50 {
  width: 75%;
}
</style>
