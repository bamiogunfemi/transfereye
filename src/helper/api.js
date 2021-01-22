import { BASE_URL } from "./config";
import axios from "axios";

const KEY = process.env.REACT_APP_KEY;

export const authorization = {
  Authorization: `Bearer ${KEY}`,
};

export const fetchOptions = {
  method: "POST",
  headers: authorization,
};

const handleError = (error) => {
  let errorResponseData;
  let status;

  if (error.response !== undefined) {
    errorResponseData = error.response.data;
    status = error.response.status;
  } else if (error.data !== undefined) {
    errorResponseData = error.data;
    status = error.status;
  } else {
    return { statusCode: 500, status: "error", message: error.message };
  }
  return { statusCode: status, ...errorResponseData };
};

function setHeaders(headers = false) {
  let headerData = {
    "content-type": "application/json",
    Accept: "application/json",
    ...authorization,
  };
  if (headers) {
    headerData = { ...headerData, ...headers };
  }
  return headerData;
}

function setBody(method, data) {
  if (method === "get" || method === "delete") {
    return { params: data };
  } else {
    return { data: data };
  }
}

function setUrl(url) {
  return `${BASE_URL}/${url}`;
}
function callApi(url, data, method, header) {
  let headers = setHeaders(header);
  let body = setBody(method, data);
  let apiUrl = setUrl(url);

  return new Promise((resolve, reject) => {
    axios({
      url: apiUrl,
      ...body,
      headers: headers,
      method: method,
    })
      .then((data) => {
        resolve({ statusCode: data.status, ...data });
      })
      .catch((error) => {
        reject(handleError(error));
      });
  });
}

export const apiGet = (url, data, header = false) => {
  return callApi(url, data, "get", header);
};

export const apiPost = (url, data, header = false) => {
  return callApi(url, data, "post", header);
};
export const apiPatch = (url, data, header = false) => {
  return callApi(url, data, "patch", header);
};

export const apiPut = (url, data, header = false) => {
  return callApi(url, data, "put", header);
};

export const apiDelete = (url, data, header = false) => {
  return callApi(url, data, "delete", header);
};
