/**
 * HTTP 返回通用结构
 *
 */
declare interface IResponse {
  code: -1;
  msg: string;
}

/**
 * 分页数据
 */
declare interface IPagination {
  pagination: {
    pageSize: number;
    pageIndex: number;
    totalCount: number;
  };
}
