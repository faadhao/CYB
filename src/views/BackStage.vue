<template lang="pug">
  #backstage.mt-6
    b-container
      b-row
        b-col(cols="12" lg="3").mt-3.mx-auto
          b-nav(pills).flex-lg-column.bg-light.rounded-lg
            b-nav-item-dropdown.flex-fill(text="首頁管理")
              b-dropdown-item(@click="edit('carousel')") 輪播圖
              b-dropdown-item(@click="edit('film')") 影片連結
            b-nav-item-dropdown.flex-fill(text="關於我們")
              b-dropdown-item(@click="edit('cyb')") 琴音部
              b-dropdown-item(@click="edit('members')") 成員
              b-dropdown-item(@click="edit('connection')") 聯絡資訊
            b-nav-item-dropdown.flex-fill(text="售票系統")
              b-dropdown-item(@click="edit('tickets')") 票券管理
              b-dropdown-item(@click="edit('sold')") 售出票券
            b-nav-item.flex-fill(@click="edit('concert')") 表演資訊
            b-nav-item.flex-fill(@click="edit('users')") 會員管理
        b-col#carousel(cols="10" lg="9").d-block.my-3.bg-light.rounded-lg.mx-auto
          div.d-flex.justify-content-end.mt-3
            h3.flex-fill 輪播圖
            b-button(variant="primary" size="sm" v-b-modal.newCarousel) 新增
          b-row
            b-col(cols="6" lg="4" v-for="image in files.images" :key="image._id").d-flex.my-3.flex-wrap.justify-content-end
              img(:src="image.src" width="650").flex-fill.img-fluid
              b-form-input(v-model="image.model" placeholder="輪播圖文字 (可不填)").my-2
              b-button(variant="success" @click="save('carousel', null, image.model, image._id)" size="sm") 儲存
              b-button.ml-2(@click="cancel()" size="sm") 取消
              b-button(variant="danger" @click="deletee('home', image._id)" size="sm").ml-2 刪除
          b-modal#newCarousel
            template(#modal-header='{ close }')
              h3 新增輪播圖
              b-button(variant="light" @click="close()") 
                font-awesome-icon(:icon="['far', 'times-circle']")
            template(#default='{ hide }')
              b-form(@submit.prevent="newcarousel()" @reset="onReset('carousel')")
                img-inputer.mx-auto(v-model="image" placeholder="請選擇圖片" bottom-text="點擊或拖曳更換圖片" :max-size="1024" exceedSizeText="檔案大小不能超過 1MB"  accept="image/*")
                b-form-group#input-group-3(label="輪播圖文字" label-for="input-3")
                  b-form-textarea#input-3(v-model="newCarousel.title" placeholder="請輸入輪播圖文字...(可不填)")
                b-button.mr-1(type="submit" variant="primary") 送出
                b-button(type="reset") 重填
            template(#modal-footer='{ ok, cancel, hide }')
              h6.mr-auto &nbsp;
        b-col#film(cols="10" lg="9").p-0.bg-light.rounded-lg.d-none.mx-auto.my-3
          div.d-flex.justify-content-end.mt-3.mx-3
            h3.flex-fill 影片管理
            b-button(variant="primary" v-if="files.films.length < 3" v-b-modal.newFilm) 新增影片
          b-col(cols="10" v-for="film in files.films" :key="film._id").mx-auto.my-3
            b-form-input(v-model="film.film").my-3
            b-form-textarea(v-model="film.title").my-3
            b-button(variant="success" @click="save('film', null, film.model, film._id)") 儲存
            b-button.ml-2(@click="cancel()") 取消
            b-button(variant="danger" @click="deletee('home', film._id)").ml-2 刪除
          b-modal#newFilm
            template(#modal-header='{ close }')
              h3 新增輪播圖
              b-button(variant="light" @click="close()") 
                font-awesome-icon(:icon="['far', 'times-circle']")
            template(#default='{ hide }')
              b-form(@submit.prevent="newfilm(newFilm)" @reset="onReset('film')")
                b-form-group#input-group-4(label="影片網址" label-for="input-4")
                  b-form-input#input-4(v-model="newFilm.film" placeholder="請輸入影片網址...")
                b-form-group#input-group-5(label="文字" label-for="input-5")
                  b-form-textarea#input-5(v-model="newFilm.title" placeholder="請輸入文字...(可不填)")
                b-button.mr-1(type="submit" variant="primary") 送出
                b-button(type="reset") 重填
            template(#modal-footer='{ ok, cancel, hide }')
              h6.mr-auto &nbsp;
        b-col#cyb(cols="10" lg="9").p-0.bg-light.rounded-lg.d-none.mx-auto.mt-3
          h3.mt-3.ml-3 琴音部
          div.mx-4
            b-form-textarea.my-3(rows="8" v-model="about.cyb.aboutModel")
            div.my-3.mx-2.d-flex.justify-content-end
              b-button(variant="success" @click="save('about', 'cyb', about.cyb.aboutModel)" size="sm") 儲存
              b-button(@click="cancel('cyb')" size="sm").ml-2 取消
        b-col#members(cols="10" lg="9").p-0.bg-light.rounded-lg.d-none.mx-auto.my-3
          div.d-flex.justify-content-end.mt-3.mx-3
            h3.flex-fill 成員
            b-button(variant="primary" size="sm" v-b-modal.newMember) 新增
          b-col(cols="12" v-for="(member, index) in about.members" :key="member._id")
            b-card(:img-src="member.image" :img-alt="member.memberName" img-width="190" img-left no-body).my-3
              b-card-body
                b-form-input(v-model="member.nameModel")
                b-form-textarea(v-model="member.aboutModel" rows="5").mt-1
                div.d-flex.justify-content-end
                  b-button(variant="success" size="sm" @click="save('about', 'member', member, member._id)").mt-2 儲存
                  b-button(variant="danger" size="sm" @click="deletee('member', member._id)").ml-2.mt-2 刪除
                  b-button( size="sm" @click="cancel()").ml-2.mt-2 取消
          b-modal#newMember
            template(#modal-header='{ close }')
              h3 新增成員資料
              b-button(variant="light" @click="close()") 
                font-awesome-icon(:icon="['far', 'times-circle']")
            template(#default='{ hide }')
              b-form(@submit.prevent="newmember()" @reset="onReset('member')")
                img-inputer.mx-auto(v-model="image" placeholder="請選擇圖片" bottom-text="點擊或拖曳更換圖片" :max-size="1024" exceedSizeText="檔案大小不能超過 1MB" accept="image/*")
                b-form-group#input-group-1(label="成員姓名" label-for="input-1" :state="nameState" descritpion="請輸入成員姓名" invalid-feedback="格式不符")
                  b-form-input#input-1(v-model="newMember.memberName" placeholder="請輸入成員姓名..."  :state="nameState")
                b-form-group#input-group-2(label="成員簡介" label-for="input-2" :state="aboutState" descritpion="請輸入成員簡介" invalid-feedback="格式不符")
                  b-form-textarea#input-2(v-model="newMember.aboutMember" placeholder="請輸入成員簡介..." :state="aboutState")
                b-button.mr-1(type="submit" variant="primary") 送出
                b-button(type="reset") 重填
            template(#modal-footer='{ ok, cancel, hide }')
              h6.mr-auto &nbsp;
        b-col#concert(cols="10" lg="9").p-0.bg-light.rounded-lg.d-none.mx-auto.my-3
          div.d-flex.justify-content-end.mx-4.mt-3
            h3.flex-fill 表演資訊
            b-button(variant="primary" v-b-modal.newConcert) 新增
          b-col(cols="10" v-for="(concert, index) in concerts" :key="concert._id").mx-auto.p-2
              b-form-input(v-model="concert.model.title").mt-2
              b-form-input(v-model="concert.model.time").mt-2
              b-form-input(v-model="concert.model.location").mt-2
              b-form-textarea(v-model="concert.model.description").mt-2
              div.d-flex.justify-content-end
                b-button(variant="success" size="sm" @click="save('concert', null, concert.model, concert._id)").my-2.ml-2 儲存
                b-button(size="sm" @click="cancel()").my-2.ml-2 取消
                b-button(variant="danger" size="sm" @click="deletee('concert', concert._id)").my-2.ml-2 刪除
          b-modal#newConcert
            template(#modal-header='{ close }')
              h3 新增表演場次
              b-button(variant="light" @click="close()") 
                font-awesome-icon(:icon="['far', 'times-circle']")
            template(#default='{ hide }')
              b-form(@submit.prevent="newconcert(newConcert)" @reset="onReset('concert')")
                b-form-group#input-title(label="標題" label-for="title" descritpion="請輸入標題")
                  b-form-input#title(v-model="newConcert.title" placeholder="請輸入標題...")
                b-form-group#input-time(label="時間" label-for="time" descritpion="請輸入時間")
                  b-form-input#time(v-model="newConcert.time" placeholder="請輸入時間 (yyyy/mm/dd,hh:mm)")
                b-form-group#input-location(label="地點" label-for="location" descritpion="請輸入地點")
                  b-form-input#location(v-model="newConcert.location" placeholder="請輸入地點...")
                b-form-group#input-description(label="演出說明" label-for="description")
                  b-form-textarea#description(v-model="newConcert.description" placeholder="請輸入演出說明...")
                b-button.mr-1(type="submit" variant="primary") 送出
                b-button(type="reset") 重填
            template(#modal-footer='{ ok, cancel, hide }')
              h6.mr-auto &nbsp;
        b-col#connection(cols="10" lg="9").p-0.bg-light.rounded-lg.d-none.mx-auto.mt-3
          h3.mt-3.ml-3 聯絡資訊
          div.my-3.mx-5
            font-awesome-icon(:icon="['fab', 'facebook']" style="color:#395185").mr-2
            label(for="facebook") Facebook
            b-form-input#facebook(v-model="connection.model.facebook").mb-1
            font-awesome-icon(:icon="['fab', 'instagram']").mr-2
            label(for="instagram") Instagram
            b-form-input#instagram(v-model="connection.model.instagram").mb-1
            font-awesome-icon(:icon="['fas', 'envelope']").mr-2
            label(for="email") e-mail
            b-form-input#email(v-model="connection.model.email").mb-1
            font-awesome-icon(:icon="['fas', 'phone-alt']").mr-2
            label(for="phone") 電話
            b-form-input#phone(v-model="connection.model.phone").mb-2
            div.d-flex.justify-content-end
              b-button(variant="success" size="sm" @click="save('connection', null, connection.model, connection._id)") 儲存
              b-button(size="sm" @click="cancel()").ml-2 取消
        b-col#tickets(cols="10" lg="9").p-0.bg-light.rounded-lg.d-none.mx-auto.my-3
            div.d-flex.justify-content-end.mx-3.my-3
              h3.flex-fill 票券管理
              b-button(variant="primary" v-b-modal.newTicket) 新增
            b-col(cols="12" v-for="ticket in tickets" :key="ticket._id").mx-auto
              b-table-simple(small)
                b-tr
                  b-th(variant="primary") 表演場次
                  b-th(variant="success") 票價
                  b-th(variant="warning") 座位數
                b-tr
                  b-td(variant="primary")
                    b-form-input(v-model="ticket.model.title")
                  b-td(variant="success")
                    b-form-input(v-model="ticket.model.price")
                  b-td(variant="warning")
                    b-form-spinbutton(v-model="ticket.model.seats")
                b-tr
                  b-td(colspan="3" align="end" variant="info")
                    b-button(variant="success" size="sm" @click="save('ticket', null, ticket.model, ticket._id)").ml-2 儲存
                    b-button(size="sm" @click="cancel()").ml-2 取消
                    b-button(variant="danger" size="sm" @click="deletee('ticket', ticket._id)").ml-2 刪除
            b-modal#newTicket
              template(#modal-header='{ close }')
                h3 新增票券
                b-button(variant="light" @click="close()") 
                  font-awesome-icon(:icon="['far', 'times-circle']")
              template(#default='{ hide }')
                b-form(@submit.prevent="newticket(selected, newTicket)" @reset="onReset('ticket')")
                  b-form-group#input-title(label="場次" label-for="title" descritpion="請選擇場次")
                    b-form-select#title(v-model="selected")
                      b-form-select-option(v-for="option in options" :value="option.value") {{ option.text }}
                  b-form-group#input-price(label="票價" label-for="price" descritpion="請輸入票價")
                    b-form-input#price(v-model="newTicket.price" placeholder="請輸入票價...")
                  b-form-group#input-seat(label="座位數" label-for="seat" descritpion="請輸入座位數")
                    b-form-input#seat(v-model="newTicket.seat" placeholder="請輸入座位數...")
                  b-button.mr-1(type="submit" variant="primary") 送出
                  b-button(type="reset") 重填
              template(#modal-footer='{ ok, cancel, hide }')
                h6.mr-auto &nbsp;
        b-col#users(cols="10" lg="9").bg-light.rounded-lg.d-none.mx-auto.my-3
          h3.ml-3.my-3 會員管理
          div.mx-5.my-3
            h6 會員查詢:
            b-form-input.w-50.d-inline.ml-3(v-model="userID" placeholder="輸入會員編號...")
            b-button.ml-2.mb-2(variant="primary" size="sm" @click="search(userID)") 查詢
            p.mt-3 會員編號：{{ user.id }}
            p 會員姓名：{{ user.name }}
            p.d-inline 禁言狀態：
            b-form-select.w-25(v-model="user.messageAble" :options="[{value: true, text: '未禁言'},{value: false, text: '禁言'}]")
            b-button.ml-2(variant="success" size="sm" @click="save('user', null, user.messageAble, user.id)") 儲存
        b-col#sold(cols="10" lg="9").bg-light.rounded-lg.d-none.mx-auto.my-3
          h3.my-3 售出票券
          b-col(cols="11")
            b-form-select(v-model="selected").w-25
              b-form-select-option(v-for="option in options" :value="option.value") {{ option.text }}
            b-button(variant="success" size="sm" @click="Sold(selected.id, selected.title)").ml-2 查看
            b-table-simple.mt-2(small)
              b-tr
                b-th(variant="primary") 會員姓名
                b-th(variant="info") 張數
                b-th(variant="warning") 付款狀態
              b-tr(v-for="user in sold" :key="user.id")
                b-td(variant="primary") {{ user.name }}
                b-td(variant="info") {{ user.quantity }}
                b-td(:variant="user.variant") {{ user.paid }}
</template>

<script>
export default {
  name: 'BackStage',
  data() {
    return {
      about: {
        cyb: {
          about: '',
          aboutModel: ''
        },
        members: []
      },
      newMember: {
        memberName: '',
        aboutMember: ''
      },
      image: null,
      concerts: {},
      newConcert: {
        title: '',
        time: '',
        location: '',
        description: ''
      },
      connection: {
        facebook: '',
        email: '',
        phone: '',
        instagram: '',
        model: {
          facebook: '',
          email: '',
          phone: '',
          instagram: ''
        }
      },
      files: {
        films: {},
        images: {
          image: '',
          model: ''
        }
      },
      newCarousel: {
        title: ''
      },
      newFilm: {
        film: '',
        title: ''
      },
      selected: {id: null, title: "請選擇場次"},
      options: [
        {value: {id: null, title: "請選擇場次"}, text: "請選擇場次"}
      ],
      newTicket: {
        price: '',
        seat: ''
      },
      tickets: {},
      userID: '',
      user: {
        id: '',
        name: '',
        messageAble: ''
      },
      sold: {},
      title: ''
    }
  },
  computed: {
    nameState() {
      if (this.newMember.memberName.length === 0) {
        return false
      } else {
        return true
      }
    },
    aboutState() {
      if (this.newMember.aboutMember.length === 0) {
        return false
      } else {
        return true
      }
    }
  },
  methods: {
    cancel(model) {
      if (model === 'cyb') {
        this.about.cyb.aboutModel = this.about.cyb.about
      } else {
        location.reload()
      }
    },
    save(model, object, data, id) {
      if (model === 'about' && object === 'cyb') {
        this.axios.patch(process.env.VUE_APP_API + '/about/' + this.about.cyb.id, { about: data })
          .then(res => {
            if (res.data.success) {
              this.$swal({
                icon: 'success',
                title: '成功',
                text: '儲存成功'
              })
            }
          })
          .catch(err => {
            if (err.data === undefined) {
              console.log(err)
            } else {
              this.$swal({
                icon: 'error',
                title: '發生錯誤',
                text: err.data.response.message
              })
            }
          })
      } else if (model === 'about' && object === 'member') {
        let datas = {}
        datas = data
        datas.memberName = datas.nameModel
        datas.aboutMember = datas.aboutModel
        delete datas.image
        delete datas.nameModel
        delete datas.aboutModel
        delete datas._id
        this.axios.patch(process.env.VUE_APP_API + '/member/' + id, datas)
          .then(res => {
            if (res.data.success) {
              this.$swal({
                icon: 'success',
                title: '成功',
                text: '編輯成功'
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
      } else if (model === 'concert') {
        this.axios.patch(process.env.VUE_APP_API + '/concert/' + id, data)
          .then(res => {
            if (res.data.success) {
              this.$swal({
                icon: 'success',
                title: '成功',
                text: '編輯完成'
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
      } else if (model === 'connection') {
        this.axios.patch(process.env.VUE_APP_API + '/connection/' + id, data)
          .then(res => {
            if (res.data.success) {
              this.$swal({
                icon: 'success',
                title: '成功',
                text: '編輯成功'
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
      } else if (model === 'carousel') {
        this.axios.patch(process.env.VUE_APP_API + '/home/editImg/' + id, { "title": data })
          .then(res => {
            if (res.data.success) {
              this.$swal({
                icon: 'success',
                title: '成功',
                text: '編輯成功'
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
      } else if (model === 'ticket') {
        this.axios.patch(process.env.VUE_APP_API + '/ticket/' + id, data)
          .then(res => {
            if (res.data.success) {
              this.$swal({
                icon: 'success',
                title: '成功',
                text: '編輯成功'
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
      } else if (model === 'user') {
        data = {messageAble: data}
        this.axios.patch(process.env.VUE_APP_API + '/users/' + id, data)
          .then(res => {
            if (res.data.success) {
              this.user = {
                id: '',
                name: '',
                messageAble: ''
              }
              this.$swal({
                icon: 'success',
                title: '成功',
                text: '修改成功'
              })
            }
          })
      }
    },
    edit(model) {
      let element = document.getElementById(model)
      let block = document.querySelector('.d-block')
      block.classList.replace('d-block', 'd-none')
      element.classList.replace('d-none', 'd-block')
    },
    deletee(model, id) {
      this.axios.delete(process.env.VUE_APP_API + '/' + model + '/' + id )
        .then(res => {
          if (res.data.success) {
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
    newmember() {
      if (this.image.size > 1024 * 1024) {
        this.$swal({
          icon: 'error',
          title: '錯誤',
          text: '圖片太大'
        })
      } else if (!this.image.type.includes('image')) {
        this.$swal({
          icon: 'error',
          title: '錯誤',
          text: '檔案格式錯誤'
        })
      } else {
        const fd = new FormData()
        fd.append('image', this.image)
        fd.append('memberName', this.newMember.memberName)
        fd.append('aboutMember', this.newMember.aboutMember)

        this.axios.post(process.env.VUE_APP_API + '/member/', fd)
          .then(res => {
            if (res.data.success) {
              res.data.result.src = process.env.VUE_APP_API + '/member/file/' + res.data.result.file
              res.data.result.memberName = res.data.result.memberName
              res.data.result.aboutMember = res.data.result.aboutMember
              res.data.result.nameModel = res.data.result.memberName
              res.data.result.aboutModel = res.data.result.aboutMember
              this.about.members.push(res.data.result)

              this.image = null
              this.newMember.memberName = ''
              this.newMember.aboutMember = ''
              location.reload()
            } else {
              this.$swal({
                icon: 'error',
                title: '錯誤',
                text: res.data.message
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
      }
    },
    newconcert(data) {
      if (data.title.length === 0 || data.time.length === 0 || data.location.length === 0 || data.description.length === 0) {
        this.$swal({
          icon: 'error',
          title: '錯誤',
          text: '請確認各欄位不為空白'
        })
      } else {
        this.axios.post(process.env.VUE_APP_API + '/concert/', data)
          .then(res => {
            if (res.data.success) {
              this.$swal({
                icon: 'success',
                title: '成功',
                text: '新增成功'
              })
              this.newConcert.title = ''
              this.newConcert.time = ''
              this.newConcert.location = ''
              this.newConcert.description = ''
              location.reload()
            }
          })
      }
    },
    onReset(model) {
      if (model === 'member') {
        this.image = null
        this.newMember.memberName = ''
        this.newMember.aboutMember = ''
      } else if (model === 'concert') {
        this.newConcert.title = ''
        this.newConcert.time = ''
        this.newConcert.location = ''
        this.newConcert.description = ''
      } else if (model === 'carousel') {
        this.image = null
        this.newCarousel.title = ''
      } else if (model === 'film') {
        this.newFilm = {
          film: '',
          title: ''
        }
      } else if (model === 'ticket') {
        this.newTicket = {
          price: '',
          seat: ''
        }
      }
    },
    newcarousel() {
      if (this.image.size > 1024 * 1024) {
        this.$swal({
          icon: 'error',
          title: '錯誤',
          text: '圖片太大'
        })
      } else if (!this.image.type.includes('image')) {
        this.$swal({
          icon: 'error',
          title: '錯誤',
          text: '檔案格式錯誤'
        })
      } else {
        const fd = new FormData()
        fd.append('image', this.image)
        fd.append('title', this.newCarousel.title)

        this.axios.post(process.env.VUE_APP_API + '/home/img', fd)
          .then(res => {
            if (res.data.success) {
              res.data.result.src = process.env.VUE_APP_API + '/home/img/' + res.data.result.file
              res.data.result.title = res.data.result.title
              res.data.result.model = res.data.result.model
              this.files.images.push(res.data.result)

              this.image = null
              this.newCarousel.title = ''
              location.reload()
            } else {
              this.$swal({
                icon: 'error',
                title: '錯誤',
                text: res.data.message
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
      }
    },
    newfilm(data) {
      if (data.film.length === 0) {
        this.$swal({
          icon: 'error',
          title: '錯誤',
          text: '請輸入影片網址'
        })
      } else {
        this.axios.post(process.env.VUE_APP_API + '/home/film', data)
          .then(res => {
            if (res.data.success) {
              this.$swal({
                icon: 'success',
                title: '成功',
                text: '新增成功'
              })
            } else {
              this.$swal({
                icon: 'error',
                title: '失敗',
                text: res.data.message
              })
            }
            location.reload()
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
    newticket(data1, data2) {
      let ticket = {
        title: data1.title,
        price: parseInt(data2.price),
        seats: parseInt(data2.seat),
        c_id: data1.id
      }
      this.axios.post(process.env.VUE_APP_API + '/ticket/', ticket)
        .then(res => {
          if (res.data.success) {
            this.$swal({
              icon: 'success',
              title: '成功',
              text: '新增成功'
            })
            location.reload()
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
    search(id) {
      if (id.length > 0) {
        this.axios.get(process.env.VUE_APP_API + '/users/find/' + id)
          .then(res => {
            if (res.data.success) {
              this.user = {
                id: res.data.result._id,
                name: res.data.result.userName,
                messageAble: res.data.result.messageAble
              }
              this.userID = ''
            }
          })
      }
    },
    Sold(id, title) {
      this.title = title
      this.axios.get(process.env.VUE_APP_API + '/users/sold/' + id)
        .then(res => {
          if (res.data.success) {
            this.sold = res.data.result
            this.sold.map(user => {
              if (user.paid) {
                user.paid = '已付款'
                user.variant = "success"
              } else {
                user.paid = '未付款'
                user.variant = "danger"
              }
            })
          }
        })
    }
  },
  mounted() {
    this.axios.get(process.env.VUE_APP_API + '/about/')
      .then(res => {
        if (res.data.success) {
          this.about.cyb.about = res.data.result[0].about
          this.about.cyb.aboutModel = res.data.result[0].about
          this.about.cyb.id = res.data.result[0]._id
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
    this.axios.get(process.env.VUE_APP_API + '/member/about')
      .then(res => {
        if (res.data.success) {
          this.about.members = res.data.result
          this.about.members.map(member => {
            member.image = process.env.VUE_APP_API + '/member/file/' + member.file
            member.nameModel = member.memberName
            member.aboutModel = member.aboutMember
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
    this.axios.get(process.env.VUE_APP_API + '/concert/concerts')
      .then(res => {
        if (res.data.success) {
          this.concerts = res.data.result
          this.concerts.map(concert => {
            concert.model = {
              title: concert.title,
              description: concert.description, 
              location: concert.location,
              time: concert.time
            }
            this.options.push({ value: {id: concert._id, title: concert.title}, text: concert.title })
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
    this.axios.get(process.env.VUE_APP_API + '/connection/connectUs')
      .then(res => {
        if (res.data.success) {
          this.connection = res.data.result[0]
          this.connection.model = {
            facebook: res.data.result[0].facebook,
            email: res.data.result[0].email,
            phone: res.data.result[0].phone,
            instagram: res.data.result[0].instagram
          }
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
    this.axios.get(process.env.VUE_APP_API + '/home/getFile')
      .then(res => {
        if (res.data.success) {
          let image = []
          let film = []
          res.data.result.map(file => {
            if (file.file === undefined) {
              film.push(file)
              this.files.films = film
            } else {
              image.push(file)
              this.files.images = image
              this.files.images.map(image => {
                image.src = process.env.VUE_APP_API + '/home/img/' + image.file
                image.model = image.title
              })
            }
          })
        }
      })
    this.axios.get(process.env.VUE_APP_API + '/ticket/tickets')
      .then(res => {
        if (res.data.success) {
          this.tickets = res.data.result
          this.tickets.map(ticket => {
            ticket.model = {
              title: ticket.title,
              price: ticket.price,
              seats: ticket.seats,
              c_id: ticket.c_id._id
            }
          })
        }
      })
  }
}
</script>

<style>
.modal-header,
.modal-footer {
  border: none;
}
.max-height{
  max-height: 280px;
}
#backstage .dropdown-item {
  color: var(--primary);
}
</style>
