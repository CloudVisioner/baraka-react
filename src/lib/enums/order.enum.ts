export enum OrderStatus {
    PAUSE = "PAUSE",
    PENDING = "PENDING", // Payment proof uploaded, awaiting admin approval
    PROCESS = "PROCESS", // Payment approved, order being processed
    FINISH = "FINISH", // Order completed
    REJECTED = "REJECTED", // Payment proof rejected by admin
    DELETE = "DELETE"
}