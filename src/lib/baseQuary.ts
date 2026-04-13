import type { BaseQueryFn } from "@reduxjs/toolkit/query";
import type { AxiosRequestConfig, AxiosError } from "axios";
import { authKey } from "./constants";
import { helpers } from "./helpers";
import axios from "axios";

const axiosBaseQuery =
  (
    { baseUrl }: { baseUrl: string } = { baseUrl: "" },
  ): BaseQueryFn<
    {
      url: string;
      method?: AxiosRequestConfig["method"];
      data?: AxiosRequestConfig["data"];
      params?: AxiosRequestConfig["params"];
      headers?: AxiosRequestConfig["headers"];
      ContentType?: string;
      onUploadProgress?: AxiosRequestConfig["onUploadProgress"];
    },
    unknown,
    unknown
  > =>
  async ({
    url,
    method,
    data,
    params,
    headers,
    ContentType,
    onUploadProgress,
  }) => {
    const token = helpers.getAuthCookie(authKey);
    try {
      const result = await axios({
        url: baseUrl + url,
        method,
        data,
        params,
        onUploadProgress,
        headers: {
          "Content-Type": ContentType || "application/json",
          Authorization: `Bearer ${token}`,
          "ngrok-skip-browser-warning": "true",
          ...headers,
        },
      });
      return { data: result.data };
    } catch (axiosError) {
      const err = axiosError as AxiosError;
      return {
        error: {
          status: err.response?.status,
          data: err.response?.data || err.message,
        },
      };
    }
  };

export default axiosBaseQuery;
