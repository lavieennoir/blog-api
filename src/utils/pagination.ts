import { PaginationInfo, PaginationParams } from '../schemas/pagination.schema';

export interface PaginatedResponse<T> extends PaginationInfo {
  data: T[];
}

export const DEFAULT_PAGE = 1;
export const DEFAULT_LIMIT = 10;

export const getPaginationParams = (params: PaginationParams) => {
  const page = Math.max(1, Number(params.page) || DEFAULT_PAGE);
  const limit = Math.max(
    1,
    Math.min(100, Number(params.limit) || DEFAULT_LIMIT)
  );
  const skip = (page - 1) * limit;

  return { page, limit, skip };
};
