from fastapi import Depends, FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from app import crud, models, schemas
from app.database import Base, engine, get_db

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Salary Management Tool", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health():
    return {"status": "ok"}

'''
Create Employees API

'''
@app.post("/employees", response_model=schemas.EmployeeOut, status_code=201)
def create_employee(payload: schemas.EmployeeCreate, db: Session = Depends(get_db)):
    return crud.create_employee(db, payload)


@app.get("/employees", response_model=list[schemas.EmployeeOut])
def get_employees(
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=50, ge=1, le=500),
    name: str | None = Query(default=None, min_length=1),
    sort_by: str = Query(
        default="id", pattern="^(id|full_name|job_title|country|salary|created_at)$"
    ),
    sort_order: str = Query(default="asc", pattern="^(asc|desc)$"),
    db: Session = Depends(get_db),
):
    return crud.list_employees(
        db, skip=skip, limit=limit, name=name, sort_by=sort_by, sort_order=sort_order
    )


@app.get("/employees/{employee_id}", response_model=schemas.EmployeeOut)
def get_employee(employee_id: int, db: Session = Depends(get_db)):
    employee = crud.get_employee(db, employee_id)
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")
    return employee


@app.put("/employees/{employee_id}", response_model=schemas.EmployeeOut)
def update_employee(
    employee_id: int, payload: schemas.EmployeeUpdate, db: Session = Depends(get_db)
):
    employee = crud.get_employee(db, employee_id)
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")
    return crud.update_employee(db, employee, payload)


@app.delete("/employees/{employee_id}", status_code=204)
def delete_employee(employee_id: int, db: Session = Depends(get_db)):
    employee = crud.get_employee(db, employee_id)
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")
    crud.delete_employee(db, employee)
    return None


@app.get("/insights/country/{country}", response_model=schemas.CountryInsights)
def get_country_insights(country: str, db: Session = Depends(get_db)):
    result = crud.country_insights(db, country)
    if not result:
        raise HTTPException(status_code=404, detail="No employees for country")
    return result


@app.get(
    "/insights/country/{country}/job-title/{job_title}",
    response_model=schemas.JobTitleInsights,
)
def get_job_title_insights(country: str, job_title: str, db: Session = Depends(get_db)):
    result = crud.job_title_insights(db, country, job_title)
    if not result:
        raise HTTPException(status_code=404, detail="No employees for that country and role")
    return result


@app.get("/insights/overview", response_model=schemas.OverviewInsights)
def get_overview_insights(db: Session = Depends(get_db)):
    return crud.overview_insights(db)


@app.get("/metadata/countries", response_model=list[str])
def get_countries(db: Session = Depends(get_db)):
    return crud.list_countries(db)


@app.get("/metadata/job-titles", response_model=list[str])
def get_job_titles(country: str | None = Query(default=None), db: Session = Depends(get_db)):
    return crud.list_job_titles(db, country=country)
