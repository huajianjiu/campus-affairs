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
        <text class="title">注册百事通</text>

        <view
          class="input-box"
          :class="{'mb-0':!usernameState}"
        >
          <input
            class="input-box-boder"
            @input="usernameInput"
            v-model="formData.username"
            type="text"
            placeholder="请输入邮箱"
          />
        </view>
          <text v-if="!usernameState" class="error-tip">请输入合法邮箱地址</text>
        <view
        :class="{'mb-0':!passwordState}"
          class="input-box">
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
            @tap="changeShowState(1)"
            class="iconfont"
            :class="showPassword?'icon-xianshimima':'icon-yincangmima'"
          ></text>
        </view>
        <text v-if="!passwordState"  class="error-tip">密码必须至少包含数字、字母两种字符，8-15位</text>
        <view
        :class="{'mb-0':!rePasswordState}"
          class="input-box"
        >
          <input
            v-if="!showRePassword"
            class="input-box-boder"
            @input="rePwdInput"
            v-model="rePassword"
            type="password"
            placeholder="请确认密码"
          />
          <input
            v-else
            class="input-box-boder"
            @input="rePwdInput"
            v-model="rePassword"
            type="text"
            placeholder="请确认密码"
          />
          <text
            @tap="changeShowState(2)"
            class="iconfont"
            :class="showRePassword?'icon-xianshimima':'icon-yincangmima'"
          ></text>
        </view>
        <text v-if="!rePasswordState"  class="error-tip">两次密码不一致</text>
        <view
                  class="input-box"
                >
                  <input
                    class="input-box-boder"
                    @input="codeInput"
                    v-model="formData.code"
                    type="number"
                    placeholder="请输入验证码"
                    maxlength="6"
                  />
                  <button
                    :class="!(canGetCode&&rePassword.length>=8)||codeData.status?'code-disabled':''"
                    class="login-button-code"
                    @click="handleGetCode"
                    >{{codeData.btnTemplate}}</Button>
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
          @tap="handleRegister"
          :class="!canRegister ? 'login-button-disable' : ''"
        >注册
        </view>
      </view>
      <!-- 通知消息 -->
      <u-notify ref="uNotify"></u-notify>
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
        code:""
      },
      timerInterval: null,
      usernameState: true, // 手机号是否输入正确
      passwordState: true, // 
      rePasswordState:true,
      onceClick: true,
      height: 623,
      redirectPath: null,
      checkStatus: false,
      showPassword: false, //是否显示密码
      showRePassword:false,
      outTimer: null,
      rePassword:'',//确认密码
      timerInterval: null,
            codeData: {
              count: 30,
              status: false,
              btnTemplate:'获取验证码'
            },
            codeState:false // 验证码格式是否正确，是否大于4位数
    }
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
    clearTimeout(this.outTimer)
  },
  computed: {
    canRegister() {
      return this.usernameState && this.passwordState && this.checkStatus &&this.rePasswordState&&this.codeState;
    },
    canGetCode() {
      return this.usernameState&&this.passwordState&&this.rePasswordState
    }
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
        const reg=/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
        if(reg.test(this.formData.username)){
            this.usernameState=true;
        }else{
           this.usernameState=false; 
        }
    },
    /**
     * 密码输入框事件
     * @param {Object} e
     */
    pwdInput() {
        const reg=/^(?=.*[0-9])(?=.*[a-zA-Z])[0-9A-Za-z~!@#$%^&*._?]{8,15}$/;
        if(reg.test(this.formData.password)){
            this.passwordState=true;
        }else{
           this.passwordState=false; 
        }
    },
    /**
     * 确认密码输入框事件
     * @param {Object} e
     */
    rePwdInput() {
        if(this.formData.password===this.rePassword){
            this.rePasswordState=true;
        }else{
            this.rePasswordState=false;
        }
    },
    /**
     * 验证码输入框事件
     * @param {Object} e
     */
    codeInput() {
      this.codeState = this.formData.code.length == 6;
    },
    /**
     * 注册按钮点击事件
     */
    handleRegister() {
      if (!this.canRegister) {
        if (!this.checkStatus) {
          uni.showToast({
            title: "请勾选用户协议",
            icon: "none",
          });
        }
        return;
      }
      uni.showLoading({
        title: "注册中",
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
          this.outTimer = setTimeout(() => {
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
    changeShowState(index) {
        if(index===1){
            this.showPassword = !this.showPassword;
        }else if(index===2){
            this.showRePassword = !this.showRePassword;
        }
    },
    /**
     * 获取验证码
     * */
    handleGetCode(){
        if(!this.canGetCode||!this.onceClick){
            
            return
        }
            this.timer();
              this.onceClick = false;
              this.$refs.uNotify.show({
                          type: 'success',
                          message: '验证码已发送到您的邮箱',
                          fontSize:30
                      })
              this.api.user.reqGetCode({email:this.formData.username}).then(res=>{
                  console.log(res);
              })
              .catch(err=>{
                  console.log(err);
              })
    },
    /**
         * 倒计时
         */
        timer() {
            let template = this.codeData.btnTemplate
          clearInterval(this.timerInterval);
          this.codeData.status = true;
    
          this.timerInterval = setInterval(() => {
            if (this.codeData.count > 0) {
              this.codeData.count = this.codeData.count - 1;
              let tempTemplate = '倒计时 ' + this.codeData.count + ' S'
              this.codeData.btnTemplate = tempTemplate
            } else {
              this.codeData.count = 30;
              this.codeData.status = false;
              this.onceClick = true;
              this.codeData.btnTemplate = template;
              clearInterval(this.timerInterval);
            }
          }, 1000)
        },
  },
};
</script>

<style lang="scss">
@import "register.scss";
</style>
