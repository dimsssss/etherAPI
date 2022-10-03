export class Page {
  getOffset(total: number, pageSize: number, page: number) {
    if (total < pageSize) {
      return 0;
    }

    return pageSize * page;
  }
  getTotalPage(total: number, pageSize: number) {
    if (total < pageSize) {
      return 1;
    }
    if (total % pageSize > 0) {
      return Number(total / pageSize) + 1;
    }
    return Number(total / pageSize);
  }
}
