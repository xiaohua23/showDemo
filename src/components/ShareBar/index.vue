<template>
  <!-- 分享组件 -->
  <div class="popup popup-share" v-show="showShare">
    <div class="mask" @touchmove.prevent @click="closeShareBar"></div>
    <div class="main" v-if="!showShareText">
      <div class="hd">
        <div class="btn-close" @click="closeShareBar">
          <i></i>
        </div>
      </div>
      <div class="bd">
        <ul class="box box-pack box-align">
          <li @click="showShareTextDialogFun(1)" class="share-btn">
            <div class="icon-wechat-pyq"></div>
            <div class="share-title">朋友圈</div>
          </li>
          <li @click="showShareTextDialogFun(2)" class="share-btn">
            <div class="icon-wechat-hy"></div>
            <div class="share-title">微信</div>
          </li>
          <li @click="clickToShare('weibo')">
            <div class="icon-wechat-weibo"></div>
            <div class="share-title">微博</div>
          </li>
          <li @click="clickToShare('qq')">
            <div class="icon-wechat-qq"></div>
            <div class="share-title">QQ</div>
          </li>
        </ul>
      </div>
    </div>
    <div class="dialog-content" v-if="showShareText">
      <div class="dialog-close" @click="closeShareBar"></div>
      <div class="dialog-title"></div>
      <div class="dialog-main">
        <p v-html="shareComplateHTML"></p>
        <div class="btn" id="copyBtnEl" @click="clipToBoard">去微信粘贴给好友</div>
      </div>
    </div>
  </div>
</template>

<script>
/*eslint-disable*/
import { mapMutations, mapState } from 'vuex'

export default {
  data() {
    return {
      showPopupShare: false,
      showShareText: false,
      shareComplateText: '',
      isCopy: false,
      shareComplateHTML: '',
      shareStr: '',
      shareType: '',
      shareObject: {
        type: '1',
        title: '芒果12点砸蛋贺岁，每天送出iPhone +百万好礼！',
        desc: '芒果TV每天12点抽大奖，你还不快快来！',
        shareDesc: '芒果TV每天12点抽大奖，你还不快快来！',
        shareUrl: encodeURI(location.href),
        shareIcon:
          'https://ugc.hitv.com/platform_oss/C9B96BBB7D5E46988C4290F5B7776CF4.png',
      },
    }
  },

  mounted() {
    this.setDefaultShare()
  },

  methods: {
    // 显示复制口令弹窗
    showShareTextDialogFun(type) {
      if (!this.isMGTV && this.utils.outsiteCallToAPP()) {
        this.utils.downloadMGTV('')
        return
      }
      if (!this.isLogin) {
        this.utils.jumpLogin()
        return false
      }
      this.shareComplateHTML = this.shareComplateText.replace(
        new RegExp('\n', 'g'),
        '<br>'
      )
      this.shareType = type
      this.showShareText = true
    },

    // 分享成功
    async shareDone(type) {
      try {
        if (type == 'weibo') {
          this.shareType = 3
        } else if (type == 'qq') {
          this.shareType = 4
        }
        MgStat.send(
          'click',
          {
            flag: 17,
            sharetype: this.shareType,
          },
          {
            cont: '分享成功',
            cntp: 'mg12_actHome',
          }
        )
        let res = await this.api.shareDone()
        this.$emit('upTaskStatus')
      } catch (error) {
        console.log(error)
      }
    },
    // 分享到微博/QQ
    clickToShare(type) {
      this.shareObject.type = type
      MgtvApi.shareTo(this.shareObject, resp => {
        //分享成功端上回调
        if (resp.data && resp.data.value == 1) {
          setTimeout(() => {
            this.shareDone(type)
          }, 300)
        }
      })
    },

    closeShareBar(e) {
      if (
        'mask,share-iknow,btn-close,btn,dialog-close'.indexOf(
          e.target.className
        ) > -1
      ) {
        this.showShareText = false
        this.$emit('closeShareBar')
      }
    },

    //设置微信二次分享和端上三个点的分享
    setDefaultShare() {
      this.utils.setWXShareInfo(this.shareObject)
      MgtvApi.showShareMenus(this.shareObject, resp => {
        if (resp.data.value == 1) {
          console.log('分享成功')
        }
      })
    },
  },
  name: 'headbar',
  props: {
    uid: {
      type: Number,
      default: 0,
    },
    showShare: {
      type: Boolean,
      default: false,
    },
  },
  computed: mapState(['userInfo', 'devicesInfo', 'isMGTV', 'isLogin']),
}
</script>
<style scoped lang="less">
.bgImage(@imageUrl) {
  background-image: url(@imageUrl);
  background-size: 100% auto;
  background-repeat: no-repeat;
  background-color: transparent;
}
/*分享弹窗*/
.popup-share {
  .main {
    background-color: #fff;
    border-radius: 20px 20px 0 0;
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;
    z-index: 991;

    .hd {
      height: 80px;
      position: relative;

      .btn-close {
        position: absolute;
        top: 0;
        right: 0;
        width: 80px;
        height: 80px;

        i {
          display: block;
          width: 31px;
          height: 30px;
          //   .bgImage('../assets/images/share-btn-close.png');
          margin: 25px auto 0;
        }
      }
    }

    .bd {
      padding-bottom: 50px;

      li {
        width: 25%;
        text-align: center;

        .icon-wechat-pyq {
          margin: auto;
          width: 50px;
          height: 50px;
          // .bgImage('../assets/share-wechat-pyq.png');
        }

        .icon-wechat-hy {
          margin: auto;
          width: 55px;
          height: 45px;
          // .bgImage('../assets/share-wechat-hy.png');
        }

        .icon-wechat-weibo {
          margin: auto;
          width: 57px;
          height: 46px;
          // .bgImage('../assets/share-weibo.png');
        }

        .icon-wechat-qq {
          margin: auto;
          width: 48px;
          height: 50px;
          // .bgImage('../assets/share-qq.png');
        }

        .share-title {
          font-size: 26px;
          color: #989898;
          padding-top: 15px;
        }
      }
    }
  }
}
.popup {
  .mask {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.7);
    z-index: 990;
  }
}

.dialog-content {
  position: fixed;
  top: 200px;
  left: 50%;
  z-index: 9999;
  width: 600px;
  height: 560px;
  background: #da3149;
  color: #fff;
  border-radius: 25px;
  transform: translateX(-50%);
  padding-top: 36px;

  .dialog-close {
    position: absolute;
    bottom: -120px;
    left: 50%;
    margin-left: -22px;
    z-index: 11;
    width: 44px;
    height: 44px;
    // background: url(../assets/dialog-close.png) no-repeat;
    background-size: contain;
  }
  .dialog-main {
    p {
      width: 500px;
      font-size: 24px;
      line-height: 42px;
      text-align: left;
      color: #fff;
      margin: 40px auto 60px;
    }
    .btn {
      width: 400px;
      height: 98px;
      font-size: 34px;
      font-family: PingFangSC-Semibold, PingFang SC;
      font-weight: 600;
      color: #000;
      line-height: 48px;
      text-align: center;
      //   background-image: url('../assets/btn.png');
      background-size: 100% 100%;
      padding-top: 20px;
      margin: 0 auto;
    }
  }
}
</style>
