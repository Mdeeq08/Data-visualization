//import pb from "./pocketbase";
// this is a fake data service to simulate PocketBase data retrieval

export function generateRandomFilters() {
    const all = [1, 2, 3, 4];
    const count = Math.floor(Math.random() * 4) + 1;
    const shuffled = [...all].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}

export function getRandomDuration() {
    const min = 60;
    const max = 300;
    return +(Math.random() * (max - min) + min).toFixed(2);
}

export const getPBUsers = async () => {
    console.warn("⚠️ Using FAKE DATA (PocketBase is unreachable)");

    const genders = ["Male", "Female"];

    const generateUser = (i) => {
        const now = new Date();
        const randomPastDays = Math.floor(Math.random() * 10);
        const endDate = new Date(now.setDate(now.getDate() - randomPastDays));

        return {
            id: i + 1,
            age: 18 + Math.floor(Math.random() * 30),
            gender: genders[Math.floor(Math.random() * genders.length)],
            duration: getRandomDuration(),
            interacted: Math.random() > 0.2,
            handGestures: Math.random() > 0.5, // true or false
            endTime: endDate.toISOString(),
            filters: generateRandomFilters(),
        };
    };

    return Array.from({ length: 500 }, (_, i) => generateUser(i));
};
