import request from '../../utils/request.js'
// const baseUrl=;
// 获取板块列表
export const reqSectionList=()=>request({url:'/app/home/sectionList',method:'get'});
// 获取帖子列表
export const reqTopicList=(data)=>request({url:'/app/home/topicList',method:'get',params:data});

// 获取帖子图片
export const reqImgList=(data)=>request({url:'/app/home/imgList',method:'get',params:data});

// 上传帖子图片
export const uploadPictures=(data)=>request({url:'/app/upload/pictures',method:'post',data});

// 发送帖子
export const reqPostTopic=(data)=>request({url:'/app/home/postTopic',method:'post',data});

// 获取系统公告
export const reqAnnouncement=()=>request({url:'/app/home/announcement',method:'get'});

// 获取评论列表
export const reqReplyList=(data)=>request({url:'/app/home/replyList',method:'get',params:data});

// 发送评论
export const reqSendReply=(data)=>request({url:'/app/home/sendReply',method:'post',data});

// 点赞帖子
export const reqLikeTopic=(data)=>request({url:'/app/home/likeTopic',method:'post',data});

// 点赞评论
export const reqLikeReply=(data)=>request({url:'/app/home/likeReply',method:'post',data});

// 删除自己的帖子
export const reqDeleteTopic=(data)=>request({url:'/app/home/deleteTopic',method:'delete',data});
