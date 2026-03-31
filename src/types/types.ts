// This interface defines the shape of each test data entry
// TypeScript will enforce that every object in testData.json matches this shape

export interface UserData {
    name: string;
    country: string;
    gender: 'Male' | 'Female';
}
