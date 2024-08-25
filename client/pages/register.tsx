import React, { useState } from "react";
import { Alert, Button, Form, Input, message } from "antd";
import axios from "axios";
import Router from "next/router";
import Swal from "sweetalert2";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import router from "next/router";
import Link from "next/link";
export default function Register() {
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const onFinish = (values: any) => {
    console.log("Received values of form: ", values);
  };

  const currenttime = new Date();

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@(hotmail|gmail)\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.onmouseenter = Swal.stopTimer;
      toast.onmouseleave = Swal.resumeTimer;
    },
  });

  const passwordStrong = (password) => {
    const strongRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return strongRegex.test(password);
  };

  const _handleRegister = async () => {
    try {
      if (!username || !password) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Please enter an username, and password",
        });
        return;
      }

      if (!passwordStrong(password)) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Password must contain at least one lowercase letter, one uppercase letter, one digit, one special character, and be at least 8 characters long.",
        });
        return;
      }

      const result = await axios({
        method: "post",
        maxBodyLength: Infinity,
        url: "/api/user/create",
        headers: {
          "Content-Type": "application/json",
        },
        data: JSON.stringify({
          username: username,
          password: password,
          role: "user",
        }),
      });
      if (result?.data?.result?.id) {
        console.log("Sign Up successful!");
        Toast.fire({
          icon: "success",
          title: "Signed Up successfully",
        });
        setTimeout(() => {
          router.push(`/`);
        }, 2000);
      }
    } catch (errorMessage: any) {
      if (axios.isAxiosError(errorMessage)) {
        if (errorMessage.response) {
          setErrorMessage("มีผู้ใช้งานนี้ในระบบแล้ว");
        }
      }
    }
  };

  return (
    <div className="bg-gray-700 w-screen h-screen flex items-center justify-center">
      <div className="w-full max-w-xs ">
        <title>Sign Up</title>

        <div className="bg-gray-600 w-96 h-80 flex items-center justify-center p-4 rounded-lg shadow-lg">
          <Form
            className="w-72 h-auto justify-center items-center "
            name="register"
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
                onClick={_handleRegister}
              >
                Sign Up
              </Button>
              <div className="mt-2 text-wrap text-yellow-50">
                or{" "}
                <Link href="/" className="text-blue-700">
                  Sign In now!
                </Link>
              </div>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  );
}
