<template>
    <view>
        <view class="middle">
            <view>
                <img width="50px" height="50px" src="@/assets/icon.png" alt="">
            </view>
            <span class="name">校园论坛登录</span>
        </view>
    </view>
</template>

<script>
    export default {
        data() {
            return {

            };
        },
        methods: {
            /**
             * @description 返回上一级
             * @return {*}
             * */
            back() {
                console.log(111111);
                uni.navigateBack()
            }
        }
    }
</script>

<style lang="scss">
    .middle{
        width: 375px;
        text-align: center;
        margin: 40px 0 30px 0;
      }
</style>
