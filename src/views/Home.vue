<template>
  <div class="play-biketag vld-parent">
    <div class="play-screen__label-group-top">
      <bike-tag-header />
    </div>
    <loading v-if="tagIsLoading" v-model:active="tagIsLoading" :is-full-page="false">
      <img class="spinner" src="@/assets/images/SpinningBikeV1.svg" />
    </loading>
    <div :class="`${tagIsLoading ? 'tag-hidden' : ''}`">
      <!-- Image and Number -->
      <div v-if="tagnumber" class="m-4 mt-5 tag-screen">
        <bike-tag id="the-tag" :tag="tag" image-size="l" />
      </div>
      <div v-else class="mb-5">
        <div class="play-screen__mystery-player">
          <bike-tag-button
            variant="medium"
            class="play-screen__mystery-player__button"
            :text="getCurrentBikeTag?.mysteryPlayer"
            @click="$router.push('/player/' + encodeURIComponent(getCurrentBikeTag?.mysteryPlayer))"
          />
        </div>
        <div v-if="getCurrentBikeTag" class="rel play-screen">
          <expandable-image
            class="play-screen__image"
            :source="getImgurImageSized(getCurrentBikeTag?.mysteryImageUrl, 'l')"
            :full-source="getCurrentBikeTag?.mysteryImageUrl"
            :alt="getCurrentBikeTag?.hint"
            @loaded="tagImageLoaded"
          />

          <bike-tag-button
            class="play-screen__label-group-number"
            :text="'#' + getCurrentBikeTag?.tagnumber"
          />
          <div class="play-screen__label-group-bottom">
            <div>
              <bike-tag-label
                id="mystery-label"
                :text="$t('menu.mysterylocation')"
                :only-text="true"
              />
            </div>
          </div>
        </div>
        <div v-else>
          <span>{{ $t('pages.play.game_not_exists') }}</span>
          <span>{{ $t('pages.play.send_hello_email') }}</span>
        </div>
      </div>
    </div>
    <bike-tag-footer
      class="bike-tag-footer"
      :variant="`${tagnumber ? 'single' : 'current'}`"
      :tag="tag"
      @next="goNextSingle"
      @previous="goPreviousSingle"
    />
  </div>
</template>
<script>
import { defineComponent } from 'vue'
import { mapGetters } from 'vuex'
import Loading from 'vue-loading-overlay'
import 'vue-loading-overlay/dist/vue-loading.css'
import BikeTag from '@/components/BikeTag.vue'
import BikeTagHeader from '@/components/BikeTagHeader.vue'
import BikeTagFooter from '@/components/BikeTagFooter.vue'
import BikeTagLabel from '@/components/BikeTagLabel.vue'
import BikeTagButton from '@/components/BikeTagButton.vue'
import ExpandableImage from '@/components/ExpandableImage.vue'
// import useSWRV from 'swrv'

export default defineComponent({
  name: 'HomeView',
  components: {
    Loading,
    BikeTag,
    BikeTagHeader,
    BikeTagFooter,
    BikeTagButton,
    BikeTagLabel,
    ExpandableImage,
  },
  data() {
    // const { data, error } = useSWRV('/api/game', this.$store.dispatch('setGame'), {})
    // console.log({ data, error })

    return {
      tagnumber: this.$route.params?.tagnumber?.length ? parseInt(this.$route.params.tagnumber) : 0,
      tagIsLoading: true,
    }
  },
  computed: {
    ...mapGetters([
      'getCurrentBikeTag',
      'getTags',
      'getGame',
      'getGameName',
      'getPlayers',
      'getImgurImageSized',
    ]),
    tag() {
      if (this.tagnumber !== 0) {
        const tag = this.getTags?.filter((t) => t.tagnumber === this.tagnumber)
        return tag && tag.length ? tag[0] : {}
      }
      return undefined
    },
  },
  mounted() {
    this.tagIsLoading = this.tagnumber === 0
  },
  methods: {
    tagImageLoaded() {
      this.tagIsLoading = false
    },
    getPlayer(playerName) {
      const playerList =
        this.getPlayers?.filter((player) => {
          return decodeURIComponent(encodeURIComponent(player.name)) == playerName
        }) ?? []
      return playerList[0]
    },
    goNextSingle() {
      this.tagnumber++
      if (this.tagnumber === this.getCurrentBikeTag.tagnumber) {
        this.tagnumber = 0
      } else {
        this.$router.push(`/${this.tagnumber}`)
      }
    },
    goPreviousSingle() {
      this.tagnumber = this.tagnumber > 0 ? this.tagnumber : this.getCurrentBikeTag.tagnumber
      this.tagnumber--
      this.$router.push(`/${this.tagnumber}`)
    },
  },
})
</script>
<style lang="scss">
@import '../assets/styles/style';

