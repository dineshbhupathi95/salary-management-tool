from datetime import datetime

from pydantic import BaseModel, Field


class EmployeeBase(BaseModel):
    full_name: str = Field(min_length=2, max_length=120)
    job_title: str = Field(min_length=2, max_length=80)
    country: str = Field(min_length=2, max_length=80)
    salary: int = Field(ge=0, le=2_000_000)
    department: str = Field(default="General", min_length=2, max_length=80)
    status: str = Field(default="active", pattern="^(active|inactive)$")


class EmployeeCreate(EmployeeBase):
    pass


class EmployeeUpdate(BaseModel):
    full_name: str | None = Field(default=None, min_length=2, max_length=120)
    job_title: str | None = Field(default=None, min_length=2, max_length=80)
    country: str | None = Field(default=None, min_length=2, max_length=80)
    salary: int | None = Field(default=None, ge=0, le=2_000_000)
    department: str | None = Field(default=None, min_length=2, max_length=80)
    status: str | None = Field(default=None, pattern="^(active|inactive)$")


class EmployeeOut(EmployeeBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class CountryInsights(BaseModel):
    country: str
    employee_count: int
    min_salary: int
    max_salary: int
    average_salary: float
    median_salary: float


class JobTitleInsights(BaseModel):
    country: str
    job_title: str
    employee_count: int
    average_salary: float


class OverviewInsights(BaseModel):
    total_employees: int
    active_employees: int
    inactive_employees: int
    global_average_salary: float
