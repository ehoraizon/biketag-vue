<template>
  <header v-if="variant === 'top'" :class="`biketag-header ${!showHeader ? 'is-hidden' : ''}`">
    <!-- The header logo and profile and hamburger buttons go here -->
    <nav id="navmenu" class="biketag-header-nav navbar navbar-expand-xl">
      <!-- Back Arrow -->
      <div v-if="isShow" class="back-arrow" @click="goBack">
        <img
          src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0nMzknIGhlaWdodD0nMjUnIHZpZXdCb3g9JzAgMCAzOSAyNScgZmlsbD0nbm9uZScgeG1sbnM9J2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJz4KPHBhdGggZD0nTTQuNDUzMzcgOS42NDMzMUgzMi40NTM0JyBzdHJva2U9J2JsYWNrJyBzdHJva2Utd2lkdGg9JzInIHN0cm9rZS1saW5lY2FwPSdyb3VuZCcvPgo8cGF0aCBkPSdNMi40NTMzNyAxMi42NDM0QzEzLjI1MyAxMS4xMDA2IDQ2LjAyOTMgMTAuNjQzNCAzNS4xMiAxMC42NDM0QzMwLjc0MDcgMTAuNjQzNCA3LjE4NjUgOC4xNzcxIDUuNDUzMzcgMTEuNjQzNCcgc3Ryb2tlPSdibGFjaycgc3Ryb2tlLXdpZHRoPScyJyBzdHJva2UtbGluZWNhcD0ncm91bmQnLz4KPHBhdGggZD0nTTEzLjQ1MzQgMS42NDMyNUMxMi4wNTEyIDMuODg2NzMgMTAuNTA5MiA2LjA3MTUzIDguODk3ODMgOC4xNDMyNUM3Ljc4NTY5IDkuNTczMTQgNS40MDQ2MyA5LjI3NDg3IDQuNjc1NjEgMTAuODY1NUMzLjEyMDkyIDE0LjI1NzUgLTAuMzI1NTA2IDEyLjI4ODEgMy41MDg5NCAxNS42NDMyQzUuNTU4OSAxNy40MzcgNy43MzYyMSAxOC45MjYxIDkuNjc1NiAyMC44NjU1QzEzLjEwMjcgMjQuMjkyNiAxMS4xOTg3IDIzLjU3NzEgOC42NzU2IDIwLjY0MzJDNi4zMDQwMyAxNy44ODU2IDIuOTUwNjQgMTQuOTY1NSAxLjE3NTYxIDExLjgwOTlDMC4wNDYyMTQzIDkuODAyMTEgNC42ODczOCA3LjQ1MDIxIDUuODk3ODMgNi42NDMyNUM3LjMxOTIyIDUuNjk1NjUgMTUuMDExNSAtMS4wODYzOSAxMi4wMDg5IDEuNjQzMjVDOS4zMDkzOCA0LjA5NzM5IDQuNjI2OTUgNy4yNDg3OCAzLjIzMTE2IDEwLjQyMUMyLjQwMjM0IDEyLjMwNDcgLTAuMDMxMzczNSAxMi4zNjE5IDIuMDA4OTQgMTQuNTg3N0MzLjIxODc2IDE1LjkwNzUgNC43NjMyMSAxNi4yNzA2IDUuOTUzMzggMTcuNjk4OEM3LjgxNjg4IDE5LjkzNSAxMC40MDY2IDIyLjY0MzIgMTMuNDUzNCAyMi42NDMyJyBzdHJva2U9J2JsYWNrJyBzdHJva2Utd2lkdGg9JzInIHN0cm9rZS1saW5lY2FwPSdyb3VuZCcvPgo8cGF0aCBkPSdNMi40NTMzNyAxMS42NDMzQzUuNzUzNDIgMTQuMjIxNSAxMS42NDY4IDE5LjAzMDEgMTMuNDUzNCAyMi42NDMzJyBzdHJva2U9J2JsYWNrJyBzdHJva2Utd2lkdGg9JzInIHN0cm9rZS1saW5lY2FwPSdyb3VuZCcvPgo8L3N2Zz4K"
          alt="go back"
        />
      </div>
      <!-- Region Image -->
      <div class="navbar-brand">
        <a href="./" @click="clearTagCache">
          <img :src="getLogoUrl('m')" class="logo" />
        </a>
        <div>
          <span class="game-title">{{ getGameTitle }}</span>
        </div>
      </div>

      <!-- Hamburger Menu -->
      <button
        ref="buttonCollapse"
        class="navbar-toggler"
        data-bs-toggle="collapse"
        data-bs-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <img class="hamburger-image" src="/images/Hamburger.svg" alt="Burge menu" />
      </button>

      <div id="navbarSupportedContent" ref="navList" class="collapse navbar-collapse">
        <ul class="navbar-nav me-auto mb-lg-0">
          <li v-if="$auth.isAuthenticated" class="nav-item">
            <img
              class="profile-icon"
              :src="getProfileImageSrc"
              alt="Profile Icon"
              @click="goProfile"
            />
          </li>
          <li
            v-if="isBikeTagAmbassador && getQueuedTags?.length"
            class="nav-item"
            :class="{ 'active-nav': currentRoute === 'Approve' }"
            @click="goApprovePage"
          >
            {{ $t('menu.queue') }}
          </li>
          <li
            class="nav-item"
            :class="{ 'active-nav': currentRoute === 'Home' }"
            @click="goHomePage"
          >
            {{ $t('menu.home') }}
          </li>
          <li
            class="nav-item"
            :class="{ 'active-nav': currentRoute === 'Play' }"
            @click="goPlayPage"
          >
            {{ $t('menu.play') }}
          </li>
          <li
            class="nav-item"
            :class="{ 'active-nav': currentRoute === 'BikeTags' }"
            @click="goBikeTagsPage"
          >
            {{ $t('menu.biketags') }}
          </li>
          <li
            class="nav-item"
            :class="{ 'active-nav': currentRoute === 'Players' }"
            @click="goPlayersPage"
          >
            {{ $t('menu.players') }}
          </li>
          <li
            class="nav-item"
            :class="{ 'active-nav': currentRoute === 'Leaderboard' }"
            @click="goLeaderboardPage"
          >
            {{ $t('menu.top10') }}
          </li>
          <li class="nav-item" :class="{ 'active-nav': currentRoute === 'How' }" @click="goHowPage">
            {{ $t('menu.howto') }}
          </li>
          <li
            class="nav-item"
            :class="{ 'active-nav': currentRoute === 'About' }"
            @click="goAboutPage"
          >
            {{ $t('menu.about') }}
          </li>
          <template v-if="$auth.isAuthenticated">
            <li class="nav-item" @click="logout">
              {{ $t('menu.logout') }}
            </li>
          </template>
          <template v-else>
            <li
              v-if="showLogin"
              class="nav-item"
              :class="{ 'active-nav': currentRoute === 'Login' }"
              @click="login"
            >
              {{ $t('menu.login') }}
            </li>
          </template>
        </ul>
      </div>
    </nav>
  </header>
  <footer v-if="variant === 'bottom'" class="container pb-5 mt-5 footer">
    <!-- Fixed Footer -->
    <div class="footer-fixed__wrapper">
      <!-- Leaderboard -->
      <bike-tag-button
        class="footer-fixed__group_column"
        :text="$t('menu.top10')"
        @click="goLeaderboardPage"
      >
      </bike-tag-button>

      <!-- World -->
      <div class="button-reset-container">
        <bike-tag-button class="button-reset" variant="circle" @click="goWorldwide">
          <img
            class="footer-fixed_image"
            src="@/assets/images/npworld.png"
            alt="BikeTag World Wide"
          />
        </bike-tag-button>
      </div>
      <!-- Players -->
      <bike-tag-button
        class="footer-fixed__group_column"
        :text="$t('menu.players')"
        @click="goPlayersPage"
      >
      </bike-tag-button>
    </div>
  </footer>
