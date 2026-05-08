import { useEffect, useMemo, useState } from "react";
import {
  Button,
  Card,
  Col,
  Progress,
  Row,
  Select,
  Space,
  Statistic,
  Tag,
  Typography,
  message,
} from "antd";
import { api } from "../api/client";
import type { CountryInsights, JobTitleInsights, OverviewInsights } from "../types";

const { Text } = Typography;

export default function InsightsPanel() {
  const [country, setCountry] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [countryInsights, setCountryInsights] = useState<CountryInsights | null>(null);
  const [jobInsights, setJobInsights] = useState<JobTitleInsights | null>(null);
  const [overview, setOverview] = useState<OverviewInsights | null>(null);
  const [countries, setCountries] = useState<string[]>([]);
  const [jobTitles, setJobTitles] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [loadingOverview, setLoadingOverview] = useState(false);
  const [loadingCountry, setLoadingCountry] = useState(false);
  const [loadingRole, setLoadingRole] = useState(false);

  const derivedMetrics = useMemo(() => {
    const salarySpread = countryInsights
      ? countryInsights.max_salary - countryInsights.min_salary
      : null;
    const roleVsCountryDelta =
      countryInsights && jobInsights
        ? Number((jobInsights.average_salary - countryInsights.average_salary).toFixed(2))
        : null;
    const activeRatio =
      overview && overview.total_employees > 0
        ? Number(((overview.active_employees / overview.total_employees) * 100).toFixed(1))
        : null;

    return { salarySpread, roleVsCountryDelta, activeRatio };
  }, [countryInsights, jobInsights, overview]);

  useEffect(() => {
    async function loadDropdownData() {
      try {
        const [countriesList, jobTitlesList] = await Promise.all([
          api.listCountries(),
          api.listJobTitles(),
        ]);
        setCountries(countriesList);
        setJobTitles(jobTitlesList);
      } catch {
        message.error("Unable to load country/job title options");
      }
    }
    loadDropdownData();
  }, []);

  useEffect(() => {
    async function loadJobTitlesByCountry() {
      try {
        const titles = await api.listJobTitles(country || undefined);
        setJobTitles(titles);
        if (jobTitle && !titles.includes(jobTitle)) {
          setJobTitle("");
        }
      } catch {
        message.error("Unable to refresh job title options");
      }
    }
    loadJobTitlesByCountry();
  }, [country]);

  async function loadOverview() {
    setError("");
    setLoadingOverview(true);
    try {
      setOverview(await api.overviewInsights());
    } catch (e) {
      const msg = (e as Error).message;
      setError(msg);
      message.error("Unable to load overview insights");
    } finally {
      setLoadingOverview(false);
    }
  }

  async function loadCountryInsights() {
    if (!country) {
      message.warning("Please select a country first");
      return;
    }
    setError("");
    setLoadingCountry(true);
    try {
      setCountryInsights(await api.countryInsights(country));
    } catch (e) {
      const msg = (e as Error).message;
      setError(msg);
      message.error("Unable to load country insights");
    } finally {
      setLoadingCountry(false);
    }
  }

  async function loadJobInsights() {
    if (!country || !jobTitle) {
      message.warning("Please select both country and job title");
      return;
    }
    setError("");
    setLoadingRole(true);
    try {
      setJobInsights(await api.jobTitleInsights(country, jobTitle));
    } catch (e) {
      const msg = (e as Error).message;
      setError(msg);
      message.error("Unable to load role insights");
    } finally {
      setLoadingRole(false);
    }
  }

  return (
    <Space direction="vertical" size={16} style={{ display: "flex" }}>
      <Card title="Insights Controls" className="section-card">
        <Space wrap>
          <Button type="primary" onClick={loadOverview} loading={loadingOverview}>
            Load Overview
          </Button>
          <Select
            value={country || undefined}
            onChange={(value) => setCountry(value ?? "")}
            placeholder="Select country"
            style={{ width: 220 }}
            showSearch
            allowClear
            optionFilterProp="label"
            options={countries.map((value) => ({ value, label: value }))}
          />
          <Button onClick={loadCountryInsights} loading={loadingCountry}>
            Country Insights
          </Button>
          <Select
            value={jobTitle || undefined}
            onChange={(value) => setJobTitle(value ?? "")}
            placeholder="Select job title"
            style={{ width: 220 }}
            showSearch
            allowClear
            optionFilterProp="label"
            options={jobTitles.map((value) => ({ value, label: value }))}
          />
          <Button onClick={loadJobInsights} loading={loadingRole}>
            Role Insights
          </Button>
        </Space>
        {error && <p className="error-text">{error}</p>}
      </Card>

      {overview && (
        <Card title="Overview Metrics" className="section-card" loading={loadingOverview}>
          <Row gutter={[16, 16]}>
            <Col xs={24} md={12} lg={6}>
              <Statistic title="Total Employees" value={overview.total_employees} />
            </Col>
            <Col xs={24} md={12} lg={6}>
              <Statistic title="Active Employees" value={overview.active_employees} />
            </Col>
            <Col xs={24} md={12} lg={6}>
              <Statistic title="Inactive Employees" value={overview.inactive_employees} />
            </Col>
            <Col xs={24} md={12} lg={6}>
              <Statistic
                title="Global Avg Salary"
                value={overview.global_average_salary}
                precision={2}
              />
            </Col>
            <Col xs={24} md={12} lg={6}>
              <Statistic
                title="Active Workforce Ratio"
                value={derivedMetrics.activeRatio ?? 0}
                suffix="%"
              />
            </Col>
            <Col span={24}>
              <Progress
                percent={derivedMetrics.activeRatio ?? 0}
                status="active"
                strokeColor="#16a34a"
                trailColor="#f3f4f6"
              />
            </Col>
          </Row>
        </Card>
      )}

      {countryInsights && (
        <Card title={`Country Insights: ${countryInsights.country}`} className="section-card">
          <Space style={{ marginBottom: 12 }}>
            <Tag color="blue">Required Metric</Tag>
            <Text type="secondary">
              Includes minimum, maximum and average salary for selected country.
            </Text>
          </Space>
          <Row gutter={[16, 16]}>
            <Col xs={24} md={12} lg={8}>
              <Statistic title="Employee Count" value={countryInsights.employee_count} />
            </Col>
            <Col xs={24} md={12} lg={8}>
              <Statistic title="Min Salary" value={countryInsights.min_salary} />
            </Col>
            <Col xs={24} md={12} lg={8}>
              <Statistic title="Max Salary" value={countryInsights.max_salary} />
            </Col>
            <Col xs={24} md={12} lg={8}>
              <Statistic title="Average Salary" value={countryInsights.average_salary} />
            </Col>
            <Col xs={24} md={12} lg={8}>
              <Statistic title="Median Salary" value={countryInsights.median_salary} />
            </Col>
            <Col xs={24} md={12} lg={8}>
              <Statistic title="Salary Spread (Max - Min)" value={derivedMetrics.salarySpread ?? 0} />
            </Col>
          </Row>
        </Card>
      )}

      {jobInsights && (
        <Card
          title={`Role Insights: ${jobInsights.job_title} (${jobInsights.country})`}
          className="section-card"
        >
          <Space style={{ marginBottom: 12 }}>
            <Tag color="purple">Required Metric</Tag>
            <Text type="secondary">
              Average salary for selected job title in selected country.
            </Text>
          </Space>
          <Row gutter={[16, 16]}>
            <Col xs={24} md={12}>
              <Statistic title="Employee Count" value={jobInsights.employee_count} />
            </Col>
            <Col xs={24} md={12}>
              <Statistic title="Average Salary" value={jobInsights.average_salary} />
            </Col>
            {derivedMetrics.roleVsCountryDelta !== null && (
              <Col xs={24} md={12}>
                <Statistic
                  title="Role Avg vs Country Avg"
                  value={derivedMetrics.roleVsCountryDelta}
                  precision={2}
                  valueStyle={{
                    color: derivedMetrics.roleVsCountryDelta >= 0 ? "#16a34a" : "#dc2626",
                  }}
                  prefix={derivedMetrics.roleVsCountryDelta >= 0 ? "+" : ""}
                />
              </Col>
            )}
          </Row>
        </Card>
      )}
    </Space>
  );
}
