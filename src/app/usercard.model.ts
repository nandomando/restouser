export class Usercard {
    constructor(
        public id: string,
        public imageUrl: string,
        public name: string,
        public address: string,
        public points: number,
        public freemeal: number,
        public restoId: string,
        public userId: string
    ) {}
}