</template>
<script>
import { defineComponent } from 'vue'
import { mapGetters } from 'vuex'
import BikeTagButton from '@/components/BikeTagButton'
import { debug } from '@/common/utils'

export default defineComponent({
  name: 'BikeTagMenu',
  components: {
    BikeTagButton,
  },
  props: {
    logo: {
      type: String,
      default: null,
    },
    variant: {
      type: String,
      default: 'top',
    },
  },
  data() {
    return {
      showLogin: process.env.CONTEXT === 'dev',
      showHeader: true,
      lastScrollPosition: 0,
      scrollOffset: 40,
    }
  },
  computed: {
    ...mapGetters([
      'getGameTitle',
      'getLogoUrl',
      'getCurrentBikeTag',
      'isDataInitialized',
      'isBikeTagAmbassador',
      'getQueuedTags',
      'getProfile',
    ]),
    isShow() {
      if (this.$route.name) {
        debug('view::loaded', this.$route.name)
      }
      return this.$route.name !== 'Home'
    },
    currentRoute() {
      return this.$route.name
    },
    getProfileImageSrc() {
      return this.isBikeTagAmbassador
        ? '/images/biketag-ambassador.svg'
        : '/images/biketag-player.svg'
    },
  },
  mounted() {
    this.lastScrollPosition = window.pageYOffset
    window.addEventListener('scroll', this.onScroll)
  },
  beforeUnmount() {
    window.removeEventListener('scroll', this.onScroll)
  },
  methods: {
    // Toggle if navigation is shown or hidden
    onScroll() {
      if (window.pageYOffset < 0) {
        return
      }
      if (Math.abs(window.pageYOffset - this.lastScrollPosition) < this.scrollOffset) {
        return
      }
      this.showHeader = window.pageYOffset < this.lastScrollPosition
      this.lastScrollPosition = window.pageYOffset
    },
    async clearTagCache() {
      await this.$store.dispatch('setGame', true)
      await this.$store.dispatch('setTags', true)
      await this.$store.dispatch('setQueuedTags', true)
    },
    login() {
      this.closeCollapsible()
      this.$router.push('/login')
    },
    logout() {
      this.$store.dispatch('setProfile')
      this.$auth.logout({
        returnTo: window.location.origin,
      })
    },
    closeCollapsible() {
      this.$refs.buttonCollapse.setAttribute('aria-expanded', false)
      this.$refs.navList.classList.remove('show')
    },
    goWorldwide() {
      window.location = 'http://biketag.org/'
      // this.$router.push('/worldwide')
    },
    goApprovePage: function () {
      this.closeCollapsible()
      this.$router.push('/approve')
    },
    goBikeTagsPage: function () {
      this.closeCollapsible()
      this.$router.push('/biketags')
    },
    goPlayPage: function () {
      this.closeCollapsible()
      this.$router.push('/play')
    },
    goProfile: function () {
      this.closeCollapsible()
      this.$router.push('/profile')
    },
    goAboutPage: function () {
      this.closeCollapsible()
      this.$router.push('/about')
    },
    goLeaderboardPage: function () {
      this.closeCollapsible()
      this.$router.push('/leaderboard')
    },
    goPlayersPage: function () {
      this.closeCollapsible()
      this.$router.push('/players')
    },
    goHowPage: function () {
      this.closeCollapsible()
      this.$router.push('/howtoplay')
    },
    goHomePage: function () {
      this.closeCollapsible()
      this.$router.push('/')
    },
    goBack: function () {
      this.$router.back()
    },
  },
})
</script>
<style lang="scss" scoped>
@import '../assets/styles/style';

