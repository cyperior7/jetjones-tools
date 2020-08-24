export interface IRankItem {
    name: string;
    position: Positions;
}

export enum Positions {
    WideReceiver = "WR",
    RunningBack = "RB",
    TightEnd = "TE",
    QuarterBack = "QB",
    Kicker = "K",
    Defense = "D/ST"
}