export interface RankItem {
    name: string;
    position: Positions;
}

export enum Positions {
    WideReceiver = "WR",
    RunningBack = "RB",
    TightEnd = "TE",
    QuarterBack = "QB",
    Kicker = "K",
    Defense = "DST"
}