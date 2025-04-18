// src/data/analytics-data.js

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
let cachedRawData = [];

function assignRandomDay(entries) {
  return entries.map((entry) => ({
    ...entry,
    day: DAYS[Math.floor(Math.random() * DAYS.length)],
  }));
}

async function fetchRawData() {
  if (cachedRawData.length > 0) return cachedRawData;

  try {
    const response = await fetch("/src/data/database.json");
    if (!response.ok) throw new Error("Failed to fetch raw chart data");
    const rawData = await response.json();
    cachedRawData = assignRandomDay(rawData);
    return cachedRawData;
  } catch (error) {
    console.error("Error fetching chart data:", error);
    return [];
  }
}

export const getBarChartData = async () => {
  const dataWithDays = await fetchRawData();
  const interacted = dataWithDays.filter((d) => d.interacted);

  const grouped = DAYS.map((day) => {
    const dayGroup = interacted.filter((entry) => entry.day === day);

    let Over40M = 0, Under40M = 0, Over40F = 0, Under40F = 0;

    dayGroup.forEach((entry) => {
      const isOver40 = entry.age > 40;
      const gender = entry.gender;

      if (gender === "Male") {
        if (isOver40) Over40M++;
        else Under40M++;
      } else if (gender === "Female") {
        if (isOver40) Over40F++;
        else Under40F++;
      }
    });

    return { day, Over40M, Under40M, Over40F, Under40F };
  });

  return grouped;
};

export const getPieChartData = async () => {
  const rawData = await fetchRawData();
  const interacted = rawData.filter((d) => d.interacted && d.filter);

  const filterCounts = [1, 2, 3, 4].map((filter) => ({
    name: `Filter ${filter}`,
    value: interacted.filter((entry) => entry.filter === filter).length,
  }));

  return filterCounts;
};

export const getAreaChartData = async () => {
  const rawData = await fetchRawData();

  const grouped = DAYS.map((day) => {
    const dayGroup = rawData.filter((entry) => entry.day === day);

    let interacted = 0;
    let notInteracted = 0;

    dayGroup.forEach((entry) => {
      if (entry.interacted) interacted++;
      else notInteracted++;
    });

    return {
      day,
      Interacted: interacted,
      NotInteracted: notInteracted
    };
  });

  return grouped;
};