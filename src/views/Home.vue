<template lang="pug">
  #home.mt-6
    b-container.pt-2
      b-row
        b-col(cols="12").mx-auto
          b-carousel#carousel-1(v-model='slide' :interval='4000' controls indicators background='#ababab' img-width='600' img-height='300' style='text-shadow: 1px 1px 2px #333;' @sliding-start='onSlideStart' @sliding-end='onSlideEnd')
            b-carousel-slide.img-fluid(v-for="image in file.images" :caption="image.title" :img-src="image.src")
      b-row.mt-3.my-2
        h2.col-12.text-white.h2.my-5 表演影片
        b-col.my-5(cols="12" lg="4" v-for="film in file.films" :key="film._id")
          b-card.p-0
            b-embed(type="iframe" aspect="16by9" :src="film.film" allowfullscreen)
            b-card-text.mt-2 {{ film.title }}
</template>

<script>
export default {
  data () {
    return {
      slide: 0,
      sliding: null,
      file: {
        films: {},
        images: {
          0: {
            _id: '5ff7b1c99f8fdc055c3388c3',
            src: 'https://venturebeat.com/wp-content/uploads/2014/10/loading_desktop_by_brianmccumber-d41z4h6.gif?w=1200&strip=all',
            title: ''
          }
        }
      }
    }
  },
  methods: {
    onSlideStart (slide) {
      this.sliding = true
    },
    onSlideEnd (slide) {
      this.sliding = false
    }
  },
  mounted () {
    this.axios.get(process.env.VUE_APP_API + '/home/getFile')
      .then(res => {
        if (res.data.success) {
          const image = []
          const film = []
          res.data.result.map(file => {
            if (file.file === undefined) {
              film.push(file)
              this.file.films = film
            } else {
              image.push(file)
              this.file.images = image
              this.file.images.map(image => {
                image.src = process.env.VUE_APP_API + '/home/img/' + image.file
              })
            }
          })
        }
      })
  }
}
</script>

<style>
body{
  background: var(--dark);
  transition:all 1s;
}
.mt-6{
  margin-top: 4rem;
}
#home .card {
  min-height: 300px;
}
#carousel-1,
.carousel-inner {
  width: 100%;
  height: 100%;
}
</style>
