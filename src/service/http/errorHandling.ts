import { BaseQueryApi } from "@reduxjs/toolkit/query/react";
import { toast } from 'sonner';
import { persistor } from "@/store";
import { BaseResponse, ValidationError } from "@/types/api";
import { auth } from "@/store/module/auth";

export interface ErrorResult {
    error: {
        status?: number;
        data?: any;
        [key: string]: any;
    };
}

export const handleApiError = async (
    result: ErrorResult,
    api: BaseQueryApi
): Promise<ErrorResult> => {
    if (!result.error) {
        return result;
    }

    const errorData = result.error.data as BaseResponse;
    const errorStatus = result.error.status;

    if (errorData?.responseMessage === "Token expired" || errorStatus === 401) {
        await handleTokenExpiration(api);
        return result;
    }

    if (errorData?.details?.validation_errors) {
        return handleValidationErrors(result, errorData);
    }

    switch (errorStatus) {
        case 403:
            toast.error('You do not have permission to perform this action', {
                position: "top-center"
            });
            break;
        default:
            if (errorData?.responseMessage) {
                toast.error(errorData.responseMessage, {
                    position: "top-center"
                });
            }
    }

    return result;
};

const handleTokenExpiration = async (api: BaseQueryApi): Promise<void> => {
    try {
        await persistor.purge();
        api.dispatch(auth.mutation.reset());
        toast.error('Session expired. Redirecting to login.', {
            position: "top-center"
        });
    } catch (error) {
        console.error('Error during logout:', error);
    }
};

const handleValidationErrors = (
    result: ErrorResult,
    errorData: BaseResponse
): ErrorResult => {
    const validationErrors = errorData.details!.validation_errors as ValidationError[];

    const errorMessages = validationErrors.map((error) => {
        if (error.field) {
            return `${error.field}: ${error.message}`;
        }
        return error.message;
    });

    if (errorMessages.length > 0) {
        toast.error(errorMessages[0], {
            position: "top-center"
        });
    }

    return {
        ...result,
        error: {
            ...result.error,
            data: {
                ...errorData,
                responseMessage: errorMessages.join(', ')
            }
        }
    };
};
