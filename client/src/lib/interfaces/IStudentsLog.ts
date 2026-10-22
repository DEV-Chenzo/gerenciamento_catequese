export default interface IStudentsLog {
    id: string;
    name: string;
    classYear: string;
    summary?: {
        select: {
            totalPresents: number;
            totalAbsences: number;
        };
    };
}