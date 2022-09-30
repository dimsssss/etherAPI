export class NotFoundSubcription extends Error {
  constructor(subscriptionId) {
    super();
    this.message = `해당 아이디의 구독이 존재하지 않습니다 : ${subscriptionId}`;
  }
}
