import random
import time
from pathlib import Path

from sqlalchemy import insert

from app.database import SessionLocal, engine
from app.models import Base, Employee

COUNTRIES = ["India", "USA", "Germany", "UK", "Canada", "Australia"]
JOB_TITLES = [
    "Software Engineer",
    "Senior Software Engineer",
    "HR Manager",
    "Data Analyst",
    "Product Manager",
    "QA Engineer",
]
DEPARTMENTS = ["Engineering", "HR", "Product", "Data", "Operations"]
STATUSES = ["active", "inactive"]


def load_names(path: Path) -> list[str]:
    return [line.strip() for line in path.read_text().splitlines() if line.strip()]


def generate_employees(count: int, first_names: list[str], last_names: list[str]) -> list[dict]:
    records = []
    for _ in range(count):
        records.append(
            {
                "full_name": f"{random.choice(first_names)} {random.choice(last_names)}",
                "job_title": random.choice(JOB_TITLES),
                "country": random.choice(COUNTRIES),
                "salary": random.randint(30_000, 220_000),
                "department": random.choice(DEPARTMENTS),
                "status": random.choices(STATUSES, weights=[90, 10], k=1)[0],
            }
        )
    return records


def seed(total_records: int = 10_000, batch_size: int = 1_000):
    start = time.perf_counter()
    Base.metadata.create_all(bind=engine)

    data_dir = Path(__file__).resolve().parents[1] / "data"
    first_names = load_names(data_dir / "first_names.txt")
    last_names = load_names(data_dir / "last_names.txt")

    db = SessionLocal()
    try:
        db.query(Employee).delete()
        db.commit()

        generated = 0
        while generated < total_records:
            size = min(batch_size, total_records - generated)
            payload = generate_employees(size, first_names, last_names)
            db.execute(insert(Employee), payload)
            db.commit()
            generated += size

        elapsed = round(time.perf_counter() - start, 2)
        print(f"Seeded {total_records} employees in {elapsed}s")
    finally:
        db.close()


if __name__ == "__main__":
    seed()
