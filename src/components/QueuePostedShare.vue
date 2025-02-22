<template>
  <b-container class="queue-posted-share">
    <h3 class="queue-title">{{ $t('pages.round.posted_title') }}</h3>
    <p class="queue-text">{{ $t('pages.round.posted_text') }}</p>
    <div>
      <b-tabs nav-item-class="nav-item">
        <b-tab v-if="!!getGame?.subreddit?.length">
          <template #title>
            <img
              v-b-popover.click.blur.top="'Copied!'"
              src="@/assets/images/Reddit.svg"
              class="tab-logo img-fluid"
              @click="copyTabContents(redditPostText)"
            />
          </template>
          <div class="reddit-post">
            <Markdown v-if="supportsReddit && showReddit" :source="redditPostText" linkify="true" />
            <pre v-if="!showReddit">{{ redditPostText }}</pre>
          </div>
        </b-tab>
        <b-tab v-if="!!getGame?.account?.length">
          <template #title>
            <img
              v-b-popover.click.blur.top="'Copied!'"
              src="@/assets/images/Twitter.svg"
              class="tab-logo img-fluid"
              @click="copyTabContents(twitterPostText)"
            />
          </template>
          <div v-if="supportsTwitter && showTwitter" class="twitter-post">
            <Markdown :source="twitterPostText" linkify="true" />
            <pre v-if="!showTwitter">{{ twitterPostText }}</pre>
          </div>
        </b-tab>
        <b-tab v-if="!!getGame?.page?.length">
          <template #title>
            <img
              v-b-popover.click.blur.top="'Copied!'"
              src="@/assets/images/Instagram.svg"
              class="tab-logo img-fluid"
              @click="copyTabContents(instagramPostText)"
            />
          </template>
          <div class="instagram-post">
            <Markdown
              v-if="supportsInstagram && showInstagram"
              :source="instagramPostText"
              linkify="true"
            />
            <pre v-if="!showInstagram">{{ instagramPostText }}</pre>
          </div>
        </b-tab>
      </b-tabs>
      <p v-if="supportsReddit || supportsTwitter || supportsInstagram" class="queue-text">
        {{ $t('pages.round.submit_text') }}
      </p>
      <p v-else class="queue-text">
        {{ $t('pages.round.submit_text_no_autopost') }}
        {{ $t('pages.round.submit_text_manual_social') }}
      </p>

      <form
        ref="submitTag"
        name="post-new-biketag"
        action="post-new-biketag"
        method="POST"
        data-netlify="true"
        data-netlify-honeypot="bot-field"
        @submit.prevent="onSubmit"
      >
        <input type="hidden" name="form-name" value="post-new-biketag" />
        <input type="hidden" name="playerId" :value="getPlayerId" />
        <fieldset v-if="supportsReddit">
          <label for="postToReddit">{{ $t('pages.round.post_to_reddit') }}</label>
          <input
            v-model="postToReddit"
            name="postToReddit"
            type="checkbox"
            @click="showReddit = !showReddit"
          />
        </fieldset>
        <fieldset v-if="supportsTwitter">
          <label for="postToTwitter">{{ $t('pages.round.post_to_twitter') }}</label>
          <input
            v-model="postToTwitter"
            name="postToTwitter"
            type="checkbox"
            @click="showTwitter = !showTwitter"
          />
        </fieldset>
        <fieldset v-if="supportsInstagram">
          <label for="postToInstagram">{{ $t('pages.round.post_to_instagram') }}</label>
          <input
            v-model="postToInstagram"
            name="postToInstagram"
            type="checkbox"
            @click="showInstagram = !showInstagram"
          />
        </fieldset>
        <div class="mt-3 align-center">
          <bike-tag-button
            variant="medium"
            class="mt-2 mb-2 border-0"
            :text="$t('pages.round.post_new_tag')"
            @click="onSubmit"
          />
        </div>
      </form>
    </div>

    <div class="mt-3 align-center">
      <bike-tag-button
        class="border-0"
        :text="`${$t('pages.round.joined_button')} #${getCurrentBikeTag?.tagnumber}`"
        @click="goViewRound"
      />
    </div>
  </b-container>
</template>
<script>
import { defineComponent } from 'vue'
import { mapGetters } from 'vuex'
import Markdown from 'vue3-markdown-it'
import { Settings } from '@/common/types'
import BikeTagButton from '@/components/BikeTagButton.vue'

