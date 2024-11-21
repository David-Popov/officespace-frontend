import { BaseRequest } from "@/types/base-api.type";

export function createRequest<TData>(data: TData): BaseRequest<TData> {
    return {
        requestId: crypto.randomUUID(),
        timestamp: new Date().toISOString(),
        data
    };
}