<template>
  <div class="add-mystery-tag">
    <b-modal v-model="showModal" title="BootstrapVue" hide-footer hide-header>
      <img class="close-btn" src="@/assets/images/close.svg" @click="hideModal" />
      <h3 class="modal-header">
        {{ $t('You are ') }}{{ ordinalSuffixOf(numberInQueue) }}
        {{ $t('in the current round!') }}
      </h3>
      <bike-tag-button
        class="modal-sub-btn modal-sub-btn--big"
        variant="medium"
        :text="$t('components.queue.view_queue_button')"
        @click="goViewRound"
      />
    </b-modal>
    <!-- <h3 class="queue-title">{{ $t('pages.round.mystery_title') }}</h3> -->
    <div class="title-container">
      <bike-tag-button variant="medium" class="title-q" @click="$refs.file.click()">
        <h3 class="queue-title">{{ $t('components.queue.queue_mystery_title') }}</h3>
      </bike-tag-button>
    </div>
    <div class="preview-container">
      <template v-if="preview">
        <img :src="preview" class="prev-img img-fluid" />
        <img class="img-bck" src="@/assets/images/transparent_img.svg" />
      </template>
      <img
        v-else
        class="img-bck click-me"
        src="@/assets/images/blank_img.svg"
        @click="$refs.file.click()"
      />
      <bike-tag-button
        :class="`click-me icn ${preview ? 'icn--top' : ''}`"
        variant="circle"
        @click="$refs.file.click()"
      >
        <img src="@/assets/images/camera.svg" />
      </bike-tag-button>
    </div>
    <div class="container biketag-tagit-form">
      <form
        ref="mysteryTag"
        name="add-mystery-tag"
        action="add-mystery-tag"
        method="POST"
        data-netlify="true"
        data-netlify-honeypot="bot-field"
        @submit.prevent="onSubmit"
      >
        <input type="hidden" name="form-name" value="add-mystery-tag" />
        <input type="hidden" name="playerId" :value="getPlayerId" />
        <input v-model="mysteryImageUrl" type="hidden" name="mysteryImageUrl" />
        <input
          id="file-upload"
          ref="file"
          type="file"
          class="d-none"
          accept="image/*"
          required
          @change="setImage"
        />
        <p class="queue-text">{{ $t('pages.round.mystery_text') }}</p>
        <div class="mt-3 mb-3 input-container">
          <bike-tag-input
            id="player"
            v-model="player"
            name="player"
            readonly
            :placeholder="$t('pages.round.name_placeholder')"
          />
          <bike-tag-input
            id="hint"
            v-model="hint"
            name="hint"
            :placeholder="$t('pages.round.hint_placeholder')"
          />
        </div>
        <!-- <div class="mt-3">
          <bike-tag-button
            variant="medium"
            :text="`${$t('pages.round.submit_new_tag')} ${$t('pages.round.queue_postfix')}`"
            @click="onSubmit"
          />
        </div> -->
        <bike-tag-button
          variant="medium"
          type="submit"
          :text="`${$t('pages.round.submit_new_tag')} ${$t('pages.round.queue_postfix')}`"
        />
      </form>
    </div>
  </div>
</template>
<script>
import { defineComponent } from 'vue'
import { mapGetters } from 'vuex'
import BikeTagButton from '@/components/BikeTagButton.vue'
import BikeTagInput from '@/components/BikeTagInput.vue'
import { stringifyNumber, ordinalSuffixOf } from '@/common/utils'
import exifr from 'exifr'

export default defineComponent({
  name: 'QueueMysteryTag',
  components: {
    BikeTagButton,
    BikeTagInput,
  },
  props: {
    tag: {
      type: Object,
      default: () => {
        return {}
      },
    },
  },
  emits: ['submit'],
  data: function () {
    return {
      preview: null,
      mysteryImageUrl: null,
      player: '',
      confirmNoHint: false,
      hint: this.tag?.hint ?? '',
      image: this.tag?.mysteryImage,
      showModal: false,
      noLongerNew: false,
    }
  },
  computed: {
    ...mapGetters([
      'getGameName',
      'getPlayerTag',
      'getPlayerId',
      'getCurrentBikeTag',
      'getQueuedTags',
    ]),
    numberInQueue() {
      return this.getQueuedTags?.reduce((o, t, n) => {
        if (t.playerId === this.getPlayerTag?.playerId) {
          o = n + 1
        }
        return o
      }, 0)
    },
  },
  mounted() {
    this.player = this.getPlayerTag?.foundPlayer
    this.showModalIfNew()
  },
  methods: {
    onSubmit(e) {
      e.preventDefault()
      if (!this.image) {
        this.$toast.open({
          message: 'Invalid image, add a new one.',
          type: 'error',
          position: 'top',
        })
        return
      }
      if (!this.hint.length && !this.confirmNoHint) {
        this.confirmNoHint = true
        this.$toast.open({
          message: "You didn't add a hint, but it would sure be nice if you did.",
          type: 'error',
          position: 'top',
        })
        return
      }
      const formAction = this.$refs.mysteryTag.getAttribute('action')
      const formData = new FormData(this.$refs.mysteryTag)
      const mysteryTag = {
        mysteryImage: this.image,
        mysteryPlayer: this.player,
        hint: this.hint ?? '',
        tagnumber: this.getCurrentBikeTag?.tagnumber + 1 ?? 1,
        game: this.getGameName,
      }
      this.noLongerNew = true

      this.$emit('submit', {
        formAction,
        formData,
        tag: mysteryTag,
        storeAction: 'addMysteryTag',
      })
    },
    setImage(event) {
      this.$store.dispatch('fetchCredentials')
      const input = event.target
      if (input.files) {
        try {
          const previewReader = new FileReader()
          previewReader.onload = (e) => {
            this.preview = e.target.result
          }
          previewReader.readAsDataURL(input.files[0])
          if (input.files[0].size / Math.pow(1024, 2) > 15) {
            this.$toast.open({
              message: 'Image exceeds 15mb',
              type: 'error',
              position: 'top',
            })
          } else {
            input.files[0].arrayBuffer().then(async (value) => {
              const results = await exifr.parse(value)
              const createDate = results?.CreateDate ?? results?.DateTimeOriginal ?? Date.now()
              if (createDate < this.getCurrentBikeTag.mysteryTime) {
                this.$toast.open({
                  message: 'Timestamp Error',
                  type: 'error',
                  position: 'top',
                })
              } else {
                this.image = input.files[0]
              }
            })
          }
        } catch (e) {
          console.error(e)
        }
      }
    },
    goViewRound() {
      this.hideModal()
      this.$router.push('/round')
    },
    showModalIfNew() {
      if (!this.getPlayerTag?.mysteryImageUrl?.length) {
        this.showModal = true
      }
    },
    hideModal() {
      this.showModal = false
    },
    stringifyNumber,
    ordinalSuffixOf,
  },
})
</script>
<style lang="scss">
@import '../assets/styles/style';

.modal-header {
  display: flex;
  width: 100%;
  justify-content: center;
  align-items: center;
  margin-top: 1rem;
  font-size: 2rem;
  font-family: $default-font-family;
  @media (min-width: 470px) {
    font-size: 3rem;
  }
}

.modal-sub-btn {
  width: 70%;
  margin: 1rem auto;
  display: flex;
  justify-content: center;
  align-items: center;

  &--big {
    width: 90%;
  }
}

.close-btn,
.go-queue {
  cursor: pointer;
}

.close-btn {
  position: absolute;
  top: 10px;
  right: 10px;
}
</style>
