export interface Service {
    id :string,
    provider : string,
    cost: number,
    duration : number,
    type :string,
    name : string,
    imageSrc : string,
    dateTimes: { date: string, time: string }[] 
}
