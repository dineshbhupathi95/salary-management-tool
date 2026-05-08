def test_country_and_role_insights(client):
    employees = [
        {
            "full_name": "A One",
            "job_title": "Software Engineer",
            "country": "India",
            "salary": 100000,
            "department": "Engineering",
            "status": "active",
        },
        {
            "full_name": "B Two",
            "job_title": "Software Engineer",
            "country": "India",
            "salary": 120000,
            "department": "Engineering",
            "status": "active",
        },
        {
            "full_name": "C Three",
            "job_title": "HR Manager",
            "country": "India",
            "salary": 80000,
            "department": "HR",
            "status": "inactive",
        },
    ]
    for employee in employees:
        client.post("/employees", json=employee)

    country = client.get("/insights/country/India")
    assert country.status_code == 200
    body = country.json()
    assert body["employee_count"] == 3
    assert body["min_salary"] == 80000
    assert body["max_salary"] == 120000
    assert body["average_salary"] == 100000.0

    role = client.get("/insights/country/India/job-title/Software Engineer")
    assert role.status_code == 200
    assert role.json()["average_salary"] == 110000.0


def test_overview_insights(client):
    client.post(
        "/employees",
        json={
            "full_name": "D Four",
            "job_title": "Product Manager",
            "country": "Germany",
            "salary": 130000,
            "department": "Product",
            "status": "active",
        },
    )
    res = client.get("/insights/overview")
    assert res.status_code == 200
    assert res.json()["total_employees"] == 1


def test_metadata_lists_for_country_and_job_titles(client):
    employees = [
        {
            "full_name": "E Five",
            "job_title": "Software Engineer",
            "country": "India",
            "salary": 100000,
            "department": "Engineering",
            "status": "active",
        },
        {
            "full_name": "F Six",
            "job_title": "Product Manager",
            "country": "USA",
            "salary": 140000,
            "department": "Product",
            "status": "active",
        },
        {
            "full_name": "G Seven",
            "job_title": "QA Engineer",
            "country": "India",
            "salary": 90000,
            "department": "Engineering",
            "status": "active",
        },
    ]
    for employee in employees:
        client.post("/employees", json=employee)

    countries = client.get("/metadata/countries")
    assert countries.status_code == 200
    assert countries.json() == ["India", "USA"]

    india_titles = client.get("/metadata/job-titles?country=India")
    assert india_titles.status_code == 200
    assert india_titles.json() == ["QA Engineer", "Software Engineer"]