.is-hidden {
  transform: translateY(-100%);
}

header {
  background-color: #e5e5e5;
  position: fixed;
  width: 100%;
  top: 0;
  left: 0;
  z-index: 999;
  box-shadow: 0 3px 6px rgb(0 0 0 / 16%), 0 3px 6px rgb(0 0 0 / 23%);
  transition: transform 0.5s ease-out;

  nav {
    .show {
      height: calc(100vh - 82px);

      ul {
        height: inherit;
        overflow: auto;
      }
      @media (min-width: $breakpoint-desktop) {
        height: auto;
      }
    }

    .profile-icon {
      max-width: 25vw;
      height: auto;
    }
    @media (min-width: 990px) {
      .profile-icon {
        max-width: 10vh;
      }
    }

    .navbar-brand {
      margin: 0;
      margin-left: 1rem;
      @media (min-width: $breakpoint-desktop) {
        margin: 0 2rem;
      }
    }

    .navbar-collapse {
      flex-grow: unset;

      @media (min-width: $breakpoint-desktop) {
        overflow: auto;
      }

      ul > li {
        @media (min-width: 992px) {
          margin: 1rem;
        }
      }
    }

    .navbar-toggler {
      //   margin-right: 1rem;
      margin: 0.5rem;
    }

    .logo {
      max-width: 10rem;
      height: 4.5rem;
    }

    .hamburger-image {
      width: auto;
      height: 3.5rem;
    }

    .game-title {
      color: black;
      font-family: $default-secondary-font-family;

      @media (max-width: 990px) {
        display: none;
      }
    }

    .nav-item {
      font-family: $default-secondary-font-family;
      text-transform: uppercase;
      font-size: 2rem;
      cursor: pointer;

      @media (max-width: 990px) {
        box-shadow: 0 1px 3px rgb(0 0 0 / 12%), 0 1px 2px rgb(0 0 0 / 24%);
        border-bottom: 1px solid black;
        padding: 1rem 0;
      }
    }

    .back-arrow {
      margin-left: 1rem;
      cursor: pointer;
    }
  }
}

