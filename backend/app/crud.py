from statistics import median

from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.models import Employee
from app.schemas import EmployeeCreate, EmployeeUpdate


def create_employee(db: Session, payload: EmployeeCreate) -> Employee:
    employee = Employee(**payload.model_dump())
    db.add(employee)
    db.commit()
    db.refresh(employee)
    return employee


def get_employee(db: Session, employee_id: int) -> Employee | None:
    return db.get(Employee, employee_id)


def list_employees(
    db: Session,
    skip: int = 0,
    limit: int = 50,
    name: str | None = None,
    sort_by: str = "id",
    sort_order: str = "asc",
) -> list[Employee]:
    sort_field_map = {
        "id": Employee.id,
        "full_name": Employee.full_name,
        "job_title": Employee.job_title,
        "country": Employee.country,
        "salary": Employee.salary,
        "created_at": Employee.created_at,
    }
    sort_column = sort_field_map.get(sort_by, Employee.id)
    order_clause = sort_column.desc() if sort_order == "desc" else sort_column.asc()

    stmt = select(Employee)
    if name:
        stmt = stmt.where(Employee.full_name.ilike(f"%{name}%"))

    stmt = stmt.order_by(order_clause).offset(skip).limit(limit)
    return list(db.scalars(stmt))


def update_employee(db: Session, employee: Employee, payload: EmployeeUpdate) -> Employee:
    for key, value in payload.model_dump(exclude_unset=True).items():
        setattr(employee, key, value)
    db.commit()
    db.refresh(employee)
    return employee


def delete_employee(db: Session, employee: Employee) -> None:
    db.delete(employee)
    db.commit()


def country_insights(db: Session, country: str) -> dict:
    stmt = select(Employee.salary).where(Employee.country == country)
    salaries = [row for row in db.scalars(stmt)]
    if not salaries:
        return {}

    return {
        "country": country,
        "employee_count": len(salaries),
        "min_salary": min(salaries),
        "max_salary": max(salaries),
        "average_salary": round(sum(salaries) / len(salaries), 2),
        "median_salary": float(median(salaries)),
    }


def job_title_insights(db: Session, country: str, job_title: str) -> dict:
    stmt = select(Employee.salary).where(
        Employee.country == country, Employee.job_title == job_title
    )
    salaries = [row for row in db.scalars(stmt)]
    if not salaries:
        return {}
    return {
        "country": country,
        "job_title": job_title,
        "employee_count": len(salaries),
        "average_salary": round(sum(salaries) / len(salaries), 2),
    }


def overview_insights(db: Session) -> dict:
    total = db.scalar(select(func.count(Employee.id))) or 0
    active = (
        db.scalar(select(func.count(Employee.id)).where(Employee.status == "active")) or 0
    )
    inactive = (
        db.scalar(select(func.count(Employee.id)).where(Employee.status == "inactive"))
        or 0
    )
    avg_salary = db.scalar(select(func.avg(Employee.salary))) or 0
    return {
        "total_employees": total,
        "active_employees": active,
        "inactive_employees": inactive,
        "global_average_salary": round(float(avg_salary), 2),
    }


def list_countries(db: Session) -> list[str]:
    stmt = select(Employee.country).distinct().order_by(Employee.country.asc())
    return list(db.scalars(stmt))


def list_job_titles(db: Session, country: str | None = None) -> list[str]:
    stmt = select(Employee.job_title).distinct()
    if country:
        stmt = stmt.where(Employee.country == country)
    stmt = stmt.order_by(Employee.job_title.asc())
    return list(db.scalars(stmt))
