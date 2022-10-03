export class NotFoundChainEventLogException extends Error {
  constructor(subscriptionId: number) {
    super();
    this.message = `로그가 존재하지 않습니다. 구독아이디 : ${subscriptionId}`;
  }
}
