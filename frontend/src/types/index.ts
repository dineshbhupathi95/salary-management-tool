export type Employee = {
  id: number;
  full_name: string;
  job_title: string;
  country: string;
  salary: number;
  department: string;
  status: "active" | "inactive";
  created_at: string;
  updated_at: string;
};

export type EmployeePayload = Omit<Employee, "id" | "created_at" | "updated_at">;

export type CountryInsights = {
  country: string;
  employee_count: number;
  min_salary: number;
  max_salary: number;
  average_salary: number;
  median_salary: number;
};

export type JobTitleInsights = {
  country: string;
  job_title: string;
  employee_count: number;
  average_salary: number;
};

export type OverviewInsights = {
  total_employees: number;
  active_employees: number;
  inactive_employees: number;
  global_average_salary: number;
};
