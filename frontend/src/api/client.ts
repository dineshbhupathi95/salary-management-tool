import type {
  CountryInsights,
  Employee,
  EmployeePayload,
  JobTitleInsights,
  OverviewInsights,
} from "../types";

const API_BASE = "http://127.0.0.1:8000";

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!response.ok) {
    const body = await response.text();
    throw new Error(body || `Request failed with status ${response.status}`);
  }
  if (response.status === 204) {
    return undefined as T;
  }
  return response.json();
}

export const api = {
  listEmployees: (
    params: {
      skip?: number;
      limit?: number;
      name?: string;
      sortBy?: "id" | "full_name" | "job_title" | "country" | "salary" | "created_at";
      sortOrder?: "asc" | "desc";
    } = {}
  ) => {
    const searchParams = new URLSearchParams();
    searchParams.set("skip", String(params.skip ?? 0));
    searchParams.set("limit", String(params.limit ?? 200));
    searchParams.set("sort_by", params.sortBy ?? "id");
    searchParams.set("sort_order", params.sortOrder ?? "asc");
    if (params.name?.trim()) {
      searchParams.set("name", params.name.trim());
    }
    return request<Employee[]>(`/employees?${searchParams.toString()}`);
  },
  createEmployee: (payload: EmployeePayload) =>
    request<Employee>("/employees", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  updateEmployee: (id: number, payload: Partial<EmployeePayload>) =>
    request<Employee>(`/employees/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    }),
  deleteEmployee: (id: number) =>
    request<void>(`/employees/${id}`, {
      method: "DELETE",
    }),
  countryInsights: (country: string) =>
    request<CountryInsights>(`/insights/country/${encodeURIComponent(country)}`),
  jobTitleInsights: (country: string, jobTitle: string) =>
    request<JobTitleInsights>(
      `/insights/country/${encodeURIComponent(country)}/job-title/${encodeURIComponent(
        jobTitle
      )}`
    ),
  overviewInsights: () => request<OverviewInsights>("/insights/overview"),
  listCountries: () => request<string[]>("/metadata/countries"),
  listJobTitles: (country?: string) =>
    request<string[]>(
      `/metadata/job-titles${
        country ? `?country=${encodeURIComponent(country)}` : ""
      }`
    ),
};
