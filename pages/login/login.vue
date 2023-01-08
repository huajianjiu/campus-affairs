<template>
  <view :style="{ height: height + 'px' }">
    <image
      class="bg-image"
      :style="{ height: height + 'px' }"
      src="@/static/images/dise@2x.png"
      mode="aspectFill"
    >
    </image>
    <view
      class="content"
      :style="{ height: height + 'px' }"
    >
      <view class="infos-section">
        <text class="title">登录百事通</text>

        <view
          class="input-box"
          style="margin-bottom: 32rpx"
        >
          <input
            class="input-box-boder"
            @input="usernameInput"
            v-model="formData.username"
            type="text"
            placeholder="请输入邮箱"
          />
        </view>
        <view
          class="input-box"
          style="margin-bottom: 32rpx"
        >
          <input
            v-if="!showPassword"
            class="input-box-boder"
            @input="pwdInput"
            v-model="formData.password"
            type="password"
            placeholder="请输入密码"
          />
          <input
            v-else
            class="input-box-boder"
            @input="pwdInput"
            v-model="formData.password"
            type="text"
            placeholder="请输入密码"
          />
          <text
            @tap="changeShowState"
            class="iconfont"
            :class="showPassword?'icon-xianshimima':'icon-yincangmima'"
          ></text>
        </view>
        <view class="login-text-box">
          <checkbox-group
            @change="checkboxChange"
            style="display: inline-block"
          >
            <checkbox
              style="transform: scale(0.6)"
              value="同意"
            ></checkbox>
          </checkbox-group>
          <view class="login-text-box login-text">
            <text>我已阅读并同意</text>
            <view
              @tap="previewAgreement(1)"
              class="text-link"
            >百事通用户协议、</view>
            <view
              @tap="previewAgreement(2)"
              class="text-link"
            >隐私条款</view>
          </view>
        </view>
        <view
          class="login-button"
          @tap="handleLogin"
          :class="!canLogin ? 'login-button-disable' : ''"
        >登录
        </view>
      </view>

      <view
        class="third-login"
      >
        <text @tap="toRegister">没有账号？去注册<text class="iconfont icon-youjiantou1"></text></text>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      formData: {
        username: "",
        password: "",
      },
      pwdState: false,
      timerInterval: null,
      usernameState: false, // 手机号是否输入正确
      passwordState: false, // 验证码格式是否正确，是否大于4位数
      onceClick: true,
      height: 623,
      redirectPath: null,
      checkStatus: false,
      showPassword: false, //是否显示密码
      timer: null,
    };
  },
  onLoad(option) {
    if (option.hasOwnProperty("path")) {
      this.redirectPath = option.path;
    }
  },
  onShow() {
    this.getScreenHeight();
  },
  onUnload() {
    clearTimeout(this.timer)
  },
  computed: {
    canLogin() {
      return this.usernameState && this.pwdState && this.checkStatus;
    },
  },
  methods: {
    // 获取当前屏幕高度
    getScreenHeight() {
      uni.getSystemInfo({
        success: (res) => {
          this.height = res.windowHeight;
        },
        fail(err) {
          console.log(err);
        },
      });
    },
    /**
     * 邮箱输入框事件
     * @param {Object} e
     */
    usernameInput() {
      this.usernameState = this.formData.username.length >= 1;
    },
    /**
     * 邮箱输入框事件
     * @param {Object} e
     */
    pwdInput() {
      this.pwdState = this.formData.password.length >= 1;
    },
    /**
     * 登录按钮点击事件
     */
    handleLogin() {
      if (!this.canLogin) {
        if (!this.checkStatus) {
          uni.showToast({
            title: "请勾选用户协议",
            icon: "none",
          });
        }
        return;
      }
      uni.showLoading({
        title: "登录中",
        mask: true,
      });
      if (uni.getStorageSync("access_token")) {
        uni.removeStorageSync("access_token");
      }
      this.api.user.reqUserLogin({ username: this.formData.username.trim(), password: this.formData.password }).then((response) => {
        uni.hideLoading();
        if (response.code === 200) {
          const { data } = response
          uni.setStorageSync("access_token", data.token)
          uni.showToast({
            title: "登录成功",
            icon: "none",
            duration: 500
          });
          var pages = getCurrentPages(); //获取页面
          var beforePage = pages[pages.length - 2]; //上个页面
          let path = null;
          if (this.redirectPath == null) {
            if (beforePage) {
              path = `/${beforePage.route}`;
            } else {
              path = "/";
            }
          } else {
            path = this.redirectPath;
          }
          this.timer = setTimeout(() => {
            uni.redirectTo({
              url: path,
            });
          }, 500);
        } else {
          uni.showToast({
            title: response.message,
            icon: "error",
          });
        }
      }).catch((e) => {
        uni.showToast({
          title: e.message,
          icon: "error",
        });
        console.log(e);
      });
    },
    /**
     * 修改选中状态
     * */
    checkboxChange() {
      this.checkStatus = !this.checkStatus;
    },
    /**
     * 预览协议
     * */
    previewAgreement() { },
    /**
     * 修改密码显示状态
     * */
    changeShowState() {
      this.showPassword = !this.showPassword;
    },
    /**
     * 跳转去注册页面
     * */
    toRegister() {
      uni.navigateTo({
        url: "/pages/register/register"
      })
    }
  },
};
</script>

<style lang="scss">
@import "login.scss";
</style>
