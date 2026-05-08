import { useEffect, useState } from "react";
import {
  BarChartOutlined,
  PlusOutlined,
  TeamOutlined,
  UsergroupAddOutlined,
} from "@ant-design/icons";
import {
  Alert,
  Button,
  Card,
  Input,
  Layout,
  Menu,
  Modal,
  Select,
  Space,
  Typography,
} from "antd";
import type { MenuProps } from "antd";
import { api } from "./api/client";
import EmployeeForm from "./components/EmployeeForm";
import EmployeeTable from "./components/EmployeeTable";
import InsightsPanel from "./components/InsightsPanel";
import type { Employee, EmployeePayload } from "./types";

const { Header, Content, Sider } = Layout;
const { Title, Text } = Typography;

export default function App() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [isEmployeeModalOpen, setIsEmployeeModalOpen] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<"employees" | "insights">("employees");
  const [searchName, setSearchName] = useState("");
  const [sortBy, setSortBy] = useState<
    "full_name" | "job_title" | "country" | "salary" | "created_at"
  >("full_name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  async function loadEmployees() {
    try {
      setError("");
      setEmployees(
        await api.listEmployees({
          skip: 0,
          limit: 200,
          name: searchName,
          sortBy,
          sortOrder,
        })
      );
    } catch (e) {
      setError((e as Error).message);
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      loadEmployees();
    }, 300);
    return () => clearTimeout(timer);
  }, [searchName, sortBy, sortOrder]);

  async function handleSubmit(payload: EmployeePayload, employeeId?: number) {
    if (employeeId) {
      await api.updateEmployee(employeeId, payload);
      setSelectedEmployee(null);
    } else {
      await api.createEmployee(payload);
    }
    setIsEmployeeModalOpen(false);
    setSelectedEmployee(null);
    await loadEmployees();
  }

  async function handleDelete(employeeId: number) {
    await api.deleteEmployee(employeeId);
    if (selectedEmployee?.id === employeeId) {
      setSelectedEmployee(null);
    }
    await loadEmployees();
  }

  const menuItems: MenuProps["items"] = [
    { key: "employees", icon: <TeamOutlined />, label: "Employees" },
    { key: "insights", icon: <BarChartOutlined />, label: "Insights" },
  ];

  function openCreateModal() {
    setSelectedEmployee(null);
    setIsEmployeeModalOpen(true);
  }

  function openEditModal(employee: Employee) {
    setSelectedEmployee(employee);
    setIsEmployeeModalOpen(true);
  }

  function closeEmployeeModal() {
    setIsEmployeeModalOpen(false);
    setSelectedEmployee(null);
  }

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        width={240}
        theme="light"
        style={{ borderRight: "1px solid #f0f0f0" }}
        breakpoint="lg"
        collapsedWidth="0"
      >
        <div className="sider-brand">
          <UsergroupAddOutlined />
          <span>HR Console</span>
        </div>
        <Menu
          mode="inline"
          selectedKeys={[activeTab]}
          items={menuItems}
          onClick={(e) => setActiveTab(e.key as "employees" | "insights")}
        />
      </Sider>
      <Layout>
        <Header className="app-header">
          <Title level={4} style={{ color: "#fff", margin: 0 }}>
            Salary Management Tool
          </Title>
          <Text style={{ color: "rgba(255,255,255,0.75)" }}>
            Manage employees and salary intelligence at scale
          </Text>
        </Header>
        <Content className="content-area">
          {error && (
            <Alert
              type="error"
              message="Request failed"
              description={error}
              showIcon
              style={{ marginBottom: 16 }}
            />
          )}

          {activeTab === "employees" && (
            <Space direction="vertical" size={16} style={{ display: "flex" }}>
              <Card title="Search and Sort Employees" className="section-card">
                <Space wrap>
                  <Input
                    value={searchName}
                    onChange={(e) => setSearchName(e.target.value)}
                    placeholder="Search by employee name"
                    style={{ width: 260 }}
                  />
                  <Select
                    value={sortBy}
                    style={{ width: 190 }}
                    onChange={(value) =>
                      setSortBy(
                        value as
                          | "full_name"
                          | "job_title"
                          | "country"
                          | "salary"
                          | "created_at"
                      )
                    }
                    options={[
                      { label: "Sort by Name", value: "full_name" },
                      { label: "Sort by Job Title", value: "job_title" },
                      { label: "Sort by Country", value: "country" },
                      { label: "Sort by Salary", value: "salary" },
                      { label: "Sort by Created Date", value: "created_at" },
                    ]}
                  />
                  <Select
                    value={sortOrder}
                    style={{ width: 170 }}
                    onChange={(value) => setSortOrder(value as "asc" | "desc")}
                    options={[
                      { label: "Ascending", value: "asc" },
                      { label: "Descending", value: "desc" },
                    ]}
                  />
                  <Button type="primary" icon={<PlusOutlined />} onClick={openCreateModal}>
                    Create Employee
                  </Button>
                </Space>
              </Card>
              <EmployeeTable
                employees={employees}
                onEdit={openEditModal}
                onDelete={handleDelete}
              />
            </Space>
          )}

          {activeTab === "insights" && <InsightsPanel />}
        </Content>
      </Layout>
      <Modal
        title={selectedEmployee ? "Update Employee" : "Create Employee"}
        open={isEmployeeModalOpen}
        onCancel={closeEmployeeModal}
        footer={null}
        width={900}
        destroyOnClose
      >
        <EmployeeForm
          selectedEmployee={selectedEmployee}
          onSubmit={handleSubmit}
          onCancelEdit={closeEmployeeModal}
          showCard={false}
        />
      </Modal>
    </Layout>
  );
}
