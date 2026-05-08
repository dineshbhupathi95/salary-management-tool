import { useEffect } from "react";
import { Button, Form, Input, InputNumber, Select, Space } from "antd";
import type { Employee, EmployeePayload } from "../types";

type Props = {
  selectedEmployee?: Employee | null;
  onSubmit: (payload: EmployeePayload, employeeId?: number) => Promise<void>;
  onCancelEdit: () => void;
  showCard?: boolean;
};

export default function EmployeeForm({
  selectedEmployee,
  onSubmit,
  onCancelEdit,
  showCard = true,
}: Props) {
  const [form] = Form.useForm<EmployeePayload>();
  const isEditing = Boolean(selectedEmployee);

  useEffect(() => {
    if (selectedEmployee) {
      form.setFieldsValue({
        full_name: selectedEmployee.full_name,
        job_title: selectedEmployee.job_title,
        country: selectedEmployee.country,
        salary: selectedEmployee.salary,
        department: selectedEmployee.department,
        status: selectedEmployee.status,
      });
    } else {
      form.resetFields();
      form.setFieldsValue({ department: "General", status: "active" });
    }
  }, [selectedEmployee, form]);

  async function handleSubmit(values: EmployeePayload) {
    await onSubmit(values, selectedEmployee?.id);
    if (!isEditing) {
      form.resetFields();
      form.setFieldsValue({ department: "General", status: "active" });
    }
  }

  const formContent = (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleSubmit}
      initialValues={{ department: "General", status: "active" }}
    >
      <div className="form-grid">
        <Form.Item<EmployeePayload>
          name="full_name"
          label="Full Name"
          rules={[{ required: true, message: "Please enter full name" }]}
        >
          <Input placeholder="e.g. Alex Johnson" />
        </Form.Item>
        <Form.Item<EmployeePayload>
          name="job_title"
          label="Job Title"
          rules={[{ required: true, message: "Please enter job title" }]}
        >
          <Input placeholder="e.g. Software Engineer" />
        </Form.Item>
        <Form.Item<EmployeePayload>
          name="country"
          label="Country"
          rules={[{ required: true, message: "Please enter country" }]}
        >
          <Input placeholder="e.g. India" />
        </Form.Item>
        <Form.Item<EmployeePayload>
          name="salary"
          label="Salary"
          rules={[{ required: true, message: "Please enter salary" }]}
        >
          <InputNumber min={0} style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item<EmployeePayload>
          name="department"
          label="Department"
          rules={[{ required: true, message: "Please enter department" }]}
        >
          <Input placeholder="e.g. Engineering" />
        </Form.Item>
        <Form.Item<EmployeePayload>
          name="status"
          label="Status"
          rules={[{ required: true, message: "Please select status" }]}
        >
          <Select
            options={[
              { label: "Active", value: "active" },
              { label: "Inactive", value: "inactive" },
            ]}
          />
        </Form.Item>
      </div>
      <Space>
        <Button type="primary" htmlType="submit">
          {isEditing ? "Save Changes" : "Create Employee"}
        </Button>
        <Button onClick={onCancelEdit}>{isEditing ? "Cancel Edit" : "Cancel"}</Button>
      </Space>
    </Form>
  );

  if (!showCard) {
    return formContent;
  }

  return formContent;
}
