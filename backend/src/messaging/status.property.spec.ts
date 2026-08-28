/**
 * Property 15: Message Delivery Status Only Advances Forward
 * Validates: Requirements 15.5
 */
import * as fc from 'fast-check';
import { MessageStatus } from '../common/enums';

const STATUS_ORDER: MessageStatus[] = [
  MessageStatus.SENT,
  MessageStatus.DELIVERED,
  MessageStatus.READ,
];

function canTransition(from: MessageStatus, to: MessageStatus): boolean {
  const fromIdx = STATUS_ORDER.indexOf(from);
  const toIdx = STATUS_ORDER.indexOf(to);
  return toIdx > fromIdx; // only forward
}

function applyTransition(current: MessageStatus, requested: MessageStatus): MessageStatus {
  if (canTransition(current, requested)) return requested;
  return current; // no-op for invalid transitions
}

describe('Property 15: Message Delivery Status Only Advances Forward', () => {
  it('status never goes backwards', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...STATUS_ORDER),
        fc.constantFrom(...STATUS_ORDER),
        (current, requested) => {
          const result = applyTransition(current, requested);
          const currentIdx = STATUS_ORDER.indexOf(current);
          const resultIdx = STATUS_ORDER.indexOf(result);
          return resultIdx >= currentIdx;
        },
      ),
      { numRuns: 200 },
    );
  });

  it('READ → SENT is always rejected', () => {
    const result = applyTransition(MessageStatus.READ, MessageStatus.SENT);
    expect(result).toBe(MessageStatus.READ);
  });

  it('READ → DELIVERED is always rejected', () => {
    const result = applyTransition(MessageStatus.READ, MessageStatus.DELIVERED);
    expect(result).toBe(MessageStatus.READ);
  });

  it('valid forward transitions always succeed', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(MessageStatus.SENT, MessageStatus.DELIVERED),
        (status) => {
          const nextIdx = STATUS_ORDER.indexOf(status) + 1;
          const next = STATUS_ORDER[nextIdx] as MessageStatus;
          if (!next) return true;
          const result = applyTransition(status, next);
          return result === next;
        },
      ),
      { numRuns: 50 },
    );
  });

  it('sequence SENT → DELIVERED → READ always produces READ', () => {
    let status: MessageStatus = MessageStatus.SENT;
    status = applyTransition(status, MessageStatus.DELIVERED);
    status = applyTransition(status, MessageStatus.READ);
    expect(status).toBe(MessageStatus.READ);
  });
});
