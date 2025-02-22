<template>
  <div class="container align-center">
    <bike-tag-queue :pagination-ref="controlledSwiper" />
  </div>
  <div class="container queue-view">
    <swiper
      :modules="[Controller]"
      :pagination="{}"
      :effect="'coverflow'"
      :grab-cursor="true"
      :centered-slides="true"
      :slides-per-view="1"
      :coverflow-effect="{
        rotate: 50,
        stretch: 0,
        depth: 100,
        modifier: 1,
        slideShadows: true,
      }"
      :space-between="10"
      @swiper="setControlledSwiper"
    >
      <swiper-slide v-for="(tag, index) in getQueuedTags" :key="index">
        <bike-tag
          :key="tag.tagnumber"
          :tag="tag"
          size="l"
          :mystery-image-url="''"
          :found-tagnumber="tag.mysteryImageUrl ? tag.tagnumber - 1 : tag.tagnumber"
          :found-description="stringifyNumber(index + 1)"
        />
      </swiper-slide>
    </swiper>
    <div class="container align-center">
      <bike-tag-button
        v-if="showGoNextButton"
        class="go-next-button"
        variant="medium"
        :text="goNextQueueStepButtonText"
        @click="goNextQueueStep"
      />
    </div>
  </div>
</template>

<script>
import { defineComponent, ref } from 'vue'
import { mapGetters } from 'vuex'
import SwiperCore, { Controller, Pagination } from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/vue'
import 'swiper/css/bundle'
import { stringifyNumber } from '@/common/utils'
import BikeTag from '@/components/BikeTag.vue'
import BikeTagQueue from '@/components/BikeTagQueue.vue'
import { BiketagFormSteps } from '@/common/types'
import BikeTagButton from '@/components/BikeTagButton.vue'

SwiperCore.use([Pagination])

export default defineComponent({
  name: 'QueueView',
  components: {
    Swiper,
    SwiperSlide,
    BikeTag,
    BikeTagQueue,
    BikeTagButton,
  },
  setup() {
    const controlledSwiper = ref(null)
    const setControlledSwiper = (swiper) => {
      controlledSwiper.value = swiper
    }

    return {
      Controller,
      controlledSwiper,
      setControlledSwiper,
    }
  },
  computed: {
    ...mapGetters(['getQueuedTags', 'getPlayerTag', 'getCurrentBikeTag', 'getQueuedTagState']),
    goNextQueueStepButtonText() {
      return `${
        this.getPlayerTag?.mysteryImageUrl?.length > 0
          ? this.$t('pages.round.submit_queue')
          : this.getPlayerTag?.foundImageUrl?.length > 0
          ? this.$t('pages.round.complete_queue')
          : this.$t('pages.round.join_queue')
      } #${this.getCurrentBikeTag?.tagnumber ?? 1}!`
    },
    showGoNextButton() {
      return this.getQueuedTagState !== BiketagFormSteps.roundPosted
    },
  },
  methods: {
    stringifyNumber,
    goNextQueueStep: function () {
      this.$router.push('/play')
    },
  },
})
</script>
<style lang="scss">
#app {
  .queue-view {
    .card {
      .tag-number {
        display: none;
      }

      .player-name {
        line-height: 75%;
      }

      &.polaroid.found-tag {
        margin-top: -175px;
        padding-top: 175px;
        transform: rotate(-1deg);
      }

      &.polaroid.mystery-tag {
        transform: rotate(1deg);
      }
    }

    .container.align-center {
      flex-flow: wrap;
    }

    .go-next-button span {
      min-width: 10em;
    }

    .swiper-pagination {
      display: none;
    }
  }
}
</style>
<style scoped>
i {
  color: #000;
  font-size: 20px;
}
</style>
