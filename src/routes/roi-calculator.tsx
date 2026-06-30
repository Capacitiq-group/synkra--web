import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { buildHead } from "@/lib/seo";

export const Route = createFileRoute("/roi-calculator")({
  head: () =>
    buildHead({
      title: "ROI Calculator",
      description:
        "Find out what your current manual processes are costing your business every month and what solving them permanently with AI is worth.",
      path: "/roi-calculator",
    }),
  component: ROICalculatorPage,
});

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-ZA", {
    style: "currency",
    currency: "ZAR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);

const HIRING_ROLES = [
  "Receptionist",
  "Customer service agent",
  "Sales representative",
  "WhatsApp manager",
  "HR and recruitment coordinator",
  "Knowledge manager",
];

const DIY_TASKS = [
  "Answering calls",
  "Responding to WhatsApp messages",
  "Following up on leads",
  "Screening job applications",
  "Answering staff questions",
];

function ROICalculatorPage() {
  const [tab, setTab] = useState<"hiring" | "diy">("hiring");

  return (
    <div className="bg-[#0a0a0a]">
      <div className="container-main section-padding">
        <p className="label-tag">ROI CALCULATOR</p>
        <h1 className="heading-display mt-6 max-w-[800px]">
          Find out what your current manual processes are costing you every
          month.
        </h1>
        <p className="body-text mt-8 max-w-[600px]">
          Run the numbers on your specific situation and see what solving it
          permanently is worth to your business. Choose the comparison that
          fits what you are trying to solve.
        </p>

        <div className="hairline mt-12" />

        <div className="mt-8 flex gap-8">
          <button
            type="button"
            onClick={() => setTab("hiring")}
            className={`pb-2 text-sm font-medium transition-colors cursor-pointer ${
              tab === "hiring"
                ? "text-white border-b-2 border-[var(--color-brand-green)]"
                : "text-white/50 border-b-2 border-transparent"
            }`}
          >
            AI vs Hiring Someone
          </button>
          <button
            type="button"
            onClick={() => setTab("diy")}
            className={`pb-2 text-sm font-medium transition-colors cursor-pointer ${
              tab === "diy"
                ? "text-white border-b-2 border-[var(--color-brand-green)]"
                : "text-white/50 border-b-2 border-transparent"
            }`}
          >
            AI vs Doing It Yourself
          </button>
        </div>

        <div className="mt-10">
          {tab === "hiring" ? <HiringTab /> : <DIYTab />}
        </div>

        <div className="hairline mt-20" />

        <div className="mt-16">
          <h2 className="heading-section max-w-[560px]">
            Ready to stop losing that money every month.
          </h2>
          <div className="mt-8 flex flex-col items-stretch gap-4 sm:flex-row sm:items-center">
            <Link to="/contact" className="btn-primary">
              Get Started
            </Link>
            <Link to="/services" className="btn-secondary">
              See which service fits
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function SliderRow({
  label,
  value,
  min,
  max,
  step,
  onChange,
  display,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
  display: string;
}) {
  return (
    <div>
      <label className="block text-sm text-white/70">{label}</label>
      <p className="display-sm mt-3">{display}</p>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-4 w-full accent-[var(--color-brand-green)] cursor-pointer"
      />
      <div className="mt-1 flex justify-between text-xs text-white/40">
        <span>{min}</span>
        <span>{max}</span>
      </div>
    </div>
  );
}

function HiringTab() {
  const [role, setRole] = useState(HIRING_ROLES[0]);
  const [salary, setSalary] = useState(12000);
  const [hours, setHours] = useState(10);

  const annualHumanCost = salary * 12;
  const annualSynkraCost = 8400;
  const annualSavings = Math.max(0, annualHumanCost - annualSynkraCost);

  return (
    <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
      <div className="card-dark max-w-[480px] space-y-8">
        <p className="label-tag">YOUR SITUATION</p>

        <div>
          <label className="block text-sm text-white/70 mb-3">
            What role would you hire for
          </label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full rounded-md border border-white/10 bg-[#0a0a0a] px-3 py-2.5 text-sm text-white cursor-pointer focus:border-[var(--color-brand-green)] focus:outline-none"
          >
            {HIRING_ROLES.map((r) => (
              <option key={r} value={r} className="bg-[#0a0a0a]">
                {r}
              </option>
            ))}
          </select>
        </div>

        <SliderRow
          label="Estimated monthly salary for that role"
          value={salary}
          min={5000}
          max={25000}
          step={500}
          onChange={setSalary}
          display={formatCurrency(salary)}
        />

        <SliderRow
          label="How many hours a day does this role need to be available"
          value={hours}
          min={8}
          max={24}
          step={1}
          onChange={setHours}
          display={`${hours} hours`}
        />
      </div>

      <div className="card-dark border border-[var(--color-brand-green)]/20 space-y-6">
        <div>
          <p className="label-tag">WHAT YOU WOULD PAY A HUMAN EMPLOYEE</p>
          <div className="mt-4 space-y-2">
            <p className="text-base text-white">
              Monthly salary — {formatCurrency(salary)}
            </p>
            <p className="text-base text-white">
              Hours available — {hours} hours per day, 5 days per week
            </p>
            <p className="text-base text-white">
              Annual cost — {formatCurrency(annualHumanCost)}
            </p>
          </div>
          <p className="mt-3 text-sm text-white/40">
            Sick days, leave, and training time are not included in this number.
          </p>
        </div>

        <div className="hairline" />

        <div>
          <p className="label-tag">WHAT YOU PAY SYNKRA</p>
          <div className="mt-4 space-y-2">
            <p className="text-base text-white">Monthly fee — From R700</p>
            <p className="text-base text-white">
              Hours available — 24 hours per day, 7 days per week, 365 days per
              year
            </p>
            <p className="text-base text-white">Annual cost — From R8,400</p>
          </div>
        </div>

        <div className="hairline" />

        <div>
          <p className="label-tag text-[var(--color-brand-green)]">
            WHAT YOU SAVE IN YEAR ONE
          </p>
          <p className="display-md mt-4">{formatCurrency(annualSavings)}</p>
        </div>

        <Link to="/contact" className="btn-primary w-full justify-center">
          Get Started
        </Link>
      </div>
    </div>
  );
}

function DIYTab() {
  const [hoursWeek, setHoursWeek] = useState(10);
  const [rate, setRate] = useState(500);
  const [task, setTask] = useState(DIY_TASKS[0]);

  const hoursMonth = hoursWeek * 4;
  const monthlyCost = hoursMonth * rate;
  const savings = Math.max(0, monthlyCost - 700);

  return (
    <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
      <div className="card-dark max-w-[480px] space-y-8">
        <p className="label-tag">YOUR SITUATION</p>

        <SliderRow
          label="How many hours per week do you personally spend on this task"
          value={hoursWeek}
          min={1}
          max={40}
          step={1}
          onChange={setHoursWeek}
          display={`${hoursWeek} hours`}
        />

        <SliderRow
          label="What is your time worth per hour"
          value={rate}
          min={150}
          max={2000}
          step={50}
          onChange={setRate}
          display={formatCurrency(rate)}
        />

        <div>
          <label className="block text-sm text-white/70 mb-3">
            Which task are you automating
          </label>
          <select
            value={task}
            onChange={(e) => setTask(e.target.value)}
            className="w-full rounded-md border border-white/10 bg-[#0a0a0a] px-3 py-2.5 text-sm text-white cursor-pointer focus:border-[var(--color-brand-green)] focus:outline-none"
          >
            {DIY_TASKS.map((t) => (
              <option key={t} value={t} className="bg-[#0a0a0a]">
                {t}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="card-dark border border-[var(--color-brand-green)]/20 space-y-6">
        <div>
          <p className="label-tag">WHAT THIS IS COSTING YOU EVERY MONTH</p>
          <div className="mt-4 space-y-2">
            <p className="text-base text-white">
              Hours spent per month — {hoursMonth} hours
            </p>
            <p className="text-base text-white">
              Rand value of that time — {formatCurrency(monthlyCost)}
            </p>
            <p className="text-base text-white">
              What you could be doing instead — {formatCurrency(monthlyCost)}{" "}
              worth of revenue-generating work
            </p>
          </div>
        </div>

        <div className="hairline" />

        <div>
          <p className="label-tag">WHAT SYNKRA COSTS</p>
          <p className="mt-4 text-base text-white">From R700 per month</p>
        </div>

        <div className="hairline" />

        <div className="space-y-6">
          <p className="label-tag text-[var(--color-brand-green)]">
            WHAT YOU GET BACK EVERY MONTH
          </p>
          <div>
            <p className="display-sm">{hoursMonth}</p>
            <p className="label-tag mt-2 text-white/40">
              HOURS RETURNED TO YOUR BUSINESS
            </p>
          </div>
          <div>
            <p className="display-md">{formatCurrency(savings)}</p>
            <p className="label-tag mt-2 text-white/40">
              VALUE OF YOUR TIME SAVED
            </p>
          </div>
        </div>

        <Link to="/contact" className="btn-primary w-full justify-center">
          Get Started
        </Link>
      </div>
    </div>
  );
}
