import { Button, Card, Space, Table, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import type { Employee } from "../types";

type Props = {
  employees: Employee[];
  onEdit: (employee: Employee) => void;
  onDelete: (id: number) => Promise<void>;
};

export default function EmployeeTable({ employees, onEdit, onDelete }: Props) {
  const columns: ColumnsType<Employee> = [
    { title: "ID", dataIndex: "id", key: "id", width: 80 },
    { title: "Name", dataIndex: "full_name", key: "full_name" },
    { title: "Title", dataIndex: "job_title", key: "job_title" },
    { title: "Country", dataIndex: "country", key: "country" },
    {
      title: "Salary",
      dataIndex: "salary",
      key: "salary",
      render: (value: number) => value.toLocaleString(),
    },
    { title: "Department", dataIndex: "department", key: "department" },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (value: string) => (
        <Tag color={value === "active" ? "green" : "default"}>{value.toUpperCase()}</Tag>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, row) => (
        <Space>
          <Button onClick={() => onEdit(row)}>Edit</Button>
          <Button danger onClick={() => onDelete(row.id)}>
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <Card title="Employees" className="section-card">
      <Table
        rowKey="id"
        columns={columns}
        dataSource={employees}
        pagination={{ pageSize: 10, showSizeChanger: false }}
        scroll={{ x: 1000 }}
      />
    </Card>
  );
}