.tag-hidden {
  margin-top: -350px;
  visibility: hidden;
  opacity: 0.1;
  height: 400px;
}

.play-screen {
  position: relative;
  width: 80vw;
  max-width: 750px;
  max-height: 70vh;
  height: auto;
  margin: auto;

  // @media (max-width: $breakpoint-mobile-lg) {
  //   width: 100vw;
  // }

  &__mystery-player {
    position: relative;
    z-index: 1;

    &__button {
      margin-top: -40px;
      bottom: -40px;
      position: relative;
      width: 80%;
      max-width: 25em;
    }
  }

  &__image {
    width: 80vw;
    max-width: 750px;
    max-height: 70vh;
    height: auto;
    margin: auto;
    box-shadow: 0 1px 3px rgb(0 0 0 / 12%), 0 1px 2px rgb(0 0 0 / 24%);

    &.expanded {
      max-width: unset;
      max-height: unset;
    }

    // @media (max-width: $breakpoint-mobile-lg) {
    //   width: 100vw;
    // }
  }

  &__label-group {
    &-number {
      position: absolute;
      top: -3%;
      left: 0;

      // line-height: 1rem !important;
      min-width: 1rem;
      @media (min-width: $breakpoint-tablet) {
        top: 0;
        min-width: 8rem;
      }
    }

    &-top {
      margin-bottom: -1.25rem;
      z-index: 1;
      position: relative;
    }

    &-bottom {
      position: absolute;
      bottom: -3.5rem;
      display: flex;
      flex-direction: column;
      width: 100%;

      &-number {
        margin-bottom: -2.5rem;
        z-index: 2;
      }
    }
  }
}

.bike-tag-footer {
  margin-top: 4rem;
}

.play-biketag {
  margin: auto;
}

.camera-modal {
  background: transparent;

  .modal-content {
    background: none;
    border: none;
  }

  //   &-top {
  //     display: flex;
  //     padding: 0;
  //     justify-content: space-around;

  //     &__mystery {
  //       min-height: auto !important;
  //     }
  //   }

  //   &-bottom {
  //     display: flex;
  //     flex-direction: column;
  //     justify-content: center;
  //     align-items: center;

  //     &__underline {
  //       width: auto;
  //       height: 3rem;
  //     }

  //     &__hint {
  //       margin-top: 1rem;
  //       font-size: 2rem;
  //       font-family: $default-secondary-font-family;
  //       text-align: center;
  //     }
  //   }

  //   &-line-divide {
  //     width: 90%;
  //     height: 1px;
  //     margin: auto;
  //     background: linear-gradient(45deg, rgb(100 100 100 / 80%), rgb(150 150 150 / 50%) 70.71%);
  //   }

  //   &-body {
  //     padding-bottom: 0;
  //   }

  //   .flash {
  //     opacity: 1;
  //     animation: flash 1s;
  //   }
  //   @-webkit-keyframes flash {
  //     0% {
  //       opacity: 0.3;
  //     }
  //     100% {
  //       opacity: 1;
  //     }
  //   }
  //   @keyframes flash {
  //     0% {
  //       opacity: 0.3;
  //     }
  //     100% {
  //       opacity: 1;
  //     }
  //   }
}
</style>
