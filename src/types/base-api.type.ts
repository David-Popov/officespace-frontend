export interface BaseRequest<TData> {
    requestId: string;
    timestamp: string;
    data: TData;
}

export interface BaseResponse<TData>{
    date: Date,
    errorDescription: string,
    responseId: string,
    httpStatus: string,
    description: string,
    data: TData | null
}