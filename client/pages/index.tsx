import React, { useState } from "react";
import { Alert, Button, Checkbox, Col, Flex, Form, Input } from "antd";
import axios from "axios";
import Router from "next/router";
import {
  EyeInvisibleOutlined,
  EyeOutlined,
  LockOutlined,
  UserOutlined,
} from "@ant-design/icons";
import Swal from "sweetalert2";
import Link from "next/link";

export default function Home() {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const onFinish = (values: any) => {
    console.log("Received values of form: ", values);
  };

  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 2000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.onmouseenter = Swal.stopTimer;
      toast.onmouseleave = Swal.resumeTimer;
    },
  });

  const _handleLogin = async () => {
    try {
      if (!username || !password) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Please enter a username password",
        });
        return;
      }

      const result = await axios({
        method: "post",
        maxBodyLength: Infinity,
        url: "/api/auth/signin",
        headers: {
          "Content-Type": "application/json",
        },
        data: JSON.stringify({
          username: username,
          password: password,
        }),
      });

      console.log(result?.data?.result?.id);
      console.log("Login successful!");
      localStorage.setItem("usernamelogin", username);
      localStorage.setItem("role", result.data.result.role);
      Toast.fire({
        icon: "success",
        title: "Signed in successfully",
      });
      setTimeout(() => {
        Router.push(`/tpcs`);
      }, 2000);
    } catch (errorMessage: any) {
      if (axios.isAxiosError(errorMessage)) {
        if (errorMessage.response) {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "Invalid username or password",
          });
        }
      }
      console.log("err=========>", errorMessage);
    }
  };
  return (
    <div className="bg-gray-700 w-screen h-screen flex items-center justify-center">
      <div className="w-full max-w-xs ">
        <title>Sign in</title>

        <div className="bg-gray-600 w-96 h-80 flex items-center justify-center p-4 rounded-lg shadow-lg">
          <Form
            className="w-72 h-auto justify-center items-center "
            name="login"
            initialValues={{ remember: true }}
            style={{ maxWidth: 360 }}
            onFinish={onFinish}
          >
            <Form.Item
              name="username"
              rules={[
                { required: true, message: "Please input your Username!" },
              ]}
            >
              <Input
                prefix={<UserOutlined />}
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[
                { required: true, message: "Please input your Password!" },
              ]}
            >
              <Input
                prefix={<LockOutlined />}
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Item>

            <Form.Item className="w-full">
              <Button
                block
                type="primary"
                htmlType="submit"
                onClick={_handleLogin}
              >
                Login
              </Button>
              <div className="mt-2 text-wrap text-yellow-50">
                or{" "}
                <Link href="/register" className="text-blue-700">
                  Sign Up Now!
                </Link>
              </div>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  );
}
