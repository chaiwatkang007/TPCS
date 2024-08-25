import {
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  SearchOutlined,
  SettingOutlined,
  UserOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons";
import {
  Button,
  Form,
  GetRef,
  Input,
  InputRef,
  Layout,
  List,
  Menu,
  Space,
  Table,
  TableProps,
  theme,
} from "antd";
import axios from "axios";
import React, { useContext, useEffect, useRef, useState } from "react";
import Swal from "sweetalert2";

import { Popconfirm } from "antd";
import router from "next/router";

const { Header, Sider, Content } = Layout;

interface Stock {
  id: string;
  type: string;
  name: string;
  order_date: string;
  created_date: string;
  updated_date: string;
  details: string;
  status: string;
}

type FormInstance<T> = GetRef<typeof Form<T>>;
const EditableContext = React.createContext<FormInstance<any> | null>(null);

interface EditableRowProps {
  index: number;
}

const EditableRow: React.FC<EditableRowProps> = ({ index, ...props }) => {
  const [form] = Form.useForm();
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
};

interface EditableCellProps {
  title: React.ReactNode;
  editable: boolean;
  dataIndex: keyof Item;
  record: Item;
  handleSave: (record: Item) => void;
}

interface Item {
  key: string;
  name: string;
  age: string;
  address: string;
}

type ColumnTypes = Exclude<TableProps["columns"], undefined>;

export default function Tpcs() {
  const [usernamelogin, setUsernamelogin] = useState("");
  const [usernameRole, setUsernameRole] = useState("");
  const [collapsed, setCollapsed] = useState(false);
  const [search, setSearch] = useState("");
  const [data, setData] = useState<Stock[]>([]);
  const [filteredData, setFilteredData] = useState<Stock[]>([]);
  const [currentPage, setCurrentPage] = useState("list");
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const loadMoreData = async () => {
    try {
      const response = await axios.get("/api/stock");
      const result = response.data.result;

      if (Array.isArray(result.rows)) {
        setData(result.rows);
        setFilteredData(result.rows);
        setDataSource(result.rows);
      } else {
        console.error("Error: Data received is not an array");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUsername = localStorage.getItem("usernamelogin");
      const storedUsernameRole = localStorage.getItem("role");
      if (storedUsername) {
        setUsernamelogin(storedUsername);
      } else {
        router.push("/");
      }

      if (storedUsernameRole) {
        setUsernameRole(storedUsernameRole);
      }
    }
    loadMoreData();
  }, [usernamelogin, usernameRole]);

  useEffect(() => {
    const searchData = data.filter(
      (item) =>
        item.id.toString().includes(search) ||
        item.type.includes(search) ||
        item.name.includes(search) ||
        item.order_date.includes(search) ||
        item.created_date.includes(search)
    );
    setFilteredData(searchData);
  }, [search, data]);

  const EditUser = async (id, name, type, details, status) => {
    if (usernameRole === "admin") {
      Swal.fire({
        title: "Edit Device",
        html:
          `<input id="type" class="swal2-input" placeholder="type" value="${type}">` +
          `<input id="name" class="swal2-input" placeholder="name" value="${name}">` +
          `<input id="details" class="swal2-input" placeholder="details" value="${details}" >` +
          `<input id="status" class="swal2-input" placeholder="status" value="${status}" >`,
        showCancelButton: true,
        confirmButtonText: "Submit",
        showLoaderOnConfirm: true,
        preConfirm: async () => {
          const typeInput = document.getElementById("type") as HTMLInputElement;
          const nameInput = document.getElementById("name") as HTMLInputElement;
          const detailsInput = document.getElementById(
            "details"
          ) as HTMLInputElement;
          const statusInput = document.getElementById(
            "status"
          ) as HTMLInputElement;
          const type = typeInput.value;
          const name = nameInput.value;
          const details = detailsInput.value;
          const status = statusInput.value;

          try {
            const response = await fetch("/api/stock/update", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ id, type, name, details, status }),
            });

            if (!response.ok) {
              throw new Error(response.statusText);
            }

            return response.json();
          } catch (error) {
            Swal.showValidationMessage(`Request failed: ${error}`);
          }
        },
        allowOutsideClick: () => !Swal.isLoading(),
      }).then((result) => {
        if (result.isConfirmed) {
          Swal.fire({
            title: "Success",
            text: " Updated Successfully!",
            icon: "success",
          });
          window.location.reload();
        }
      });
    } else {
      Swal.fire({
        title: "Error",
        text: "You don't have permission to edit",
        icon: "error",
      });
    }
  };

  const [dataSource, setDataSource] = useState<Stock[]>([]);

  const handleDelete = async (id: string) => {
    if( usernameRole === "admin") {
    const result = await axios.post(
      "/api/stock/delete",
      {
        id: id,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
        maxBodyLength: Infinity,
      }
    );
    Swal.fire({
      title: "Delete Success",
      icon: "success",
    });
    const newData = dataSource.filter((item) => item.id !== id);
    setDataSource(newData);
  } else {
    Swal.fire({
      title: "Error",
      text: "You don't have permission to delete",
      icon: "error",
    });
  }
  };

  const handleSignout = () => {
    localStorage.removeItem("usernamelogin");
    router.push("/");
  };

  const defaultColumns: (ColumnTypes[number] & {
    editable?: boolean;
    dataIndex: string;
  })[] = [
    {
      title: "id",
      dataIndex: "id",
    },
    {
      title: "type",
      dataIndex: "type",
    },
    {
      title: "name",
      dataIndex: "name",
    },
    {
      title: "details",
      dataIndex: "details",
    },
    {
      title: "status",
      dataIndex: "status",
    },
    {
      title: "operation",
      dataIndex: "operation",
      render: (_, record) =>
        dataSource.length >= 1 ? (
          <Space size="middle">
            <a
              onClick={() =>
                EditUser(
                  record.id,
                  record.name,
                  record.type,
                  record.details,
                  record.status
                )
              }
            >
              Edit
            </a>
            <Popconfirm
              title="Sure to delete?"
              onConfirm={() => handleDelete(record.id)}
            >
              <a>Delete</a>
            </Popconfirm>
          </Space>
        ) : null,
    },
  ];

  const handleAdd = () => {
    Swal.fire({
      title: "New Device",
      html:
        '<input id="type" class="swal2-input" placeholder="type"">' +
        '<input id="name" class="swal2-input" placeholder="name" >' +
        '<input id="details" class="swal2-input" placeholder="details" >' +
        '<input id="status" class="swal2-input" placeholder="status" >',
      showCancelButton: true,
      confirmButtonText: "Submit",
      showLoaderOnConfirm: true,
      preConfirm: async () => {
        const typeInput = document.getElementById("type") as HTMLInputElement;
        const nameInput = document.getElementById("name") as HTMLInputElement;
        const detailsInput = document.getElementById(
          "details"
        ) as HTMLInputElement;
        const statusInput = document.getElementById(
          "status"
        ) as HTMLInputElement;

        const type = typeInput.value;
        const name = nameInput.value;
        const details = detailsInput.value;
        const status = statusInput.value;

        try {
          const response = await fetch("/api/stock/create", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ type, name, details, status }),
          });

          if (!response.ok) {
            throw new Error(response.statusText);
          }

          return response.json();
        } catch (error) {
          Swal.showValidationMessage(`Request failed: ${error}`);
        }
      },
      allowOutsideClick: () => !Swal.isLoading(),
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "Success",
          text: " Created New Device Successfully!",
          icon: "success",
        });
        window.location.reload();
      }
    });
  };

  const handleSave = (row: Stock) => {
    const newData = [...dataSource];
    const index = newData.findIndex((item) => row.id === item.id);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
      ...row,
    });
    setDataSource(newData);
  };

  const components = {
    body: {
      row: EditableRow,
    },
  };

  const columns = defaultColumns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record: Stock) => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        handleSave,
      }),
    };
  });

  return (
    <div className="bg-gray-700 w-screen h-screen ">
      <Layout className="w-screen h-screen">
        <Sider trigger={null} collapsible collapsed={collapsed}>
          <div className="demo-logo-vertical" />
          <Menu
            theme="dark"
            mode="inline"
            defaultSelectedKeys={["1"]}
            onClick={(e) => setCurrentPage(e.key)}
            items={[
              {
                key: "list",
                icon: <UserOutlined />,
                label: "list",
              },
              {
                key: "manage",
                icon: <SettingOutlined />,
                label: "Manage",
              },
            ]}
          />
        </Sider>
        <Layout>
          <Header
            className="flex justify-between"
            style={{ padding: 0, background: colorBgContainer }}
          >
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{
                fontSize: "16px",
                width: 64,
                height: 64,
              }}
            />
            <div className="flex items-center text-blue-600 font-bold text-2xl mr-5">
              <h1 className="m-3">ยินดีต้อนรับ {usernamelogin}</h1>
              <Button
                className="w-5"
                type="primary"
                danger
                onClick={handleSignout}
                icon={<LogoutOutlined />}
              />
            </div>
          </Header>
          <Content
            style={{
              margin: "24px 16px",
              padding: 24,
              minHeight: 280,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            {currentPage == "list" && (
              <>
                <Form.Item name="search">
                  <Input
                    prefix={<SearchOutlined />}
                    placeholder="Search"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </Form.Item>
                <div
                  id="scrollableDiv"
                  style={{
                    height: 715,
                    overflow: "auto",
                    padding: "0 16px",
                    border: "1px solid rgba(140, 140, 140, 0.35)",
                  }}
                >
                  <List
                    dataSource={filteredData}
                    renderItem={(item) => (
                      <List.Item key={item.id}>
                        <List.Item.Meta
                          title={<a href="#">{item.name}</a>}
                          description={`Code: ${item.id}, Type: ${item.type}, Status: ${item.status}`}
                        />
                      </List.Item>
                    )}
                  />
                </div>
              </>
            )}
            {currentPage === "manage" && (
              <div>
                <div>
                  <Button
                    onClick={handleAdd}
                    type="primary"
                    style={{ marginBottom: 16 }}
                  >
                    Add Stock
                  </Button>
                  <Table
                    components={components}
                    rowClassName={() => "editable-row"}
                    bordered
                    dataSource={dataSource}
                    columns={columns as ColumnTypes}
                  />
                </div>
              </div>
            )}
          </Content>
        </Layout>
      </Layout>
    </div>
  );
}