.navbar {
  padding-bottom: 0 !important;
  padding-top: 0 !important;
  justify-content: space-between !important;
}

.navbar-nav {
  align-items: center;

  @media (max-width: 990px) {
    align-items: unset;
    height: 100vh;
  }
}

.button-reset-container {
  display: flex;

  .button-reset {
    min-height: auto;

    // margin: auto;
  }
}

.active-nav {
  //   background-color: black;
  //   color: white;

  border-bottom: 3px solid black;

  @media (max-width: 990px) {
    border-bottom: none;
    background-color: black;
    color: white;
  }
}

footer {
  display: flex;
  flex-flow: wrap;
  flex-wrap: wrap;
  justify-content: center;
  max-width: 20vw;

  .row {
    > div {
      font-family: monospace;
      padding-left: 1px;
      margin-left: 5px;
      color: white;
      position: relative;
    }

    span {
      font-family: monospace;
      padding-left: 1px;
      margin-left: 5px;
      color: white;
    }

    .worldwide {
      div {
        color: black;
        margin: 0;
      }

      a {
        text-decoration: none;

        i {
          font-size: 5em;

          &:hover {
            filter: blur(2px);
          }
        }
      }
    }

    .flow {
      max-height: 131px;
      position: absolute;
      top: 0%;
      right: 15%;
      z-index: -1;
      padding-top: 1px;
    }
  }

  .row > * {
    margin: auto;
  }

  .footer-fixed {
    &__wrapper {
      box-shadow: 0 3px 6px rgb(0 0 0 / 16%), 0 3px 6px rgb(0 0 0 / 23%);
      z-index: 100;
      width: 100%;
      background-color: #e5e5e5;
      position: fixed;
      bottom: 0;
      left: 0;
      display: flex;
      justify-content: space-between;
      font-family: $default-secondary-font-family;
      color: black;
      font-size: 0.75rem;
      padding: 0.25rem 0;
      height: 76px;
    }

    &__group_column {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      margin: 0 1rem;
      min-height: auto !important;
    }

    &__image {
      width: 3.125rem;
      height: auto;
    }
  }
}
</style>
