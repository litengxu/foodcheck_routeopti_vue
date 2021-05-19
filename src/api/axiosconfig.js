import axios from 'axios'
import {Message} from 'element-ui';
import router from '../router'

axios.interceptors.response.use(
    //配置下全局的状态回应
    // success => {
    // // success.status 存在且是200，并且data中的status是500则发生错误
    // if (success.status && success.status == 200 && success.data.status == 500) {
    //     Message.error({message: success.data.msg})
    //     return;
    // }
    // if (success.data.msg) {
    //     Message.success({message: success.data.msg})
    // }
    // return success.data;
    response =>{
        if(response.data.errorCode == 2002){
            Message.error("账号已过期");

        } else if(response.status< 200 || response.status > 300){
            Message.error("出错了");
            return;
        } else if(response.data.errorCode == 2001){
            Message.error("用户未登录");
        }
        else if(response.data.errorCode == 2003){
            Message.error("密码错误");
        }else if(response.data.errorCode == 2004){
            Message.error("密码过期");

        }else if(response.data.errorCode == 2005){
            Message.error("账号不可用");

        }else if(response.data.errorCode == 2006){
            Message.error("账号被锁定");

        }else if(response.data.errorCode == 2007){
            Message.error("账号不存在");

        }else if(response.data.errorCode == 2008){
            Message.error("账号已存在");

        }else if(response.data.errorCode == 2009){
            Message.error("账号下线");

        } else if(response.data.errorCode == 2010){
            Message.error("验证码错误");

        }else if(response.data.errorCode == 2011){
            Message.error("验证码为空");

        }else if(response.data.errorCode == 3001){
            Message.error("权限不足");
        }else if(response.data.success == false){
            Message.error(response.data.errorMsg);
            return;
        }else if(response.data.code > 200){
            Message.error(response.data.message);
            return;
        }else{
            return response;
        }

}, error => {
    if (error.response.status == 504 || error.response.status == 404) {
        Message.error({message: '服务器被吃了( ╯□╰ )'})
    } else if (error.response.status == 403) {
        Message.error({message: '权限不足，请联系管理员'})
    } else if (error.response.status == 401) {
        Message.error({message: error.response.data.msg ? error.response.data.msg : '尚未登录，请登录'})
        router.replace('/');
    } else {
        if (error.response.data.msg) {
            Message.error({message: error.response.data.msg})
        } else {
            Message.error({message: '未知错误!'})
        }
    }
    return;
})
axios.interceptors.request.use(
    config =>{
        /*在请求头中加入token*/
        if(localStorage.getItem('token')){
            config.headers.Authorization =localStorage.getItem('token')
        }
        if(localStorage.getItem('ms_username')){
            config.headers.username =localStorage.getItem('ms_username')
        }
        return config;
    },
    error =>{
        //对请求错误做什么
        return Promise.reject(error);
    })
export default axios