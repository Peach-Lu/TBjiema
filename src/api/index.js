import axios from "axios";
const instance = axios.create({
  // baseURL: "https://supersms2.herokuapp.com/reactapi",
  baseURL: "/api/",
  timeout: 1000 * 30,
});

// 添加请求拦截器
instance.interceptors.request.use(
  function (config) {
    // "Content-Type": "application/json;charset=UTF-8",
    config.headers = {
      uuid: window.localStorage.getItem("token"),
    };
    // 在发送请求之前做些什么
    return config;
  },
  function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
  }
);

// 添加响应拦截器
instance.interceptors.response.use(
  function (response) {
    if (response.status === 200) {
      return response.data
    }
    // 2xx 范围内的状态码都会触发该函数。
    // 对响应数据做点什么
    // console.log(response.data.code);
    // if (response.data.code === 403) {
    //   // console.log(response.data.message, "请重新输入token");
    //   // alert(response.data.message, "请重新输入token");
    //   alert(response.data.message, "请重新输入token");
    //   window.location.reload();
    // }
    return response;
  },
  function (error) {
    // 超出 2xx 范围的状态码都会触发该函数。
    // 对响应错误做点什么
    return Promise.reject(error);
  }
);

export default instance;