export default defineComponent({
  name: 'QueueSubmit',
  components: {
    Markdown,
    BikeTagButton,
  },
  emits: ['submit'],
  data() {
    return {
      foundImagePreview: '',
      mysteryImagePreview: '',
      postToReddit: false,
      postToTwitter: false,
      showReddit: false,
      showTwitter: false,
      showInstagram: false,
    }
  },
  computed: {
    ...mapGetters([
      'getQueue',
      'getPlayerTag',
      'getCurrentBikeTag',
      'getPlayerId',
      'getGameName',
      'getGame',
    ]),
    supportsReddit() {
      return !!this.getGame?.settings[Settings.SupportsReddit]
    },
    supportsTwitter() {
      return !!this.getGame?.settings[Settings.SupportsTwitter]
    },
    supportsInstagram() {
      return !!this.getGame?.settings[Settings.SupportsInstagram]
    },
    redditPostText() {
      return `
[#${this.getPlayerTag.tagnumber} tag by ${this.getPlayerTag.foundPlayer}](https://${this.getGameName}.biketag.org/#/${this.getPlayerTag.tagnumber})

Credit goes to ${this.getPlayerTag.foundPlayer} for finding BikeTag [#${this.getCurrentBikeTag.tagnumber}](${this.getCurrentBikeTag.discussionUrl}) that ${this.getCurrentBikeTag.mysteryPlayer} posted!

"[${this.getPlayerTag.foundLocation}](https://${this.getGameName}.biketag.org/#/${this.getCurrentBikeTag.tagnumber})"

See all BikeTags and more, for ${this.getGameName}:

[${this.getGameName}.biketag.org](https://${this.getGameName}.biketag.org) | [Leaderboard](https://${this.getGameName}.biketag.org/leaderboard) | [Rules](https://${this.getGameName}.biketag.org/#howto)
        `
    },
    twitterPostText() {
      return `
  Seattle BikeTag!
  
  This is bike tag number ${this.getPlayerTag.tagnumber} by ${this.getPlayerTag.foundPlayer}.
  Find this mystery location and move the tag to your favorite spot. The latest tag, instructions, and a hint are at [seattle.biketag.org](https://seattle.biketag.org)
  
  #SeattleBikeTag #SeaBikes #BikeSeattle`
    },
    instgramPostText() {
      return `
[#${this.getPlayerTag.tagnumber} tag by ${this.getPlayerTag.foundPlayer}](https://${this.getGameName}biketag.org/#/${this.getPlayerTag.tagnumber})

Credit goes to ${this.getPlayerTag.foundPlayer} for finding BikeTag [#${this.getCurrentBikeTag.tagnumber}](${this.getCurrentBikeTag.discussionUrl}) that ${this.getCurrentBikeTag.mysteryPlayer} posted!

"[${this.getPlayerTag.foundLocation}](https://${this.getGameName}biketag.org/#/${this.getCurrentBikeTag.tagnumber})"

See all BikeTags and more, for ${this.getGameName}:

[${this.getGameName}.biketag.org](https://${this.getGameName}.biketag.org) | [Leaderboard](https://${this.getGameName}.biketag.org/leaderboard) | [Rules](https://${this.getGameName}.biketag.org/#howto)
        `
    },
  },
  mounted() {
    this.postToReddit = this.showReddit = this.supportsReddit
    this.postToTwitter = this.showTwitter = this.supportsTwitter
    this.postToInstagram = this.showInstagram = this.supportsInstagram
  },
  methods: {
    copyTabContents(text) {
      navigator.clipboard.writeText(text)
    },
    goViewRound() {
      this.$router.push('/round')
    },
    onSubmit() {
      const formAction = this.$refs.submitTag.getAttribute('action')
      const formData = new FormData(this.$refs.submitTag)
      const submittedTag = this.getPlayerTag

      submittedTag.discussionUrl = JSON.stringify({
        postToReddit: this.postToReddit,
      })
      submittedTag.mentionUrl = JSON.stringify({
        postToTwitter: this.postToTwitter,
      })
      submittedTag.shareUrl = JSON.stringify({
        postToInstagram: this.postToInstagram,
      })

      formData.append('discussionUrl', submittedTag.discussionUrl)
      formData.append('mentionUrl', submittedTag.mentionUrl)
      // formData.append('shareUrl', submittedTag.shareUrl)

      this.$emit('submit', {
        formAction,
        formData,
        tag: submittedTag,
        storeAction: 'postNewBikeTag',
      })
    },
  },
})
</script>
<style lang="scss">
.queue-posted-share {
  .nav-tabs {
    margin-bottom: -6px;

    .nav-link {
      border-right: none;
      border-left: none;
    }
  }
}
</style>
<style scoped lang="scss">
.queue-posted-share {
  .tab-logo {
    max-width: 2em;
  }

  .reddit-post {
    background-color: white;
    padding: 1em;
    text-align: left;
    margin-bottom: 1em;
  }

  .twitter-post {
    background-color: black;
    padding: 1em;
    text-align: left;
    margin-bottom: 1em;
    color: white;
    font-weight: 800;
  }

  form {
    label {
      font-size: 1.5rem;
      margin-right: 1em;
    }

    input[type='checkbox'] {
      width: 1rem;
      height: 1rem;
    }
  }
}
</style>
