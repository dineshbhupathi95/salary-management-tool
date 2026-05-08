def test_create_and_get_employee(client):
    payload = {
        "full_name": "Alice Doe",
        "job_title": "Software Engineer",
        "country": "India",
        "salary": 120000,
        "department": "Engineering",
        "status": "active",
    }
    created = client.post("/employees", json=payload)
    assert created.status_code == 201
    employee_id = created.json()["id"]

    fetched = client.get(f"/employees/{employee_id}")
    assert fetched.status_code == 200
    assert fetched.json()["full_name"] == "Alice Doe"


def test_update_and_delete_employee(client):
    payload = {
        "full_name": "Bob Doe",
        "job_title": "Data Analyst",
        "country": "USA",
        "salary": 90000,
        "department": "Data",
        "status": "active",
    }
    created = client.post("/employees", json=payload).json()
    employee_id = created["id"]

    updated = client.put(f"/employees/{employee_id}", json={"salary": 95000})
    assert updated.status_code == 200
    assert updated.json()["salary"] == 95000

    deleted = client.delete(f"/employees/{employee_id}")
    assert deleted.status_code == 204

    fetched = client.get(f"/employees/{employee_id}")
    assert fetched.status_code == 404


def test_list_employees_with_name_search_and_sort(client):
    employees = [
        {
            "full_name": "Zara Zee",
            "job_title": "Software Engineer",
            "country": "India",
            "salary": 90000,
            "department": "Engineering",
            "status": "active",
        },
        {
            "full_name": "Alice Alpha",
            "job_title": "Software Engineer",
            "country": "India",
            "salary": 120000,
            "department": "Engineering",
            "status": "active",
        },
        {
            "full_name": "Bob Beta",
            "job_title": "QA Engineer",
            "country": "USA",
            "salary": 80000,
            "department": "Engineering",
            "status": "active",
        },
    ]
    for employee in employees:
        client.post("/employees", json=employee)

    filtered = client.get("/employees?name=Ali")
    assert filtered.status_code == 200
    body = filtered.json()
    assert len(body) == 1
    assert body[0]["full_name"] == "Alice Alpha"

    sorted_by_salary_desc = client.get("/employees?sort_by=salary&sort_order=desc")
    assert sorted_by_salary_desc.status_code == 200
    sorted_body = sorted_by_salary_desc.json()
    assert sorted_body[0]["salary"] == 120000

    sorted_by_created_desc = client.get("/employees?sort_by=created_at&sort_order=desc")
    assert sorted_by_created_desc.status_code == 200
    created_sorted_body = sorted_by_created_desc.json()
    assert created_sorted_body[0]["full_name"] == "Bob Beta"
