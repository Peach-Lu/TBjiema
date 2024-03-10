import _axios from "./index";
export const getDataList = (data) => {
  return _axios({
    method: "get",
    url: "/task/admin/auditList",
    params: data,
  });
};
export const submit = (data) => {
  return _axios({
    method: "post",
    url: "/task/batchConfirm",
    data,
  });
};
export const yhapi = (params) => {
  return _axios({
    method: "get",
    url: "/yhapi.ashx",
    params,
  });
}