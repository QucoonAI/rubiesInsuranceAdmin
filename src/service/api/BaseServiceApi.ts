import { BaseQueryApi, createApi, FetchArgs, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { ErrorResult, handleApiError } from "@/service/http/errorHandling";
import { toast } from 'sonner';

const stage = import.meta.env.VITE_API_STAGE || 'dev';

export const baseUrl = import.meta.env.VITE_APP_ENV === 'dev'
    ? `/api/api/${stage}`
    : `${import.meta.env.VITE_BASE_URL}/api/${stage}`;

const baseQuery = fetchBaseQuery({
    baseUrl,
    prepareHeaders: (headers, { getState }) => {
        const token = (getState() as any).auth?.token;
        if (token) {
            headers.set("Authorization", `Bearer ${token}`);
        }
        return headers;
    },
});

export const createBaseApi = (reducerPath: string, tags: string[]) => {
    const baseQueryWithValidationHandling = async (args: string | FetchArgs, api: BaseQueryApi, extraOptions: object) => {
        const result = await baseQuery(args, api, extraOptions);

        if (result.error) {
            return await handleApiError(result as ErrorResult, api);
        }

        // Handle business logic errors (HTTP 200 but responseCode !== '00')
        const responseData = result.data as { responseCode?: string; responseMessage?: string } | undefined;
        if (responseData?.responseCode && responseData.responseCode !== '00') {
            const errorMessage = responseData.responseMessage || 'An error occurred';

            toast.error(errorMessage, { position: "top-center" });

            return {
                error: {
                    status: 400,
                    data: {
                        error: errorMessage,
                        responseCode: responseData.responseCode,
                        responseMessage: errorMessage
                    }
                }
            };
        }

        return result;
    };

    return createApi({
        reducerPath,
        baseQuery: baseQueryWithValidationHandling,
        tagTypes: tags || [],
        endpoints: () => ({}),
    });
};

export function createApiProxy<T extends Record<string, any>>(api: T): T & Record<string, any> {
    return new Proxy(api, {
        get(target, prop: string) {
            if (prop.startsWith('use') && prop in target) {
                return target[prop as keyof T];
            }
            return target[prop as keyof T];
        }
    }) as T & Record<string, any>;
}
